"use client";

import { skipEntranceMotion } from "@/lib/animations";
import { softInView } from "@/lib/motion-viewport";
import { useSectionReveal } from "@/lib/section-reveal-context";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "@/components/ClientMotion";
import { Children, isValidElement, useRef, type ReactNode } from "react";

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type RevealChildrenProps = Omit<
  HTMLMotionProps<"div">,
  "children" | "initial" | "whileInView" | "variants" | "animate"
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
  const mobilePerf = useMobilePerfMode();
  const sectionReveal = useSectionReveal();
  const ref = useRef(null);
  const inView = useInView(ref, softInView);
  const shouldShow = sectionReveal ? sectionReveal.revealed : inView;
  const lightMotion = sectionReveal?.lightMotion ?? mobilePerf;

  const items = Children.toArray(children).filter((c) => c != null);

  if (skipEntranceMotion(reduce, mobilePerf)) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants = lightMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
        },
      }
    : childVariants;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      initial="hidden"
      animate={shouldShow ? "visible" : "hidden"}
      {...rest}
    >
      {items.map((child, index) => {
        const key =
          isValidElement(child) && child.key != null ? String(child.key) : `reveal-child-${index}`;
        return (
          <motion.div key={key} variants={itemVariants} className={childClassName}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
