"use client";

/**
 * Single client boundary for Framer Motion runtime exports.
 * Import from here instead of `framer-motion` in app components and hooks.
 */
export {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

export type {
  HTMLMotionProps,
  MotionValue,
  Transition,
  UseScrollOptions,
  Variants,
} from "framer-motion";
