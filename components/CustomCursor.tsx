"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "@/components/ClientMotion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 35, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 35, mass: 0.4 });

  useEffect(() => {
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqWide = window.matchMedia("(min-width: 768px)");

    function update() {
      setEnabled(mqFine.matches && mqWide.matches && !reduceMotion);
    }

    update();
    mqFine.addEventListener("change", update);
    mqWide.addEventListener("change", update);
    return () => {
      mqFine.removeEventListener("change", update);
      mqWide.removeEventListener("change", update);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;

    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40 bg-gold/90 shadow-[0_0_14px_rgba(185,146,61,0.35)] mix-blend-normal"
      style={{ x: sx, y: sy }}
    />
  );
}
