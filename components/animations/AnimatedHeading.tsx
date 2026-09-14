"use client";

import { RevealText } from "@/components/animations/RevealText";
import { animationEasing, createMaskRevealTransition } from "@/lib/animations";
import { softInView } from "@/lib/motion-viewport";
import { useSectionReveal } from "@/lib/section-reveal-context";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { motion, useInView, useReducedMotion } from "@/components/ClientMotion";
import { useRef, type ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as const;

type AnimatedHeadingBase = {
  as?: HeadingTag;
  id?: string;
  className?: string;
  timing?: "scroll" | "enter";
  delay?: number;
  duration?: number;
  splitByWords?: boolean;
  wordStagger?: number;
};

type AnimatedHeadingProps = AnimatedHeadingBase &
  (
    | { text: string; children?: never }
    | { text?: never; children: ReactNode }
  );

function MaskBlock({
  as,
  id,
  className,
  timing,
  delay,
  duration,
  children,
}: AnimatedHeadingBase & { children: ReactNode }) {
  const reduce = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const sectionReveal = useSectionReveal();
  const ref = useRef(null);
  const inView = useInView(ref, softInView);
  const MotionTag = motionTags[as ?? "h2"];
  const transition = createMaskRevealTransition(duration ?? 0.92, delay ?? 0);
  const shouldShow =
    timing === "enter" || (sectionReveal ? sectionReveal.revealed : inView);
  const lightMotion = sectionReveal?.lightMotion ?? mobilePerf;

  if (reduce) {
    const Tag = as ?? "h2";
    return <Tag id={id} className={className}>{children}</Tag>;
  }

  if (mobilePerf && !sectionReveal) {
    const Tag = as ?? "h2";
    return <Tag id={id} className={className}>{children}</Tag>;
  }

  const hidden = lightMotion ? { opacity: 0, y: 12 } : { y: "78%", rotate: 2 };
  const visible = lightMotion ? { opacity: 1, y: 0 } : { y: "0%", rotate: 0 };

  return (
    <MotionTag ref={ref} id={id} className={className}>
      <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.22em", paddingInlineEnd: "0.18em" }}>
        <motion.span
          style={{ display: "block" }}
          initial={hidden}
          animate={shouldShow ? visible : hidden}
          transition={{ ...transition, ease: animationEasing.smoothOut }}
        >
          {children}
        </motion.span>
      </span>
    </MotionTag>
  );
}

export function AnimatedHeading({
  as = "h2",
  id,
  className,
  timing = "scroll",
  delay = 0,
  duration = 0.92,
  splitByWords = true,
  wordStagger = 0.06,
  text,
  children,
}: AnimatedHeadingProps) {
  if (text != null) {
    return (
      <RevealText
        as={as}
        id={id}
        className={className}
        delay={delay}
        duration={duration}
        splitByWords={splitByWords}
        wordStagger={wordStagger}
        rotateFrom={2}
        yFrom="78%"
        timing={timing}
      >
        {text}
      </RevealText>
    );
  }

  return (
    <MaskBlock
      as={as}
      id={id}
      className={className}
      timing={timing}
      delay={delay}
      duration={duration}
    >
      {children}
    </MaskBlock>
  );
}
