/** Relaxed viewport so scroll-reveal still runs if IO is strict or layout shifts. */
export const softInView = {
  once: true as const,
  amount: "some" as const,
  margin: "0px 0px 35% 0px",
};

/** Earlier trigger + fraction visible for bolder scroll reveals. */
export const revealInView = {
  once: true as const,
  amount: 0.22 as const,
  margin: "0px 0px -8% 0px",
};
