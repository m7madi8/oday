import { type RefObject, useEffect } from "react";

/**
 * Horizontal overflow strips capture wheel/touch; forward mostly-vertical
 * gestures to the document so the page can scroll naturally over cards.
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

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        touchStart = null;
        return;
      }
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      if (Math.abs(dy) <= Math.abs(dx)) return;
      if (Math.abs(dy) < 8) return;
      e.preventDefault();
    };

    const onTouchEnd = () => {
      touchStart = null;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [ref]);
}
