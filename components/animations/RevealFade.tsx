"use client";

import { animationEasing } from "@/lib/animations";
import { softInView } from "@/lib/motion-viewport";
import { useSectionReveal } from "@/lib/section-reveal-context";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { motion, useInView, useReducedMotion } from "@/components/ClientMotion";
import { useRef, type ReactNode } from "react";

type RevealFadeTag = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4";

const motionTags = {
  p: motion.p,
  span: motion.span,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as const;

export interface RevealFadeProps {
  children: ReactNode;
  as?: RevealFadeTag;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  timing?: "scroll" | "enter";
}

export function RevealFade({
  children,
  as = "p",
  className,
  delay = 0,
  duration = 0.82,
  y = 8,
  timing = "scroll",
}: RevealFadeProps) {
  const reduce = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const sectionReveal = useSectionReveal();
  const ref = useRef(null);
  const inView = useInView(ref, softInView);
  const MotionTag = motionTags[as];
  const shouldShow =
    timing === "enter" || (sectionReveal ? sectionReveal.revealed : inView);
  const lightMotion = sectionReveal?.lightMotion ?? mobilePerf;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  if (mobilePerf && !sectionReveal) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const hidden = lightMotion ? { opacity: 0 } : { opacity: 0, y };
  const visible = { opacity: 1, y: 0 };
  const transition = { duration, delay, ease: animationEasing.smoothOut };

  return (
    <MotionTag ref={ref} className={className}>
      <motion.span
        style={{ display: "block" }}
        initial={hidden}
        animate={shouldShow ? visible : hidden}
        transition={transition}
      >
        {children}
      </motion.span>
    </MotionTag>
  );
}
