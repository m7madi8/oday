"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { type ReactNode, useRef } from "react";

type KillableTween = {
  kill?: () => void;
  scrollTrigger?: { kill: (reset?: boolean) => void };
};

function killTween(tween: unknown) {
  const t = tween as KillableTween | null | undefined;
  t?.scrollTrigger?.kill(true);
  t?.kill?.();
}

export function GsapStaggerReveal({
  children,
  className,
  start = "top 84%",
  y = 44,
  stagger = 0.08,
  duration = 0.72,
}: {
  children: ReactNode;
  className?: string;
  start?: string;
  y?: number;
  stagger?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    ({ gsap, addCleanup, scopeElement }) => {
      if (!scopeElement) {
        return;
      }

      const targets = scopeElement.querySelectorAll("[data-reveal-item]");
      if (!targets.length) {
        return;
      }

      const tween = gsap.from(targets, {
        opacity: 0,
        y,
        stagger,
        duration,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scopeElement,
          start,
          once: true,
        },
      });

      addCleanup(() => killTween(tween));
    },
    { scope: ref, deps: [start, y, stagger, duration] },
  );

  return (
    <div ref={ref} className={className} style={{ perspective: "1400px" }}>
      {children}
    </div>
  );
}
