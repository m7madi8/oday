"use client";

import {
  animationEasing,
  createMaskRevealTransition,
} from "@/lib/animations";
import { revealInView } from "@/lib/motion-viewport";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { useMemo } from "react";

type RevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

export interface RevealTextProps {
  children: string;
  as?: RevealTag;
  className?: string;
  splitByWords?: boolean;
  wordStagger?: number;
  duration?: number;
  delay?: number;
  rotateFrom?: number;
  yFrom?: string;
  once?: boolean;
}

export function RevealText({
  children,
  as = "h2",
  className,
  splitByWords = true,
  wordStagger = 0.08,
  duration = 0.9,
  delay = 0,
  rotateFrom = 5,
  yFrom = "120%",
  once = true,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();
  const words = useMemo(
    () => children.trim().split(/\s+/).filter(Boolean),
    [children],
  );
  const Tag = as;

  // Word-by-word masking is pure decoration — render the text as-is when motion is off.
  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  if (!splitByWords) {
    return (
      <div style={{ overflow: "hidden" }}>
        <Tag className={className}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: yFrom, rotate: rotateFrom }}
            whileInView={{ y: "0%", rotate: 0 }}
            transition={createMaskRevealTransition(duration, delay)}
            viewport={{ ...revealInView, once }}
          >
            {children}
          </motion.span>
        </Tag>
      </div>
    );
  }

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          style={{ overflow: "hidden", display: "inline-block" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: yFrom, rotate: rotateFrom }}
            whileInView={{ y: "0%", rotate: 0 }}
            transition={{
              duration: Math.max(0.1, duration - 0.2),
              delay: delay + index * wordStagger,
              ease: animationEasing.cinematic,
            }}
            viewport={{ ...revealInView, once }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}
