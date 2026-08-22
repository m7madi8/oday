"use client";

import { SECTION_SCROLL_END, SECTION_SCROLL_START } from "@/lib/smooth-scroll";
import { useEffect, useState } from "react";

/** Homepage section ids in scroll order (top → bottom). */
const HOME_SECTIONS = ["top", "services", "gallery", "location", "faq", "contact"] as const;

function getScrollAnchorOffset(): number {
  const stack = getComputedStyle(document.documentElement).getPropertyValue("--hero-nav-stack");
  const parsed = parseFloat(stack);
  return (Number.isFinite(parsed) ? parsed : 72) + 32;
}

type SectionAnchor = { id: string; top: number };

function measureSectionAnchors(): SectionAnchor[] {
  return HOME_SECTIONS.flatMap((id) => {
    const el = document.getElementById(id);
    if (!el) return [];
    return [{ id, top: el.offsetTop }];
  });
}

function detectActiveSection(anchors: SectionAnchor[]): string {
  const position = window.scrollY + getScrollAnchorOffset();
  let current = "top";

  for (const { id, top } of anchors) {
    if (top <= position) {
      current = id;
    }
  }

  return current;
}

/** Highlights nav link for the section currently in view (homepage only). */
export function useActiveSection(enabled: boolean): string {
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    if (!enabled) {
      setActiveSection("top");
      return;
    }

    let anchors = measureSectionAnchors();
    let frame = 0;

    const refreshAnchors = () => {
      anchors = measureSectionAnchors();
    };

    const update = () => {
      const next = detectActiveSection(anchors);
      setActiveSection((prev) => (prev === next ? prev : next));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    refreshAnchors();
    update();
    const t = window.setTimeout(() => {
      refreshAnchors();
      update();
    }, 120);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    const onResize = () => {
      refreshAnchors();
      scheduleUpdate();
    };
    const onScrollEnd = () => {
      refreshAnchors();
      update();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener(SECTION_SCROLL_START, update);
    window.addEventListener(SECTION_SCROLL_END, onScrollEnd);

    return () => {
      window.clearTimeout(t);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", onResize);
      window.removeEventListener(SECTION_SCROLL_START, update);
      window.removeEventListener(SECTION_SCROLL_END, onScrollEnd);
    };
  }, [enabled]);

  return activeSection;
}
