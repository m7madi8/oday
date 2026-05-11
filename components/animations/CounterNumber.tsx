"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { counterDefaults } from "@/lib/animations";
import { useMemo, useRef, type RefObject } from "react";

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
  start?: string;
  /** Seconds before the count tween starts (e.g. stagger multiple counters). */
  delay?: number;
  /** When false (e.g. reduced motion), shows the final value with no animation. */
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
  start = counterDefaults.start,
  delay = 0,
  enabled = true,
  triggerRef,
}: CounterNumberProps) {
  const valueRef = useRef<HTMLSpanElement>(null);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  const finalText = useMemo(
    () => `${prefix}${formatter.format(targetNumber)}${suffix}`,
    [formatter, prefix, suffix, targetNumber],
  );

  useGSAP(
    ({ gsap, ScrollTrigger, addCleanup }) => {
      if (!valueRef.current) {
        return;
      }

      const count = { value: 0 };
      valueRef.current.textContent = `${prefix}${formatter.format(0)}${suffix}`;

      const trigger = ScrollTrigger.create({
        trigger: triggerRef?.current ?? valueRef.current,
        start,
        once: true,
        onEnter: () => {
          const tween = gsap.to(count, {
            value: targetNumber,
            duration,
            delay,
            ease,
            snap: { value: 1 / Math.pow(10, decimals) },
            onUpdate: () => {
              if (!valueRef.current) {
                return;
              }

              const rounded =
                decimals === 0
                  ? Math.round(count.value)
                  : Number(count.value.toFixed(decimals));

              valueRef.current.textContent = `${prefix}${formatter.format(
                rounded,
              )}${suffix}`;
            },
          });

          addCleanup(() => killIfPossible(tween));
        },
      });

      return () => killIfPossible(trigger);
    },
    {
      deps: [
        targetNumber,
        suffix,
        prefix,
        decimals,
        duration,
        ease,
        start,
        delay,
        formatter,
        triggerRef,
      ],
      enabled,
    },
  );

  if (!enabled) {
    return <span className={className}>{finalText}</span>;
  }

  return <span ref={valueRef} className={className} />;
}
