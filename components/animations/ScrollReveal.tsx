"use client";

import { animationEasing } from "@/lib/animations";
import { revealInView } from "@/lib/motion-viewport";
import { motion, useReducedMotion, type HTMLMotionProps } from "@/components/ClientMotion";

type ScrollRevealProps = Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport"> & {
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

  const hidden = reduce
    ? { opacity: 0 }
    : dramatic
      ? { opacity: 0, y: 56, scale: 0.93, filter: "blur(12px)" }
      : { opacity: 0, y: 44, scale: 0.97 };

  const visible = reduce
    ? { opacity: 1 }
    : dramatic
      ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      : { opacity: 1, y: 0, scale: 1 };

  const Motion =
    as === "section" ? motion.section : as === "article" ? motion.article : motion.div;

  return (
    <Motion
      suppressHydrationWarning
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={revealInView}
      transition={{
        duration: reduce ? 0 : dramatic ? 0.82 : 0.68,
        delay: reduce ? 0 : delay,
        ease: animationEasing.cinematic,
      }}
      {...rest}
    >
      {children}
    </Motion>
  );
}
