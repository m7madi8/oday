"use client";

import { StatRing } from "@/components/StatRing";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { about as studioAbout } from "@/lib/content/about";
import { softInView } from "@/lib/motion-viewport";
import { useSectionReveal } from "@/lib/section-reveal-context";
import { useInView, useReducedMotion } from "@/components/ClientMotion";
import { useEffect, useRef, useState } from "react";

function statAriaLabel(stat: (typeof studioAbout.stats)[number]) {
  const value = `${stat.prefix ?? ""}${stat.target.toLocaleString("en-US")}${stat.suffix ?? ""}`;
  return `${value} ${stat.label}`;
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
      {studioAbout.stats.map((stat, index) => (
        <StatRing
          key={stat.label}
          target={stat.target}
          prefix={stat.prefix}
          suffix={stat.suffix}
          unit={stat.label}
          ariaLabel={statAriaLabel(stat)}
          play={play}
          delayMs={lightMotion ? 0 : 80 + index * 140}
          instant={lightMotion}
        />
      ))}
    </div>
  );
}
