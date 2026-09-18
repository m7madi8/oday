"use client";

import { useEffect, useRef } from "react";

const RING_RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const DURATION_MS = 1800;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

type StatRingProps = {
  target: number;
  prefix?: string;
  unit: string;
  play: boolean;
  delayMs: number;
  instant?: boolean;
  ariaLabel: string;
};

export function StatRing({
  target,
  prefix = "",
  unit,
  play,
  delayMs,
  instant = false,
  ariaLabel,
}: StatRingProps) {
  const progressRef = useRef<SVGCircleElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const hasPlayedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!play || hasPlayedRef.current) return;

    const progressEl = progressRef.current;
    const countEl = countRef.current;
    const boxEl = boxRef.current;
    if (!progressEl || !countEl || !boxEl) return;

    hasPlayedRef.current = true;

    const finish = () => {
      progressEl.style.strokeDashoffset = "0";
      countEl.textContent = target.toLocaleString("en-US");
    };

    if (instant) {
      finish();
      return;
    }

    const startAt = performance.now() + delayMs;
    progressEl.style.strokeDashoffset = String(CIRCUMFERENCE);
    boxEl.classList.add("is-animating");

    const frame = (now: number) => {
      if (now < startAt) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      const elapsed = now - startAt;
      const t = Math.min(elapsed / DURATION_MS, 1);
      const eased = easeOutExpo(t);

      progressEl.style.strokeDashoffset = String(CIRCUMFERENCE - CIRCUMFERENCE * eased);
      countEl.textContent = Math.round(target * eased).toLocaleString("en-US");

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        boxEl.classList.remove("is-animating");
        finish();
      }
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      boxEl.classList.remove("is-animating");
    };
  }, [play, delayMs, instant, target]);

  return (
    <div className="contact-proof__stat" role="listitem" aria-label={ariaLabel}>
      <div
        ref={boxRef}
        className="contact-proof__ring-box"
      >
        <svg className="contact-proof__ring-svg" viewBox="0 0 178 178" aria-hidden>
          <circle className="contact-proof__ring-track" cx="89" cy="89" r={RING_RADIUS} />
          <circle
            ref={progressRef}
            className="contact-proof__ring-progress"
            cx="89"
            cy="89"
            r={RING_RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={instant ? 0 : CIRCUMFERENCE}
          />
        </svg>
        <div className="contact-proof__ring-center">
          <div className="contact-proof__ring-value">
            {prefix ? <span className="contact-proof__ring-prefix">{prefix}</span> : null}
            <span ref={countRef} className="contact-proof__digits">
              {instant ? target.toLocaleString("en-US") : "0"}
            </span>
            <span
              className={`contact-proof__ring-unit${
                unit === "Projects" ? " contact-proof__ring-unit--title" : ""
              }`}
            >
              {unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
