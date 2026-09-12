"use client";

import { clearGalleryFocus, readGalleryFocusId } from "@/lib/gallery-return";
import { useEffect, useRef } from "react";

const RETRY_MS = [0, 80, 200, 480, 900];

function scrollToProject(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
  return true;
}

export function GalleryProjectFocus({ layoutKey }: { layoutKey: string }) {
  const lockedId = useRef<string | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;

    const id = lockedId.current ?? readGalleryFocusId();
    if (!id) return;
    lockedId.current = id;

    let cancelled = false;
    const timers: number[] = [];

    RETRY_MS.forEach((delay) => {
      timers.push(
        window.setTimeout(() => {
          if (cancelled || done.current) return;
          if (scrollToProject(id)) {
            done.current = true;
            clearGalleryFocus();
          }
        }, delay),
      );
    });

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [layoutKey]);

  return null;
}
