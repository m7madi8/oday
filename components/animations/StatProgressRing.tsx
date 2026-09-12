"use client";

import { useEffect, useRef } from "react";

const SIZE = 100;
const CX = 50;
const CY = 50;
const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICKS = [0, 90, 180, 270];

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function StatProgressRing({
  duration = 2.4,
  delay = 0,
  enabled = true,
  reduce = false,
  playOnMount = true,
}: {
  duration?: number;
  delay?: number;
  enabled?: boolean;
  reduce?: boolean;
  playOnMount?: boolean;
}) {
  const rootRef = useRef<SVGSVGElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const startedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const arc = arcRef.current;
    if (!arc) return;

    if (reduce) {
      arc.style.strokeDashoffset = "0";
      return;
    }

    arc.style.strokeDashoffset = String(CIRCUMFERENCE);
    startedRef.current = false;
    if (!enabled) return;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const startAt = performance.now() + delay * 1000;

      const tick = (now: number) => {
        if (!arcRef.current) return;
        if (now < startAt) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        const elapsed = now - startAt;
        const durationMs = Math.max(duration, 0.05) * 1000;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = easeOutCubic(progress);
        arcRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - eased));
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
        else arcRef.current.style.strokeDashoffset = "0";
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    if (playOnMount) {
      run();
      return () => cancelAnimationFrame(rafRef.current);
    }

    const observeTarget = rootRef.current;
    if (!observeTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(observeTarget);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [delay, duration, enabled, playOnMount, reduce]);

  return (
    <svg ref={rootRef} className="hero-modern__stat-ring" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
      <circle className="hero-modern__stat-ring-track" cx={CX} cy={CY} r={RADIUS} fill="none" />
      {TICKS.map((angle) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return (
          <line
            key={angle}
            className="hero-modern__stat-ring-tick"
            x1={CX + Math.cos(rad) * 34}
            y1={CY + Math.sin(rad) * 34}
            x2={CX + Math.cos(rad) * 46}
            y2={CY + Math.sin(rad) * 46}
          />
        );
      })}
      <circle
        ref={arcRef}
        className="hero-modern__stat-ring-arc"
        cx={CX}
        cy={CY}
        r={RADIUS}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={reduce ? 0 : CIRCUMFERENCE}
        transform={`rotate(-90 ${CX} ${CY})`}
      />
    </svg>
  );
}
