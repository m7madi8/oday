"use client";

import { isDesktopFinePointer } from "@/lib/animations";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor-hover]";

function isGalleryRoute(pathname: string) {
  return pathname.startsWith("/gallery") || pathname.startsWith("/projects");
}

export function CustomCursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    function updateEnabled() {
      const on =
        isDesktopFinePointer() &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        !isGalleryRoute(pathname);
      setEnabled(on);
      document.documentElement.classList.toggle("custom-cursor-active", on);
    }

    updateEnabled();
    window.addEventListener("resize", updateEnabled);
    return () => {
      window.removeEventListener("resize", updateEnabled);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;

    function applyPosition(x: number, y: number) {
      const el = cursorRef.current;
      if (!el) return;
      posRef.current = { x, y };
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function move(e: MouseEvent) {
      applyPosition(e.clientX, e.clientY);
      if (!visible) setVisible(true);

      let nextHover = false;
      if (e.target instanceof Element) {
        nextHover = !!e.target.closest(INTERACTIVE);
      }
      if (nextHover !== hoveringRef.current) {
        hoveringRef.current = nextHover;
        setHovering(nextHover);
      }
    }

    function onLeave() {
      setVisible(false);
    }

    function onEnter() {
      setVisible(true);
      applyPosition(posRef.current.x, posRef.current.y);
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className={`custom-cursor pointer-events-none fixed left-0 top-0 z-[700] will-change-transform ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span
        className={`custom-cursor__dot block -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 bg-gold/90 transition-[width,height,opacity] duration-75 ease-out ${
          hovering ? "h-3.5 w-3.5" : "h-2.5 w-2.5"
        }`}
      />
    </div>
  );
}
