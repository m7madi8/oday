"use client";

import { StatRing } from "@/components/StatRing";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { hero } from "@/lib/hero-content";
import { softInView } from "@/lib/motion-viewport";
import { useSectionReveal } from "@/lib/section-reveal-context";
import { useInView, useReducedMotion } from "@/components/ClientMotion";
import { useEffect, useRef, useState } from "react";

function statUnit(stat: (typeof hero.stats)[number]) {
  if (stat.suffix === "M") return "millions";
  return stat.label;
}

function statAriaLabel(stat: (typeof hero.stats)[number]) {
  const unit = statUnit(stat);
  const value = `${stat.prefix}${stat.value.toLocaleString("en-US")}`;
  if (unit === "millions") return `${value} ${unit}`;
  return `${value} ${unit}`;
}

export function StudioStats() {
  const reduceMotion = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const sectionReveal = useSectionReveal();
  const containerRef = useRef<HTMLDivElement>(null);
  const localInView = useInView(containerRef, { ...softInView, amount: 0.35 });
  const inView = sectionReveal ? sectionReveal.revealed : localInView;
  const lightMotion = sectionReveal?.lightMotion ?? (reduceMotion || mobilePerf);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (inView) {
      setPlay(true);
    }
  }, [inView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || play) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [play]);

  return (
    <div ref={containerRef} className="contact-proof" role="list">
      {hero.stats.map((stat, index) => (
        <StatRing
          key={stat.label}
          target={stat.value}
          prefix={stat.prefix}
          unit={statUnit(stat)}
          ariaLabel={statAriaLabel(stat)}
          play={play}
          delayMs={lightMotion ? 0 : 80 + index * 140}
          instant={lightMotion}
        />
      ))}
    </div>
  );
}
