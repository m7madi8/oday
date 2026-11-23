"use client";

import { useEffect } from "react";
import { hero } from "@/lib/hero-content";

/**
 * Prefetch all hero stills (public PNGs) after first paint so crossfades never show empty layers.
 */
export function HeroCarouselPrefetch() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    const add = (href: string) => {
      if (!href || document.querySelector(`link[data-hero-prefetch="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = href;
      link.dataset.heroPrefetch = href;
      document.head.appendChild(link);
      links.push(link);
    };

    const run = () => {
      for (const slide of hero.images) {
        add(slide.publicSrc);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 1200 });
      return () => {
        window.cancelIdleCallback(id);
        links.forEach((l) => l.remove());
      };
    }

    const t = window.setTimeout(run, 400);
    return () => {
      window.clearTimeout(t);
      links.forEach((l) => l.remove());
    };
  }, []);

  return null;
}