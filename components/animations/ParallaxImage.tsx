"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { parallaxDefaults } from "@/lib/animations";
import { useRef, type ReactNode } from "react";

type Killable = { kill?: () => void };

function killIfPossible(target: unknown) {
  if (target && typeof target === "object" && "kill" in target) {
    (target as Killable).kill?.();
  }
}

export interface ParallaxImageProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  yPercent?: number;
  start?: string;
  end?: string;
  scrub?: number;
  once?: boolean;
}

export function ParallaxImage({
  children,
  className,
  innerClassName,
  yPercent = parallaxDefaults.yPercent,
  start = parallaxDefaults.start,
  end = parallaxDefaults.end,
  scrub = parallaxDefaults.scrub,
  once = false,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    ({ gsap }) => {
      if (!containerRef.current || !imageRef.current) {
        return;
      }

      const tween = gsap.to(imageRef.current, {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub,
          once,
        },
      });

      return () => killIfPossible(tween);
    },
    { scope: containerRef, deps: [yPercent, start, end, scrub, once] },
  );

  return (
    <div ref={containerRef} className={className}>
      <div ref={imageRef} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
