"use client";

import { useEffect } from "react";
import {
  HERO_DESKTOP_MEDIA,
  HERO_LCP_DESKTOP_SIZES,
  HERO_LCP_QUALITY,
  HERO_MOBILE_MEDIA,
  HERO_MOBILE_SIZES,
  HERO_TABLET_MEDIA,
  HERO_TABLET_SIZES,
  hero,
} from "@/lib/hero-content";
import { getImageProps } from "next/image";

function prefetchHref(props: { srcSet?: string; src?: string }) {
  return props.srcSet || props.src || null;
}

/**
 * After first paint, prefetch remaining hero stills so crossfades never hit an empty layer.
 */
export function HeroCarouselPrefetch() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const shared = { alt: "", fill: true, quality: HERO_LCP_QUALITY, priority: false as const };

    const add = (href: string | null, media: string) => {
      if (!href || document.querySelector(`link[data-hero-prefetch="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = href.split(",")[0]?.trim().split(" ")[0] || href;
      if (media) link.media = media;
      link.dataset.heroPrefetch = link.href;
      document.head.appendChild(link);
      links.push(link);
    };

    const run = () => {
      for (let i = 1; i < hero.images.length; i++) {
        const slide = hero.images[i];
        const mobile = getImageProps({ ...shared, src: slide.srcMobile, sizes: HERO_MOBILE_SIZES });
        const tablet = getImageProps({ ...shared, src: slide.srcTablet, sizes: HERO_TABLET_SIZES });
        const desktop = getImageProps({
          ...shared,
          src: slide.src,
          sizes: HERO_LCP_DESKTOP_SIZES,
        });
        add(prefetchHref(mobile.props), HERO_MOBILE_MEDIA);
        add(prefetchHref(tablet.props), HERO_TABLET_MEDIA);
        add(prefetchHref(desktop.props), HERO_DESKTOP_MEDIA);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 2000 });
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
