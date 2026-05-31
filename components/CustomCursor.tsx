"use client";

import { motion, useMotionValue, useReducedMotion } from "@/components/ClientMotion";
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
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const hoveringRef = useRef(false);
  const rafRef = useRef(0);
  const pendingRef = useRef<{ x: number; y: number; target: EventTarget | null } | null>(null);

  useEffect(() => {
    function updateEnabled() {
      const on =
        isDesktopFinePointer() &&
        !reduceMotion &&
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
  }, [reduceMotion, pathname]);

  useEffect(() => {
    if (!enabled) return;

    function flush() {
      rafRef.current = 0;
      const pending = pendingRef.current;
      if (!pending) return;

      x.set(pending.x);
      y.set(pending.y);

      let nextHover = false;
      if (pending.target instanceof Element) {
        nextHover = !!pending.target.closest(INTERACTIVE);
      }
      if (nextHover !== hoveringRef.current) {
        hoveringRef.current = nextHover;
        setHovering(nextHover);
      }
    }

    function move(e: MouseEvent) {
      pendingRef.current = { x: e.clientX, y: e.clientY, target: e.target };
      if (!visible) setVisible(true);
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flush);
      }
    }

    function onLeave() {
      setVisible(false);
      pendingRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    }

    function onEnter() {
      setVisible(true);
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[700] ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ x, y }}
    >
      <span
        className={`custom-cursor__dot block -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 bg-gold/90 transition-[width,height] duration-150 ${
          hovering ? "h-3.5 w-3.5" : "h-2.5 w-2.5"
        }`}
      />
    </motion.div>
  );
}
