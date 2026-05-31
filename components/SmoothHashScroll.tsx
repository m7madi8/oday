"use client";

import { useReducedMotion } from "@/components/ClientMotion";
import { smoothScrollToId } from "@/lib/smooth-scroll";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

function readHash(): string {
  return window.location.hash.replace(/^#/, "");
}

export function SmoothHashScroll() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  const scrollToCurrentHash = useCallback(
    (delay = 0) => {
      const hash = readHash();
      if (!hash) return;

      const run = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            smoothScrollToId(hash, { reduceMotion: !!reduceMotion });
          });
        });
      };

      if (delay > 0) {
        window.setTimeout(run, delay);
      } else {
        run();
      }
    },
    [reduceMotion],
  );

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/gallery") return;

    const hash = readHash();
    if (!hash) return;

    scrollToCurrentHash(80);
  }, [pathname, scrollToCurrentHash]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a[href]");
      if (!anchor || anchor.hasAttribute("data-native-scroll")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      let hash = "";
      let path = "";
      try {
        const url = new URL(href, window.location.origin);
        path = url.pathname;
        hash = url.hash.replace(/^#/, "");
      } catch {
        return;
      }

      if (!hash) return;

      if (path !== window.location.pathname) return;

      const target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();

      const inMenu = Boolean(anchor.closest("#site-menu-overlay"));
      const delay = inMenu ? 300 : 0;

      smoothScrollToId(hash, { reduceMotion: !!reduceMotion, delay });
      window.history.pushState(null, "", `${path}#${hash}`);
    }

    function onHashChange() {
      const path = window.location.pathname;
      if (path !== "/" && path !== "/gallery") return;
      scrollToCurrentHash(0);
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [reduceMotion, scrollToCurrentHash]);

  return null;
}
