"use client";

import { animationEasing } from "@/lib/animations";
import { softInView } from "@/lib/motion-viewport";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "@/components/ClientMotion";
import { useRef, type ReactNode } from "react";

type ScrollRevealProps = Omit<
  HTMLMotionProps<"div">,
  "initial" | "whileInView" | "viewport" | "animate"
> & {
  delay?: number;
  dramatic?: boolean;
  as?: "div" | "section" | "article";
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  dramatic = false,
  as = "div",
  ...rest
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const ref = useRef(null);
  const inView = useInView(ref, softInView);

  if (reduce || mobilePerf) {
    const Tag = as === "section" ? "section" : as === "article" ? "article" : "div";
    return <Tag className={className}>{children as ReactNode}</Tag>;
  }

  const hidden = dramatic ? { opacity: 0, y: 20 } : { opacity: 0, y: 14 };
  const visible = { opacity: 1, y: 0 };

  const Motion =
    as === "section" ? motion.section : as === "article" ? motion.article : motion.div;

  return (
    <Motion
      ref={ref}
      suppressHydrationWarning
      className={className}
      initial={hidden}
      animate={inView ? visible : hidden}
      transition={{
        duration: dramatic ? 0.5 : 0.42,
        delay,
        ease: animationEasing.smoothOut,
      }}
      {...rest}
    >
      {children}
    </Motion>
  );
}
