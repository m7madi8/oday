import { Fraunces } from "next/font/google";

/**
 * Display serif — Fraunces (Undercase Type).
 * Optical sizing is built in; SOFT/WONK stay disciplined for architecture.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});
