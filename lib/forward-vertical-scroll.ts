import { type RefObject, useEffect } from "react";

type ScrollAxis = "x" | "y";

/**
 * Horizontal overflow strips capture wheel on desktop; forward mostly-vertical
 * wheel gestures to the document. Touch uses CSS `touch-action: pan-x` on the
 * track so horizontal swipes stay on the strip and vertical swipes scroll the page.
 */
export function useForwardVerticalScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      const { deltaX, deltaY } = e;
      if (Math.abs(deltaY) <= Math.abs(deltaX)) return;
      if (deltaY === 0) return;

      window.scrollBy({ top: deltaY, left: 0 });
      e.preventDefault();
    };

    let touchStart: { x: number; y: number } | null = null;
    let lastTouchY: number | null = null;
    let lockedAxis: ScrollAxis | null = null;

    const resetTouch = () => {
      touchStart = null;
      lastTouchY = null;
      lockedAxis = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        resetTouch();
        return;
      }
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
      lastTouchY = t.clientY;
      lockedAxis = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart || e.touches.length !== 1) return;

      const t = e.touches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;

      if (!lockedAxis) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        lockedAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      }

      if (lockedAxis === "x") return;

      const deltaY = t.clientY - (lastTouchY ?? t.clientY);
      lastTouchY = t.clientY;
      if (deltaY === 0) return;

      window.scrollBy({ top: deltaY, left: 0 });
      e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", resetTouch, { passive: true });
    el.addEventListener("touchcancel", resetTouch, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", resetTouch);
      el.removeEventListener("touchcancel", resetTouch);
    };
  }, [ref]);
}
