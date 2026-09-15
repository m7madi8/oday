"use client";

import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { RevealFade } from "@/components/animations/RevealFade";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { skipEntranceMotion } from "@/lib/animations";
import { sectionInView } from "@/lib/motion-viewport";
import { SectionRevealContext } from "@/lib/section-reveal-context";
import { useInView, useReducedMotion } from "@/components/ClientMotion";
import { useRef, type ReactNode } from "react";

export type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "start";
  className?: string;
  titleClassName?: string;
  timing?: "scroll" | "enter";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  titleClassName = "",
  timing = "scroll",
}: SectionHeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const inView = useInView(headerRef, sectionInView);
  const revealed = timing === "enter" || inView;
  const alignClass = align === "center" ? "section-header--center" : "section-header--start";
  const titleIsString = typeof title === "string";
  const titleDelay = 0.1;
  const descriptionDelay = titleIsString
    ? titleDelay + title.trim().split(/\s+/).filter(Boolean).length * 0.05 + 0.08
    : titleDelay + 0.34;
  const titleClass = `section-title mt-2 ${titleClassName}`.trim();

  if (skipEntranceMotion(reduce, mobilePerf)) {
    return (
      <header ref={headerRef} className={`section-header ${alignClass} ${className}`.trim()}>
        <p className="label-upper text-gold/90">{eyebrow}</p>
        <h2 className={titleClass}>{title}</h2>
        {description ? <p className="section-lead mt-2">{description}</p> : null}
      </header>
    );
  }

  return (
    <SectionRevealContext.Provider
      value={{
        revealed,
        lightMotion: reduce || mobilePerf,
      }}
    >
      <header ref={headerRef} className={`section-header ${alignClass} ${className}`.trim()}>
        <RevealFade as="p" className="label-upper text-gold/90" delay={0} timing={timing}>
          {eyebrow}
        </RevealFade>

        {titleIsString ? (
          <AnimatedHeading
            as="h2"
            text={title}
            className={titleClass}
            timing={timing}
            delay={titleDelay}
          />
        ) : (
          <AnimatedHeading
            as="h2"
            className={titleClass}
            timing={timing}
            delay={titleDelay}
          >
            {title}
          </AnimatedHeading>
        )}

        {description ? (
          <RevealFade
            as="p"
            className="section-lead mt-2"
            delay={descriptionDelay}
            timing={timing}
          >
            {description}
          </RevealFade>
        ) : null}
      </header>
    </SectionRevealContext.Provider>
  );
}
