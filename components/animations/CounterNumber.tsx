"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { counterDefaults } from "@/lib/animations";
import { useEffect, useMemo, useRef, type RefObject } from "react";

type Killable = { kill?: () => void };

function killIfPossible(target: unknown) {
  if (target && typeof target === "object" && "kill" in target) {
    (target as Killable).kill?.();
  }
}

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

export function CounterNumber({
  targetNumber,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  duration = counterDefaults.duration,
  ease = counterDefaults.ease,
  delay = 0,
  enabled = true,
  triggerRef,
}: CounterNumberProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  const zeroText = useMemo(
    () => `${prefix}${formatter.format(0)}${suffix}`,
    [formatter, prefix, suffix],
  );

  const finalText = useMemo(
    () => `${prefix}${formatter.format(targetNumber)}${suffix}`,
    [formatter, prefix, suffix, targetNumber],
  );

  useGSAP(
    ({ gsap, addCleanup }) => {
      const valueEl = valueRef.current;
      if (!valueEl) return;

      valueEl.textContent = zeroText;

      const formatValue = (value: number) => {
        const rounded =
          decimals === 0 ? Math.round(value) : Number(value.toFixed(decimals));
        return `${prefix}${formatter.format(rounded)}${suffix}`;
      };

      const runCount = () => {
        if (hasAnimatedRef.current || !valueRef.current) return;
        hasAnimatedRef.current = true;

        const count = { value: 0 };
        valueRef.current.textContent = zeroText;

        const tween = gsap.to(count, {
          value: targetNumber,
          duration,
          delay,
          ease,
          snap: decimals === 0 ? { value: 1 } : { value: 0.1 },
          onUpdate: () => {
            if (valueRef.current) {
              valueRef.current.textContent = formatValue(count.value);
            }
          },
          onComplete: () => {
            if (valueRef.current) {
              valueRef.current.textContent = finalText;
            }
          },
        });

        addCleanup(() => killIfPossible(tween));
      };

      const observeTarget = triggerRef?.current ?? valueEl;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            runCount();
            observer.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );

      observer.observe(observeTarget);

      return () => observer.disconnect();
    },
    {
      scope: valueRef,
      deps: [targetNumber, suffix, prefix, decimals, duration, ease, delay, zeroText, finalText],
      enabled,
    },
  );

  useEffect(() => {
    hasAnimatedRef.current = false;
  }, [targetNumber, prefix, suffix, decimals]);

  if (!enabled) {
    return <span className={className}>{finalText}</span>;
  }

  return (
    <span ref={valueRef} className={className} suppressHydrationWarning>
      {zeroText}
    </span>
  );
}
