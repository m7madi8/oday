"use client";

import { HeroSlidePicture } from "@/components/HeroSlidePicture";
import { hero } from "@/lib/hero-content";
import type { ReactNode } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export type HeroCinematicMediaHandle = {
  goToSlide: (index: number) => boolean;
};

type HeroSlide = (typeof hero.images)[number];

type HeroCinematicMediaProps = {
  slides: readonly HeroSlide[];
  reduceMotion: boolean;
  paused?: boolean;
  lcpFallback?: ReactNode;
  onLeadSlideReady?: () => void;
  onSettled?: (index: number) => void;
};

const CROSSFADE_MS = 520;

export const HeroCinematicMedia = forwardRef<HeroCinematicMediaHandle, HeroCinematicMediaProps>(
  function HeroCinematicMedia(
    { slides, reduceMotion, paused = false, lcpFallback, onLeadSlideReady, onSettled },
    ref,
  ) {
    const [active, setActive] = useState(0);
    const [previous, setPrevious] = useState<number | null>(null);
    const [leadReady, setLeadReady] = useState(false);
    const [introDone, setIntroDone] = useState(false);
    const [carouselExpanded, setCarouselExpanded] = useState(false);
    const clearPreviousRef = useRef<number | null>(null);
    const leadReadyRef = useRef(onLeadSlideReady);
    leadReadyRef.current = onLeadSlideReady;
    const canRotate = !reduceMotion && slides.length > 1;
    const settledRef = useRef(onSettled);
    settledRef.current = onSettled;

    const markLeadReady = useCallback(() => {
      setLeadReady(true);
      leadReadyRef.current?.();
      setCarouselExpanded(true);
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
          settledRef.current?.(nextIndex);
          return nextIndex;
        });
      },
      [reduceMotion, slides.length],
    );

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
      if (document.documentElement.dataset.intro === "done") {
        setIntroDone(true);
        return;
      }
      const onIntroDone = () => setIntroDone(true);
      window.addEventListener("od:intro-done", onIntroDone, { once: true });
      return () => window.removeEventListener("od:intro-done", onIntroDone);
    }, []);

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

    const carouselArmed = introDone && leadReady;

    useEffect(() => {
      if (!canRotate || paused || !carouselArmed) return;

      const holdMs = slides[active]?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;
      const id = window.setTimeout(() => {
        commitSlide((active + 1) % slides.length);
      }, holdMs);

      return () => window.clearTimeout(id);
    }, [active, canRotate, carouselArmed, commitSlide, paused, slides]);

    const slideCount = canRotate ? (carouselExpanded ? slides.length : 1) : 1;

    return (
      <div className="hero-modern__media" aria-hidden>
        <div className="hero-modern__stage">
          {lcpFallback ? (
            <div className={`hero-modern__lcp-fallback${leadReady ? " is-hidden" : ""}`}>
              {lcpFallback}
            </div>
          ) : null}
          {slides.slice(0, slideCount).map((slide, index) => {
            const isActive = index === active;
            const isPrevious = index === previous;
            const waitingLead = Boolean(lcpFallback) && index === 0 && !leadReady;
            return (
              <div
                key={slide.alt}
                className={`hero-modern__layer${isActive ? " is-active" : ""}${
                  isPrevious ? " is-previous" : ""
                }${waitingLead ? " is-waiting-lead" : ""}${
                  reduceMotion ? " hero-modern__layer--instant" : ""
                }${slide.primary ? " hero-modern__layer--lead-zoom" : ""}${
                  index === 1 ? " hero-modern__layer--zoom-from-top" : ""
                }`}
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
