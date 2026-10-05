"use client";

import { HeroCinematicMedia, type HeroCinematicMediaHandle } from "@/components/HeroCinematicMedia";
import { useReducedMotion } from "@/components/ClientMotion";
import { heroCopy } from "@/lib/hero-copy";
import { hero } from "@/lib/hero-content";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

type HeroProps = {
  /** Server-rendered LCP still — shown until the carousel lead slide is ready. */
  lcpFallback?: ReactNode;
};

export function Hero({ lcpFallback }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const cinematicReduce = !!reduceMotion;
  const slides = hero.images;
  const mediaRef = useRef<HeroCinematicMediaHandle>(null);
  const [active, setActive] = useState(0);
  const [navPaused, setNavPaused] = useState(false);
  const [lcpHidden, setLcpHidden] = useState(false);

  return (
    <div className="hero-modern hero-modern--instant">
      <HeroCinematicMedia
        ref={mediaRef}
        slides={slides}
        reduceMotion={cinematicReduce}
        paused={navPaused}
        lcpFallback={lcpHidden ? null : lcpFallback}
        onLeadSlideReady={() => setLcpHidden(true)}
        onSettled={(index) => {
          setActive(index);
        }}
      />

      <div className="hero-modern__content">
        <div className="hero-modern__copy">
          <p className="hero-modern__eyebrow">{heroCopy.headlineEyebrow}</p>

          <h1 className="hero-modern__headline">
            <span className="hero-modern__mask hero-modern__headline-main">
              <span className="hero-modern__mask-inner">{heroCopy.headlineBeforeAccent}</span>
            </span>
            <span className="hero-modern__mask hero-modern__headline-accent">
              <span className="hero-modern__mask-inner">{heroCopy.headlineAccent}</span>
            </span>
          </h1>

          <p className="hero-modern__subline">{heroCopy.headlineSubline}</p>
        </div>

        {slides.length > 1 ? (
          <div className="hero-modern__rail">
            <div
              className="hero-modern__nav"
              onMouseEnter={() => setNavPaused(true)}
              onMouseLeave={() => setNavPaused(false)}
              onFocusCapture={() => setNavPaused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setNavPaused(false);
                }
              }}
            >
              <span className="hero-modern__counter" aria-live="polite">
                {String(active + 1).padStart(2, "0")}
                <span className="hero-modern__counter-sep">/</span>
                {String(slides.length).padStart(2, "0")}
              </span>

              <div className="hero-modern__dots">
                {slides.map((slide, index) => {
                  const isActive = index === active;
                  return (
                    <button
                      key={slide.alt}
                      type="button"
                      data-no-glow
                      className={`hero-modern__dot ${isActive ? "is-active" : ""}`}
                      aria-label={`Show slide ${index + 1} of ${slides.length}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => {
                        mediaRef.current?.goToSlide(index);
                      }}
                    >
                      <span className="hero-modern__dot-line" aria-hidden />
                      {isActive ? (
                        <span className="hero-modern__dot-fill hero-modern__dot-fill--static" aria-hidden />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
