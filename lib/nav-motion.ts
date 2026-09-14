import { animationEasing } from "@/lib/animations";
import type { Transition, Variants } from "@/components/ClientMotion";

export const navBarTransition = (reduce: boolean): Transition => ({
  duration: reduce ? 0 : 1.05,
  ease: animationEasing.smoothOut,
  delay: reduce ? 0 : 0.06,
});

export const navBarVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0 },
};

export const navClusterVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.14,
    },
  },
};

export const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.88,
      ease: animationEasing.smoothOut,
    },
  },
};
