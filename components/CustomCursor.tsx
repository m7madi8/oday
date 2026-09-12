"use client";

import { isDesktopFinePointer } from "@/lib/animations";
import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  "a, button, [role='button'], [type='button'], [type='submit'], label, summary, [data-cursor-hover]";

const NATIVE_TEXT =
  "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']):not([type='file']):not([type='color']), textarea, [contenteditable='true']";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [native, setNative] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);
  const nativeRef = useRef(false);

  useEffect(() => {
    function updateEnabled() {
      const on = isDesktopFinePointer();
      setEnabled(on);
      document.documentElement.classList.toggle("custom-cursor-active", on);
    }

    updateEnabled();
    window.addEventListener("resize", updateEnabled);
    return () => {
      window.removeEventListener("resize", updateEnabled);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function place(x: number, y: number) {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }

    function readTarget(el: EventTarget | null) {
      let nextHover = false;
      let nextNative = false;
      if (el instanceof Element) {
        nextNative = !!el.closest(NATIVE_TEXT);
        nextHover = !nextNative && !!el.closest(INTERACTIVE);
      }
      if (nextHover !== hoveringRef.current) {
        hoveringRef.current = nextHover;
        setHovering(nextHover);
      }
      if (nextNative !== nativeRef.current) {
        nativeRef.current = nextNative;
        setNative(nextNative);
      }
    }

    function move(e: MouseEvent) {
      place(e.clientX, e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      readTarget(e.target);
    }

    function onLeave() {
      visibleRef.current = false;
      setVisible(false);
      setHovering(false);
      setNative(false);
      hoveringRef.current = false;
      nativeRef.current = false;
    }

    function onEnter(e: MouseEvent) {
      visibleRef.current = true;
      place(e.clientX, e.clientY);
      setVisible(true);
      readTarget(e.target);
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  const show = visible && !native;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className={`custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] ${
        show ? "custom-cursor--on" : ""
      } ${hovering ? "custom-cursor--hover" : ""}`}
    >
      <svg className="custom-cursor__mark" viewBox="0 0 24 24" width="22" height="22">
        <polygon
          className="custom-cursor__diamond"
          points="12,2.4 21.6,12 12,21.6 2.4,12"
        />
      </svg>
    </div>
  );
}
