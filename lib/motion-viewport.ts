import type { UseInViewOptions } from "framer-motion";

/** Relaxed viewport so scroll-reveal still runs if IO is strict or layout shifts. */
export const softInView: UseInViewOptions = {
  once: true,
  amount: "some",
  margin: "0px 0px 35% 0px",
};

/** Reliable scroll reveal — triggers early and tolerates layout shifts. */
export const revealInView: UseInViewOptions = {
  once: true,
  amount: "some",
  margin: "0px 0px -12% 0px",
};

/** Section headers — reveal only when the block enters the viewport. */
export const sectionInView: UseInViewOptions = {
  once: true,
  amount: 0.22,
  margin: "0px 0px -8% 0px",
};

/** Card / project entrance — transform + opacity only. */
export const cardInViewHidden = {
  opacity: 0,
  y: 32,
} as const;

export const cardInViewVisible = {
  opacity: 1,
  y: 0,
} as const;
