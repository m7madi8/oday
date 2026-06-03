import { type RefObject, useEffect } from "react";

/**
 * Horizontal overflow strips capture wheel on desktop; forward mostly-vertical
 * wheel gestures to the document. Touch scrolling stays native — use
 * `touch-action: pan-x` on the track so vertical swipes scroll the page naturally.
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

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [ref]);
}
