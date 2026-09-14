"use client";

import {
  clearGalleryFocus,
  notifyGalleryFocus,
  readGalleryFocusId,
  scrollGalleryProjectIntoView,
} from "@/lib/gallery-return";
import { useEffect } from "react";

const RETRY_MS = [0, 40, 100, 200, 400, 700, 1100, 1800, 2600];

export function GalleryProjectFocus({ layoutKey }: { layoutKey: string }) {
  useEffect(() => {
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
      const id = readGalleryFocusId();
      if (!id) return;

      notifyGalleryFocus(id);
      if (!scrollGalleryProjectIntoView(id)) return;

      settled = true;
      later(() => {
        if (cancelled) return;
        scrollGalleryProjectIntoView(id);
        clearGalleryFocus();
      }, 320);
    }

    function schedule() {
      RETRY_MS.forEach((delay) => later(attempt, delay));
    }

    function replay() {
      if (cancelled) return;
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
      if ("scrollRestoration" in history && !readGalleryFocusId()) {
        history.scrollRestoration = previousRestoration;
      }
    };
  }, [layoutKey]);

  return null;
}
