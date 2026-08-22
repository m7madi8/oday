"use client";

import { isDesktopFinePointer } from "@/lib/animations";
import { useEffect, useRef, useState } from "react";

const FOLLOW = 0.28;

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
  const targetRef = useRef({ x: -100, y: -100 });
  const drawnRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);
  const nativeRef = useRef(false);

  useEffect(() => {
    function updateEnabled() {
      const on =
        isDesktopFinePointer() &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

    function draw() {
      const drawn = drawnRef.current;
      const target = targetRef.current;
      drawn.x += (target.x - drawn.x) * FOLLOW;
      drawn.y += (target.y - drawn.y) * FOLLOW;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${drawn.x}px, ${drawn.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function startLoop() {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw);
    }

    function stopLoop() {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
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
      targetRef.current = { x: e.clientX, y: e.clientY };

      if (!visibleRef.current) {
        visibleRef.current = true;
        drawnRef.current = { x: e.clientX, y: e.clientY };
        setVisible(true);
        startLoop();
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
      stopLoop();
    }

    function onEnter(e: MouseEvent) {
      visibleRef.current = true;
      drawnRef.current = { x: e.clientX, y: e.clientY };
      targetRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      startLoop();
      readTarget(e.target);
    }

    function onVisibilityChange() {
      if (document.hidden) stopLoop();
      else if (visibleRef.current) startLoop();
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopLoop();
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
      <span className="custom-cursor__ring" />
      <span className="custom-cursor__core" />
    </div>
  );
}
