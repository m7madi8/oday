"use client";

import { scrollTriggerDefaults } from "@/lib/animations";
import {
  type DependencyList,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

type GsapContext = { revert: () => void };

export type GsapLike = {
  registerPlugin: (...plugins: unknown[]) => void;
  to: (...args: unknown[]) => unknown;
  from: (...args: unknown[]) => unknown;
  fromTo: (...args: unknown[]) => unknown;
  timeline: (vars?: Record<string, unknown>) => unknown;
  context?: (callback: () => void, scope?: Element | string) => GsapContext;
};

export type ScrollTriggerLike = {
  create: (config: Record<string, unknown>) => unknown;
  defaults?: (config: Record<string, unknown>) => void;
  refresh?: () => void;
};

type GSAPRuntime = {
  gsap: GsapLike;
  ScrollTrigger: ScrollTriggerLike;
};

type CleanupFn = () => void;

export type UseGSAPApi = {
  gsap: GsapLike;
  ScrollTrigger: ScrollTriggerLike;
  scopeElement: HTMLElement | null;
  addCleanup: (cleanup: CleanupFn) => void;
};

export type UseGSAPInit = (api: UseGSAPApi) => void | CleanupFn;

export interface UseGSAPOptions {
  scope?: RefObject<HTMLElement | null>;
  deps?: DependencyList;
  enabled?: boolean;
  once?: boolean;
}

let runtimePromise: Promise<GSAPRuntime | null> | null = null;
let defaultsRegistered = false;

async function importRuntimeModule(specifier: string): Promise<unknown> {
  const dynamicImport = new Function(
    "moduleName",
    "return import(moduleName)",
  ) as (moduleName: string) => Promise<unknown>;

  return dynamicImport(specifier);
}

async function loadGSAPRuntime(): Promise<GSAPRuntime | null> {
  if (runtimePromise) {
    return runtimePromise;
  }

  runtimePromise = (async () => {
    try {
      const [gsapPkg, scrollTriggerPkg] = await Promise.all([
        importRuntimeModule("gsap"),
        importRuntimeModule("gsap/ScrollTrigger"),
      ]);

      const gsap = (
        gsapPkg as { gsap?: GsapLike; default?: GsapLike }
      ).gsap ?? (gsapPkg as { default?: GsapLike }).default;
      const ScrollTrigger = (
        scrollTriggerPkg as {
          ScrollTrigger?: ScrollTriggerLike;
          default?: ScrollTriggerLike;
        }
      ).ScrollTrigger ?? (scrollTriggerPkg as { default?: ScrollTriggerLike }).default;

      if (!gsap || !ScrollTrigger) {
        return null;
      }

      gsap.registerPlugin(ScrollTrigger);

      if (!defaultsRegistered && ScrollTrigger.defaults) {
        ScrollTrigger.defaults({
          once: scrollTriggerDefaults.once,
          start: scrollTriggerDefaults.start,
        });
        defaultsRegistered = true;
      }

      return { gsap, ScrollTrigger };
    } catch {
      return null;
    }
  })();

  return runtimePromise;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Safe for refs / DOM nodes (avoids JSON circular errors on `RefObject` + `HTMLElement`). */
function dependencyListKey(deps: DependencyList | undefined): string {
  const list = deps ?? [];
  const parts: string[] = [];
  for (const dep of list) {
    if (dep === null || dep === undefined) {
      parts.push(String(dep));
      continue;
    }
    const t = typeof dep;
    if (t === "string" || t === "number" || t === "boolean" || t === "bigint") {
      parts.push(`${t}:${String(dep)}`);
      continue;
    }
    if (t === "symbol") {
      parts.push(`symbol:${String(dep)}`);
      continue;
    }
    if (t === "function") {
      const fn = dep as (...args: unknown[]) => unknown;
      parts.push(`fn:${fn.name || "anonymous"}`);
      continue;
    }
    if (dep instanceof Date) {
      parts.push(`date:${dep.toISOString()}`);
      continue;
    }
    if (typeof Element !== "undefined" && dep instanceof Element) {
      parts.push(`element:${dep.tagName}`);
      continue;
    }
    if (typeof dep === "object" && "current" in dep) {
      const cur = (dep as { current: unknown }).current;
      if (cur === null || cur === undefined) {
        parts.push("ref:null");
        continue;
      }
      if (typeof Element !== "undefined" && cur instanceof Element) {
        parts.push(`ref:el:${cur.tagName}`);
        continue;
      }
      parts.push(`ref:${typeof cur}`);
      continue;
    }
    try {
      parts.push(`json:${JSON.stringify(dep)}`);
    } catch {
      parts.push(`obj:${Object.prototype.toString.call(dep)}`);
    }
  }
  return parts.join("\u241e");
}

export function useGSAP(
  init: UseGSAPInit,
  { scope, deps = [], enabled = true, once = false }: UseGSAPOptions = {},
): void {
  const hasRun = useRef(false);
  /** Stable string key for deps (refs/DOM-safe; effect deps length stays fixed). */
  const depsKey = dependencyListKey(deps);

  useIsomorphicLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (once && hasRun.current) {
      return;
    }

    let cancelled = false;
    let cleanupFromInit: CleanupFn | void;
    const cleanups: CleanupFn[] = [];
    let contextCleanup: CleanupFn | undefined;

    const addCleanup = (cleanup: CleanupFn) => {
      cleanups.push(cleanup);
    };

    void loadGSAPRuntime().then((runtime) => {
      if (!runtime || cancelled) {
        return;
      }

      const scopeElement = scope?.current ?? null;

      if (runtime.gsap.context && scopeElement) {
        const ctx = runtime.gsap.context(() => {
          cleanupFromInit = init({
            gsap: runtime.gsap,
            ScrollTrigger: runtime.ScrollTrigger,
            scopeElement,
            addCleanup,
          });
        }, scopeElement);

        contextCleanup = () => ctx.revert();
      } else {
        cleanupFromInit = init({
          gsap: runtime.gsap,
          ScrollTrigger: runtime.ScrollTrigger,
          scopeElement,
          addCleanup,
        });
      }

      hasRun.current = true;
    });

    return () => {
      cancelled = true;

      if (typeof cleanupFromInit === "function") {
        cleanupFromInit();
      }

      if (contextCleanup) {
        contextCleanup();
      }

      for (const cleanup of cleanups.reverse()) {
        cleanup();
      }
    };
  }, [enabled, once, scope, depsKey]);
}
