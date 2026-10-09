"use client";

import { HeroSlidePicture } from "@/components/HeroSlidePicture";
import { hero } from "@/lib/hero-content";
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

const CROSSFADE_MS = 520;

export const HeroCinematicMedia = forwardRef<HeroCinematicMediaHandle, HeroCinematicMediaProps>(
  function HeroCinematicMedia({ slides, reduceMotion, paused = false, onSettled }, ref) {
    const [active, setActive] = useState(0);
    const [previous, setPrevious] = useState<number | null>(null);
    const [leadReady, setLeadReady] = useState(false);
    const clearPreviousRef = useRef<number | null>(null);
    const canRotate = !reduceMotion && slides.length > 1;
    const settledRef = useRef(onSettled);
    settledRef.current = onSettled;

    const markLeadReady = useCallback(() => {
      setLeadReady(true);
    }, []);

    const commitSlide = useCallback(
      (nextIndex: number) => {
        if (nextIndex < 0 || nextIndex >= slides.length) return;
        setActive((current) => {
          if (nextIndex === current) return current;
          if (clearPreviousRef.current) {
            window.clearTimeout(clearPreviousRef.current);
            clearPreviousRef.current = null;
          }
          if (reduceMotion) {
            setPrevious(null);
          } else {
            setPrevious(current);
            clearPreviousRef.current = window.setTimeout(() => {
              setPrevious(null);
              clearPreviousRef.current = null;
            }, CROSSFADE_MS);
          }
          return nextIndex;
        });
      },
      [reduceMotion, slides.length],
    );

    useEffect(() => {
      settledRef.current?.(active);
    }, [active]);

    const goToSlide = useCallback(
      (nextIndex: number) => {
        if (!canRotate) return false;
        if (nextIndex < 0 || nextIndex >= slides.length) return false;
        commitSlide(nextIndex);
        return true;
      },
      [canRotate, commitSlide, slides.length],
    );

    useImperativeHandle(ref, () => ({ goToSlide }), [goToSlide]);

    useEffect(() => {
      return () => {
        if (clearPreviousRef.current) window.clearTimeout(clearPreviousRef.current);
      };
    }, []);

    useEffect(() => {
      if (leadReady) return;
      const img = document.querySelector(
        ".hero-modern__stage .hero-modern__layer.is-active .hero-modern__img",
      );
      if (img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0) {
        markLeadReady();
      }
    }, [leadReady, markLeadReady]);

    useEffect(() => {
      if (!canRotate || paused || !leadReady) return;

      const holdMs = slides[active]?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;
      const id = window.setTimeout(() => {
        commitSlide((active + 1) % slides.length);
      }, holdMs);

      return () => window.clearTimeout(id);
    }, [active, canRotate, commitSlide, leadReady, paused, slides]);

    const slideCount = canRotate ? slides.length : 1;

    return (
      <div className="hero-modern__media" aria-hidden>
        <div className="hero-modern__stage">
          {slides.slice(0, slideCount).map((slide, index) => {
            const isActive = index === active;
            const isPrevious = index === previous;
            return (
              <div
                key={slide.alt}
                className={`hero-modern__layer${isActive ? " is-active" : ""}${
                  isPrevious ? " is-previous" : ""
                }${reduceMotion ? " hero-modern__layer--instant" : ""}${
                  slide.primary ? " hero-modern__layer--lead-zoom" : ""
                }${index === 1 ? " hero-modern__layer--zoom-from-top" : ""}`}
              >
                <div className="hero-modern__layer-inner">
                  <HeroSlidePicture
                    slide={slide}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={index === 0 ? markLeadReady : undefined}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="hero-modern__scrim" />
      </div>
    );
  },
);
