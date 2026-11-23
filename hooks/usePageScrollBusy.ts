"use client";

import { useEffect, useState } from "react";

/** True while the page is actively scrolling (settled ~120ms after last scroll). */
export function usePageScrollBusy(settleMs = 120): boolean {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: number | undefined;

    const onScroll = () => {
      setBusy(true);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setBusy(false), settleMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [settleMs]);

  return busy;
}