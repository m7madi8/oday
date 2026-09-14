"use client";

import {
  animationEasing,
  createMaskRevealTransition,
} from "@/lib/animations";
import { softInView } from "@/lib/motion-viewport";
import { useSectionReveal } from "@/lib/section-reveal-context";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { motion, useInView, useReducedMotion } from "@/components/ClientMotion";
import { useMemo, useRef } from "react";

type RevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
} as const;

export interface RevealTextProps {
  children: string;
  as?: RevealTag;
  id?: string;
  className?: string;
  splitByWords?: boolean;
  wordStagger?: number;
  duration?: number;
  delay?: number;
  rotateFrom?: number;
  yFrom?: string;
  once?: boolean;
  timing?: "scroll" | "enter";
}

export function RevealText({
  children,
  as = "h2",
  id,
  className,
  splitByWords = true,
  wordStagger = 0.06,
  duration = 0.9,
  delay = 0,
  rotateFrom = 2,
  yFrom = "78%",
  once = true,
  timing = "scroll",
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const sectionReveal = useSectionReveal();
  const ref = useRef(null);
  const inView = useInView(ref, { ...softInView, once });
  const words = useMemo(
    () => children.trim().split(/\s+/).filter(Boolean),
    [children],
  );
  const MotionTag = motionTags[as];
  const shouldShow =
    timing === "enter" || (sectionReveal ? sectionReveal.revealed : inView);
  const lightMotion = sectionReveal?.lightMotion ?? mobilePerf;

  if (reduceMotion) {
    const Tag = as;
    return <Tag id={id} className={className}>{children}</Tag>;
  }

  if (mobilePerf && !sectionReveal) {
    const Tag = as;
    return <Tag id={id} className={className}>{children}</Tag>;
  }

  const wordDuration = Math.max(0.45, duration - 0.15);
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: wordStagger,
        delayChildren: delay,
      },
    },
  };
  const wordVariants = lightMotion
    ? {
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: wordDuration,
            ease: animationEasing.smoothOut,
          },
        },
      }
    : {
        hidden: { y: yFrom, rotate: rotateFrom },
        show: {
          y: "0%",
          rotate: 0,
          transition: {
            duration: wordDuration,
            ease: animationEasing.smoothOut,
          },
        },
      };

  if (!splitByWords) {
    const hidden = lightMotion ? { opacity: 0, y: 10 } : { y: yFrom, rotate: rotateFrom };
    const visible = lightMotion ? { opacity: 1, y: 0 } : { y: "0%", rotate: 0 };
    const transition = createMaskRevealTransition(duration, delay);

    return (
      <div style={{ overflow: "hidden" }}>
        <MotionTag ref={ref} id={id} className={className}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={hidden}
            animate={shouldShow ? visible : hidden}
            transition={transition}
          >
            {children}
          </motion.span>
        </MotionTag>
      </div>
    );
  }

  return (
    <MotionTag ref={ref} id={id} className={className}>
      <motion.span
        style={{ display: "inline" }}
        variants={containerVariants}
        initial="hidden"
        animate={shouldShow ? "show" : "hidden"}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            style={{ overflow: "hidden", display: "inline-block", verticalAlign: "top" }}
          >
            <motion.span style={{ display: "inline-block" }} variants={wordVariants}>
              {word}
            </motion.span>
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </motion.span>
    </MotionTag>
  );
}
