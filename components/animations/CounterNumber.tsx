"use client";

import { counterDefaults } from "@/lib/animations";
import { useEffect, useMemo, useRef, type RefObject } from "react";

export interface CounterNumberProps {
  targetNumber: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
  ease?: string;
  /** @deprecated ScrollTrigger start — counters use IntersectionObserver now */
  start?: string;
  delay?: number;
  enabled?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function CounterNumber({
  targetNumber,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  duration = counterDefaults.duration,
  delay = 0,
  enabled = true,
  triggerRef,
}: CounterNumberProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const rafRef = useRef(0);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  const formatValue = useMemo(
    () => (value: number) => {
      const rounded =
        decimals === 0 ? Math.round(value) : Number(value.toFixed(decimals));
      return `${prefix}${formatter.format(rounded)}${suffix}`;
    },
    [decimals, formatter, prefix, suffix],
  );

  const finalText = useMemo(
    () => formatValue(targetNumber),
    [formatValue, targetNumber],
  );

  useEffect(() => {
    hasAnimatedRef.current = false;
    if (valueRef.current) {
      valueRef.current.textContent = formatValue(0);
    }
  }, [targetNumber, prefix, suffix, decimals, formatValue]);

  useEffect(() => {
    if (!enabled) return;

    const valueEl = valueRef.current;
    if (!valueEl) return;

    const runCount = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startAt = performance.now() + delay * 1000;
      const from = 0;
      const to = targetNumber;

      const tick = (now: number) => {
        if (!valueRef.current) return;

        if (now < startAt) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const elapsed = now - startAt;
        const progress = Math.min(1, elapsed / (duration * 1000));
        const current = from + (to - from) * easeOutCubic(progress);
        valueRef.current.textContent = formatValue(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          valueRef.current.textContent = finalText;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const observeTarget = triggerRef?.current ?? valueEl;

    const isVisible = () => {
      const rect = observeTarget.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh * 0.92 && rect.bottom > vh * 0.06;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runCount();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(observeTarget);

    if (isVisible()) {
      runCount();
      observer.disconnect();
    }

    const safety = window.setTimeout(() => {
      if (!hasAnimatedRef.current && valueRef.current) {
        hasAnimatedRef.current = true;
        valueRef.current.textContent = finalText;
      }
    }, 4000);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(safety);
    };
  }, [enabled, targetNumber, duration, delay, formatValue, finalText, triggerRef]);

  if (!enabled) {
    return <span className={className}>{finalText}</span>;
  }

  return (
    <span ref={valueRef} className={className} suppressHydrationWarning>
      {formatValue(0)}
    </span>
  );
}
