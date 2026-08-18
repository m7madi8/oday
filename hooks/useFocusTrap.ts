"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Keeps Tab inside an open overlay and returns focus to whatever opened it.
 * Without this, tabbing out of a modal leaves the keyboard behind the scrim.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  { autoFocus = true }: { autoFocus?: boolean } = {},
) {
  useEffect(() => {
    if (!active) return;

    const previous = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const autoFocusTimer = autoFocus
      ? window.setTimeout(() => {
          const container = containerRef.current;
          if (!container || container.contains(document.activeElement)) return;
          focusables()[0]?.focus();
        }, 60)
      : null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey && (activeEl === first || !containerRef.current?.contains(activeEl))) {
        e.preventDefault();
        last.focus();
        return;
      }
      if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (autoFocusTimer !== null) window.clearTimeout(autoFocusTimer);
      previous?.focus?.();
    };
  }, [active, autoFocus, containerRef]);
}
