"use client";

import {
  clearHomeScroll,
  readHomeScroll,
  rememberHomeScroll,
  scrollHomeToSaved,
} from "@/lib/home-scroll-return";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const RETRY_MS = [0, 40, 100, 200, 400, 700, 1100, 1800];

export function HomeScrollRestore() {
  const pathname = usePathname();
  const popNavigationRef = useRef(false);
  const lastHomeScrollRef = useRef(0);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    const onPopState = () => {
      popNavigationRef.current = true;
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        popNavigationRef.current = true;
      }
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    if (previousPath === "/" && pathname !== "/") {
      rememberHomeScroll(lastHomeScrollRef.current);
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    }
    previousPathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    function onNavigateAway(event: MouseEvent) {
      if (window.location.pathname !== "/") return;

      const anchor = (event.target as Element).closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      let path = "";
      try {
        path = new URL(href, window.location.origin).pathname;
      } catch {
        return;
      }

      if (path === window.location.pathname) return;

      lastHomeScrollRef.current = window.scrollY;
      rememberHomeScroll(window.scrollY);
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    }

    document.addEventListener("click", onNavigateAway, true);
    return () => document.removeEventListener("click", onNavigateAway, true);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        lastHomeScrollRef.current = window.scrollY;
        rememberHomeScroll(window.scrollY);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const shouldRestore = popNavigationRef.current && readHomeScroll() != null;
    popNavigationRef.current = false;

    if (!shouldRestore) {
      clearHomeScroll();
      return;
    }

    const previousRestoration =
      typeof history !== "undefined" && "scrollRestoration" in history
        ? history.scrollRestoration
        : "auto";

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    let cancelled = false;
    let settled = false;
    const timers = new Set<number>();

    function later(fn: () => void, delay: number) {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, delay);
      timers.add(id);
    }

    function attempt() {
      if (cancelled || settled) return;
      const y = readHomeScroll();
      if (y == null) return;
      if (!scrollHomeToSaved()) return;

      settled = true;
      later(() => {
        if (cancelled) return;
        scrollHomeToSaved();
        clearHomeScroll();
      }, 320);
    }

    function schedule() {
      RETRY_MS.forEach((delay) => later(attempt, delay));
    }

    function replay() {
      if (cancelled) return;
      if (!readHomeScroll()) return;
      settled = false;
      schedule();
    }

    schedule();
    window.addEventListener("popstate", replay);
    window.addEventListener("pageshow", replay);

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      window.removeEventListener("popstate", replay);
      window.removeEventListener("pageshow", replay);
      if ("scrollRestoration" in history && !readHomeScroll()) {
        history.scrollRestoration = previousRestoration;
      }
    };
  }, [pathname]);

  return null;
}
