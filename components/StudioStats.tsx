"use client";

import { CounterNumber } from "@/components/animations/CounterNumber";
import { useReducedMotion } from "@/components/ClientMotion";
import { hero } from "@/lib/hero-content";

export function StudioStats() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="contact-proof" role="list">
      {hero.stats.map((stat, idx) => (
        <div
          key={stat.label}
          role="listitem"
          className="contact-proof__stat"
          style={{ ["--stat-delay" as string]: `${idx * 0.14}s` }}
          aria-label={`${stat.prefix}${stat.value}${stat.suffix === "M" ? " million" : ""} ${stat.label}`}
        >
          <span className="contact-proof__value">
            <CounterNumber
              targetNumber={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              delay={reduceMotion ? 0 : idx * 0.16}
              duration={reduceMotion ? 0 : 2.1}
              enabled
              playOnMount={false}
            />
          </span>
          <span className="contact-proof__rule" aria-hidden />
          <span className="contact-proof__label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
