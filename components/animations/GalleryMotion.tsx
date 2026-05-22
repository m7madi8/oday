"use client";

import {
  galleryEase,
  galleryPageEnter,
  gallerySectionSwap,
  gallerySpring,
  galleryStaggerContainer,
  galleryStaggerItem,
  galleryTransition,
} from "@/lib/gallery-motion";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "@/components/ClientMotion";
import { Children, isValidElement, type ReactNode } from "react";

type GalleryRevealProps = Omit<HTMLMotionProps<"div">, "initial" | "animate"> & {
  delay?: number;
  dramatic?: boolean;
  as?: "div" | "section" | "header" | "article" | "nav";
};

export function GalleryReveal({
  children,
  delay = 0,
  dramatic = false,
  as = "div",
  className,
  ...rest
}: GalleryRevealProps) {
  const reduce = useReducedMotion();
  const enter = galleryPageEnter(!!reduce, dramatic);
  const Component =
    as === "section"
      ? motion.section
      : as === "header"
        ? motion.header
        : as === "article"
          ? motion.article
          : as === "nav"
            ? motion.nav
            : motion.div;

  return (
    <Component
      className={className}
      initial={enter.initial}
      animate={enter.animate}
      transition={galleryTransition(!!reduce, dramatic ? 0.68 : 0.52, delay)}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function GalleryStagger({
  children,
  className,
  itemVariants = galleryStaggerItem,
  itemClassName,
  stagger = 0.08,
  delayChildren = 0.12,
}: {
  children: ReactNode;
  className?: string;
  itemVariants?: Variants;
  /** Applied to each stagger wrapper (e.g. grid column spans). */
  itemClassName?: string | ((index: number) => string);
  stagger?: number;
  delayChildren?: number;
}) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children).filter((c) => c != null);

  if (reduce) {
    return (
      <div className={className}>
        {items.map((child, index) => {
          const key =
            isValidElement(child) && child.key != null ? String(child.key) : `gallery-stagger-${index}`;
          const extraClass =
            typeof itemClassName === "function" ? itemClassName(index) : (itemClassName ?? "");
          return (
            <div key={key} className={`min-w-0 ${extraClass}`.trim()}>
              {child}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 1 },
        show: { opacity: 1, transition: { staggerChildren: stagger, delayChildren } },
      }}
      initial="hidden"
      animate="show"
    >
      {items.map((child, index) => {
        const key =
          isValidElement(child) && child.key != null ? String(child.key) : `gallery-stagger-${index}`;
        const extraClass =
          typeof itemClassName === "function" ? itemClassName(index) : (itemClassName ?? "");
        return (
          <motion.div key={key} variants={itemVariants} className={`min-w-0 ${extraClass}`.trim()}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function GallerySectionTransition({
  children,
  sectionKey,
  className,
}: {
  children: ReactNode;
  sectionKey: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={sectionKey}
      className={className}
      initial={reduce ? false : gallerySectionSwap.initial}
      animate={gallerySectionSwap.animate}
      exit={reduce ? undefined : gallerySectionSwap.exit}
      transition={galleryTransition(!!reduce, 0.48)}
    >
      {children}
    </motion.div>
  );
}

export function GalleryFilterPill({
  active,
  children,
  className,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  className: string;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <button type="button" role="tab" aria-selected={active} data-no-glow className={`relative ${className}`} onClick={onClick}>
      {active ? (
        <motion.span
          layoutId="gallery-filter-active"
          className="pointer-events-none absolute inset-0 rounded-full border border-gold/50 bg-gold/15"
          transition={reduce ? { duration: 0 } : gallerySpring.soft}
          aria-hidden
        />
      ) : null}
      <span className="relative z-[1]">{children}</span>
    </button>
  );
}

export function GalleryGoldLine({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left bg-gradient-to-r from-transparent via-gold/70 to-transparent ${className ?? ""}`}
      initial={reduce ? false : { scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={galleryTransition(!!reduce, 0.9, 0.15)}
    />
  );
}

export { galleryStaggerContainer, galleryEase, gallerySpring };
