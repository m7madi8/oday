"use client";

import { animationEasing, skipEntranceMotion } from "@/lib/animations";
import { softInView } from "@/lib/motion-viewport";
import { useSectionReveal } from "@/lib/section-reveal-context";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { motion, useInView, useReducedMotion } from "@/components/ClientMotion";
import React, { useRef, type ReactNode, type Ref } from "react";

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

type RevealFadeMotionProps = RevealFadeProps & {
  show: boolean;
  lightMotion: boolean;
  outerRef?: Ref<Element | null>;
};

function RevealFadeMotion({
  children,
  as = "p",
  className,
  delay = 0,
  duration = 0.82,
  y = 8,
  show,
  lightMotion,
  outerRef,
}: RevealFadeMotionProps) {
  const reduce = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const MotionTag = motionTags[as];

  if (skipEntranceMotion(reduce, mobilePerf)) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const hidden = lightMotion ? { opacity: 0 } : { opacity: 0, y };
  const visible = { opacity: 1, y: 0 };
  const transition = { duration, delay, ease: animationEasing.smoothOut };

  return (
    <MotionTag ref={outerRef as React.Ref<never>} className={className}>
      <motion.span
        style={{ display: "block" }}
        initial={hidden}
        animate={show ? visible : hidden}
        transition={transition}
      >
        {children}
      </motion.span>
    </MotionTag>
  );
}

function RevealFadeObserved(props: RevealFadeProps) {
  const ref = useRef(null);
  const inView = useInView(ref, softInView);
  const mobilePerf = useMobilePerfMode();

  return <RevealFadeMotion {...props} show={inView} lightMotion={mobilePerf} outerRef={ref} />;
}

export function RevealFade(props: RevealFadeProps) {
  const sectionReveal = useSectionReveal();
  const mobilePerf = useMobilePerfMode();

  if (props.timing === "enter") {
    return (
      <RevealFadeMotion
        {...props}
        show
        lightMotion={sectionReveal?.lightMotion ?? mobilePerf}
      />
    );
  }

  if (sectionReveal) {
    return (
      <RevealFadeMotion
        {...props}
        show={sectionReveal.revealed}
        lightMotion={sectionReveal.lightMotion ?? mobilePerf}
      />
    );
  }

  return <RevealFadeObserved {...props} />;
}
