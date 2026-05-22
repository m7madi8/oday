import type { Transition, Variants } from "@/components/ClientMotion";
import { animationEasing } from "@/lib/animations";

export const galleryEase = {
  prestige: animationEasing.cinematic,
  snap: animationEasing.smoothOut,
  exit: [0.4, 0, 0.2, 1] as const,
} as const;

export const gallerySpring = {
  stiff: { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.85 },
  soft: { type: "spring" as const, stiffness: 280, damping: 28, mass: 0.9 },
};

export function galleryTransition(
  reduce: boolean,
  duration: number,
  delay = 0,
  ease = galleryEase.prestige,
): Transition {
  return reduce ? { duration: 0 } : { duration, delay, ease };
}

export const gallerySectionSwap = {
  initial: { opacity: 0, y: 28, scale: 0.98, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -18, scale: 0.99, filter: "blur(8px)" },
};

export const galleryStaggerContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.14 },
  },
};

export const galleryStaggerItem: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.94, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: galleryEase.prestige },
  },
};

export const galleryCardItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.92, rotateX: 6 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.58, ease: galleryEase.prestige },
  },
};

export const galleryHubCardItem: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.9, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: galleryEase.prestige },
  },
};

export function galleryPageEnter(reduce: boolean, dramatic = false) {
  if (reduce) return { initial: false, animate: {} };
  return dramatic
    ? {
        initial: { opacity: 0, y: 36, filter: "blur(14px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
      };
}
