"use client";

import { useEffect, useState } from "react";

/** Homepage section ids in scroll order (top → bottom). */
const HOME_SECTIONS = ["top", "about", "services", "location", "faq", "contact"] as const;

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

    const update = () => {
      setActiveSection(detectActiveSection());
    };

    update();
    const t = window.setTimeout(update, 120);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  return activeSection;
}
