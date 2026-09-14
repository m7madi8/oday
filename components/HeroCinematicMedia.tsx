"use client";

import { hero } from "@/lib/hero-content";
import Image from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export type HeroCinematicMediaHandle = {
  goToSlide: (index: number) => boolean;
};

type HeroSlide = (typeof hero.images)[number];

type HeroCinematicMediaProps = {
  slides: readonly HeroSlide[];
  reduceMotion: boolean;
  paused?: boolean;
  onSettled?: (index: number) => void;
};

export const HeroCinematicMedia = forwardRef<HeroCinematicMediaHandle, HeroCinematicMediaProps>(
  function HeroCinematicMedia({ slides, reduceMotion, paused = false, onSettled }, ref) {
    const [active, setActive] = useState(0);
    const canRotate = !reduceMotion && slides.length > 1;
    const settledRef = useRef(onSettled);
    settledRef.current = onSettled;

    const goToSlide = useCallback(
      (nextIndex: number) => {
        if (!canRotate) return false;
        if (nextIndex < 0 || nextIndex >= slides.length) return false;
        setActive((current) => {
          if (nextIndex === current) return current;
          settledRef.current?.(nextIndex);
          return nextIndex;
        });
        return true;
      },
      [canRotate, slides.length],
    );

    useImperativeHandle(ref, () => ({ goToSlide }), [goToSlide]);

    useEffect(() => {
      if (!canRotate || paused) return;

      const holdMs = slides[active]?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;
      const id = window.setTimeout(() => {
        const next = (active + 1) % slides.length;
        setActive(next);
        settledRef.current?.(next);
      }, holdMs);

      return () => window.clearTimeout(id);
    }, [active, canRotate, paused, slides]);

    const visibleSlides = canRotate ? slides : slides.slice(0, 1);

    return (
      <div className="hero-modern__media" aria-hidden>
        <div className="hero-modern__stage">
          {visibleSlides.map((slide, index) => (
            <div
              key={slide.alt}
              className={`hero-modern__layer${index === active ? " is-active" : ""}`}
            >
              <div className="hero-modern__layer-inner">
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  quality={100}
                  unoptimized
                  draggable={false}
                  className="hero-modern__img object-cover"
                  sizes="100vw"
                  style={{ objectPosition: slide.objectPosition }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="hero-modern__scrim" />
      </div>
    );
  },
);
