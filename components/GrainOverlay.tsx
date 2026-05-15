"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";

export function GrainOverlay() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="grain-layer pointer-events-none fixed inset-0 z-[1] mix-blend-soft-light"
      initial={false}
      animate={
        reduceMotion
          ? { opacity: 0.024 }
          : { opacity: [0.018, 0.035, 0.018] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 10, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}
