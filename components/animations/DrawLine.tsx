"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { drawLineDefaults } from "@/lib/animations";
import { useRef, type ReactNode } from "react";

type Killable = { kill?: () => void };

function killIfPossible(target: unknown) {
  if (target && typeof target === "object" && "kill" in target) {
    (target as Killable).kill?.();
  }
}

export interface DrawLineProps {
  className?: string;
  svgClassName?: string;
  lineClassName?: string;
  children?: ReactNode;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  duration?: number;
  start?: string;
  circleSelector?: string;
  circleDelay?: number;
  circleStagger?: number;
}

export function DrawLine({
  className,
  svgClassName,
  lineClassName,
  children,
  stroke = "var(--accent-gold)",
  strokeWidth = drawLineDefaults.strokeWidth,
  strokeDasharray = drawLineDefaults.strokeDasharray,
  duration = drawLineDefaults.duration,
  start = drawLineDefaults.start,
  circleSelector = ".process-circle",
  circleDelay = drawLineDefaults.circleDelay,
  circleStagger = drawLineDefaults.circleStagger,
}: DrawLineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useGSAP(
    ({ gsap, addCleanup }) => {
      if (!sectionRef.current || !lineRef.current) {
        return;
      }

      const line = lineRef.current;
      const totalLength = line.getTotalLength();

      line.style.strokeDasharray = `${totalLength} ${totalLength}`;
      line.style.strokeDashoffset = `${totalLength}`;

      const lineTween = gsap.to(line, {
        strokeDashoffset: 0,
        duration,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start,
          once: true,
        },
      });

      addCleanup(() => killIfPossible(lineTween));

      const circles = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>(circleSelector),
      );

      if (circles.length > 0) {
        const circlesTween = gsap.from(circles, {
          scale: 0,
          opacity: 0,
          stagger: circleStagger,
          delay: circleDelay,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start,
            once: true,
          },
        });

        addCleanup(() => killIfPossible(circlesTween));
      }
    },
    {
      scope: sectionRef,
      deps: [duration, start, circleDelay, circleStagger, circleSelector],
    },
  );

  return (
    <div ref={sectionRef} className={className}>
      <svg
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        className={svgClassName}
        aria-hidden
      >
        <line
          ref={lineRef}
          x1="0"
          y1="1"
          x2="100"
          y2="1"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          className={lineClassName}
        />
      </svg>
      {children}
    </div>
  );
}
