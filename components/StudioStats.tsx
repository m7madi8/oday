"use client";

import { CounterNumber } from "@/components/animations/CounterNumber";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { animationEasing } from "@/lib/animations";
import { hero } from "@/lib/hero-content";
import { softInView } from "@/lib/motion-viewport";
import { useSectionReveal } from "@/lib/section-reveal-context";
import { motion, useInView, useReducedMotion } from "@/components/ClientMotion";
import { useRef } from "react";

export function StudioStats() {
  const reduceMotion = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const sectionReveal = useSectionReveal();
  const containerRef = useRef<HTMLDivElement>(null);
  const localInView = useInView(containerRef, softInView);
  const inView = sectionReveal ? sectionReveal.revealed : localInView;
  const lightMotion = sectionReveal?.lightMotion ?? (reduceMotion || mobilePerf);

  return (
    <div ref={containerRef} className="contact-proof" role="list">
      {hero.stats.map((stat, idx) => {
        const countDelay = lightMotion ? 0 : 0.38 + idx * 0.12;

        return (
          <motion.div
            key={stat.label}
            role="listitem"
            className="contact-proof__stat"
            initial={lightMotion ? false : { opacity: 0, y: 8 }}
            animate={lightMotion ? undefined : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: lightMotion ? 0 : 0.62,
              delay: lightMotion ? 0 : 0.34 + idx * 0.1,
              ease: animationEasing.smoothOut,
            }}
            aria-label={`${stat.prefix}${stat.value}${stat.suffix === "M" ? " million" : ""} ${stat.label}`}
          >
            <span className="contact-proof__value">
              <CounterNumber
                className="contact-proof__digits"
                targetNumber={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                delay={countDelay}
                duration={lightMotion ? 0 : 1.85}
                enabled
                playOnMount={false}
                triggerRef={containerRef}
              />
            </span>
            <span className="contact-proof__rule" aria-hidden />
            <span className="contact-proof__label">{stat.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
