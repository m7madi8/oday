"use client";

import { revealInView } from "@/lib/motion-viewport";
import { motion, useReducedMotion, type HTMLMotionProps } from "@/components/ClientMotion";
import { Children, isValidElement, type ReactNode } from "react";

const childVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type RevealChildrenProps = Omit<
  HTMLMotionProps<"div">,
  "children" | "initial" | "whileInView" | "variants"
> & {
  children: ReactNode;
  /** Delay between each direct child (seconds). */
  stagger?: number;
  delayChildren?: number;
  /** Wrapper around each child; default preserves block/grid flow. */
  childClassName?: string;
};

export function RevealChildren({
  children,
  className,
  stagger = 0.055,
  delayChildren = 0,
  childClassName = "min-w-0",
  ...rest
}: RevealChildrenProps) {
  const reduce = useReducedMotion();

  const items = Children.toArray(children).filter((c) => c != null);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={revealInView}
      {...rest}
    >
      {items.map((child, index) => {
        const key =
          isValidElement(child) && child.key != null ? String(child.key) : `reveal-child-${index}`;
        return (
          <motion.div key={key} variants={childVariants} className={childClassName}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
