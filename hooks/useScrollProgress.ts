import { clamp01 } from "@/lib/animations";
import {
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  type UseScrollOptions,
} from "framer-motion";
import { type RefObject, useState } from "react";

export interface UseScrollProgressOptions {
  target: RefObject<HTMLElement | null>;
  offset?: UseScrollOptions["offset"];
  clamp?: boolean;
  decimals?: number;
}

export interface ScrollProgressResult {
  progress: number;
  percentage: number;
  scrollYProgress: MotionValue<number>;
}

export function useScrollProgress({
  target,
  offset = ["start end", "end start"],
  clamp = true,
  decimals = 4,
}: UseScrollProgressOptions): ScrollProgressResult {
  const { scrollYProgress } = useScroll({
    target,
    offset,
  });

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const normalized = clamp ? clamp01(latest) : latest;
    const rounded =
      decimals >= 0 ? Number(normalized.toFixed(decimals)) : normalized;
    setProgress(rounded);
  });

  return {
    progress,
    percentage: Math.round(progress * 100),
    scrollYProgress,
  };
}
