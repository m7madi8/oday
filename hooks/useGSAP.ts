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

export function useGSAP(
  init: UseGSAPInit,
  { scope, deps = [], enabled = true, once = false }: UseGSAPOptions = {},
): void {
  const hasRun = useRef(false);
  /** Stable primitive so the effect dependency array length never changes (avoids HMR / optional deps bugs). */
  const depsKey = JSON.stringify(deps ?? []);

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
