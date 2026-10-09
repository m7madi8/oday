"use client";

import { MagneticButton } from "@/components/animations/MagneticButton";
import { HeroCinematicMedia, type HeroCinematicMediaHandle } from "@/components/HeroCinematicMedia";
import { SectionShell } from "@/components/SectionShell";
import { StartProjectModal } from "@/components/StartProjectModal";
import { useReducedMotion } from "@/components/ClientMotion";
import { heroCopy } from "@/lib/hero-copy";
import { hero } from "@/lib/hero-content";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const cinematicReduce = !!reduceMotion;
  const slides = hero.images;
  const mediaRef = useRef<HeroCinematicMediaHandle>(null);
  const [active, setActive] = useState(0);
  const [navPaused, setNavPaused] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const closeProjectForm = useCallback(() => setFormOpen(false), []);

  return (
    <SectionShell id="top" variant="hero" className="hero--ready hero--modern">
      <div className="hero-modern hero-modern--instant">
        <HeroCinematicMedia
          ref={mediaRef}
          slides={slides}
          reduceMotion={cinematicReduce}
          paused={navPaused || formOpen}
          onSettled={(index) => {
            setActive(index);
          }}
        />

        <div className="hero-modern__content">
          <div className="hero-modern__copy">
            <div className="hero-modern__eyebrow-stack">
              <p className="hero-modern__eyebrow hero-modern__eyebrow--light">
                {heroCopy.headlineEyebrow}
              </p>
              <p className="hero-modern__eyebrow hero-modern__eyebrow--gold">
                {heroCopy.headlineEyebrowGold}
              </p>
            </div>

            <div className="hero-modern__copy-body">
              <h1 className="hero-modern__headline">
                <span className="hero-modern__headline-main">
                  {heroCopy.headlineBeforeAccent}
                </span>{" "}
                <span className="hero-modern__headline-accent">
                  {heroCopy.headlineAccent}
                </span>
              </h1>

              <p className="hero-modern__subline">
                {heroCopy.headlineSublineLines.map((line) => (
                  <span key={line} className="hero-modern__subline-line">
                    {line}
                  </span>
                ))}
              </p>

              <p className="hero-modern__services">{heroCopy.servicesLine}</p>

              <MagneticButton className="hero-modern__cta-wrap inline-flex">
                <button
                  type="button"
                  className="btn btn--primary"
                  data-no-glow
                  onClick={() => setFormOpen(true)}
                >
                  <span>{heroCopy.projectCtaLabel}</span>
                  <ArrowUpRight className="h-[18px] w-[18px] stroke-[1.75]" aria-hidden />
                </button>
              </MagneticButton>
            </div>
          </div>

          {slides.length > 1 ? (
            <div
              className="hero-modern__slide-nav"
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

              <div className="hero-modern__dots" role="tablist" aria-label="Hero slides">
                {slides.map((slide, index) => {
                  const isActive = index === active;
                  return (
                    <button
                      key={slide.alt}
                      type="button"
                      role="tab"
                      data-no-glow
                      className={`hero-modern__dot ${isActive ? "is-active" : ""}`}
                      aria-label={`Show slide ${index + 1} of ${slides.length}`}
                      aria-selected={isActive}
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
          ) : null}
        </div>
      </div>

      <StartProjectModal open={formOpen} onClose={closeProjectForm} />
    </SectionShell>
  );
}
