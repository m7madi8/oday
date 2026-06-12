"use client";

import { SECTION_SCROLL_END, SECTION_SCROLL_START } from "@/lib/smooth-scroll";
import { useEffect, useState } from "react";

/** Homepage section ids in scroll order (top → bottom). */
const HOME_SECTIONS = ["top", "about", "services", "gallery", "location", "faq", "contact"] as const;

function getScrollAnchorOffset(): number {
  const stack = getComputedStyle(document.documentElement).getPropertyValue("--hero-nav-stack");
  const parsed = parseFloat(stack);
  return (Number.isFinite(parsed) ? parsed : 72) + 32;
}

function detectActiveSection(): string {
  const position = window.scrollY + getScrollAnchorOffset();
  let current = "top";

  for (const id of HOME_SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= position) {
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

    let frame = 0;

    const update = () => {
      setActiveSection(detectActiveSection());
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    const t = window.setTimeout(update, 120);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener(SECTION_SCROLL_START, update);
    window.addEventListener(SECTION_SCROLL_END, update);

    return () => {
      window.clearTimeout(t);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener(SECTION_SCROLL_START, update);
      window.removeEventListener(SECTION_SCROLL_END, update);
    };
  }, [enabled]);

  return activeSection;
}
