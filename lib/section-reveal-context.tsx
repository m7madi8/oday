"use client";

import { createContext, useContext } from "react";

export type SectionRevealContextValue = {
  revealed: boolean;
  lightMotion: boolean;
};

export const SectionRevealContext = createContext<SectionRevealContextValue | null>(null);

export function useSectionReveal() {
  return useContext(SectionRevealContext);
}
