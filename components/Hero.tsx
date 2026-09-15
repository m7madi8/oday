"use client";

import { HeroCinematicMedia, type HeroCinematicMediaHandle } from "@/components/HeroCinematicMedia";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { hero } from "@/lib/hero-content";
import { SectionShell } from "@/components/SectionShell";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { useRef, useState, type ReactNode } from "react";

const easeCinematic = [0.16, 1, 0.3, 1] as const;

function MaskLine({
  children,
  className,
  delay,
  reduce,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
  reduce: boolean;
}) {
  if (reduce) {
    return (
      <span className={`hero-modern__mask ${className ?? ""}`.trim()}>
        <span className="hero-modern__mask-inner">{children}</span>
      </span>
    );
  }

  return (
    <span className={`hero-modern__mask ${className ?? ""}`.trim()}>
      <motion.span
        className="hero-modern__mask-inner"
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.15, delay, ease: easeCinematic }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function FadeCopy({
  text,
  className,
  delay,
  reduce,
  lightMotion,
}: {
  text: string;
  className: string;
  delay: number;
  reduce: boolean;
  lightMotion?: boolean;
}) {
  if (reduce) {
    return <p className={className}>{text}</p>;
  }

  if (lightMotion) {
    return (
      <motion.p
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay, ease: easeCinematic }}
      >
        {text}
      </motion.p>
    );
  }

  const parts = text.split(/(\s+)/);

  return (
    <p className={className}>
      {parts.map((part, index) =>
        part.trim() ? (
          <motion.span
            key={`${part}-${index}`}
            className="hero-modern__word"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.72,
              delay: delay + index * 0.028,
              ease: easeCinematic,
            }}
          >
            {part}
          </motion.span>
        ) : (
          <span key={`space-${index}`}>{part}</span>
        ),
      )}
    </p>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const cinematicReduce = !!reduceMotion;
  const slides = hero.images;
  const mediaRef = useRef<HeroCinematicMediaHandle>(null);
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [navPaused, setNavPaused] = useState(false);

  const holdMs = slides[active]?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;

  return (
    <SectionShell id="top" variant="hero" className="hero--ready hero--modern">
      <div className="hero-modern">
        <HeroCinematicMedia
          ref={mediaRef}
          slides={slides}
          reduceMotion={cinematicReduce}
          paused={navPaused}
          onSettled={(index) => {
            setActive(index);
            setProgressKey((key) => key + 1);
          }}
        />

        <div className="hero-modern__content">
          <div className="hero-modern__copy">
            <FadeCopy
              className="hero-modern__eyebrow"
              text={hero.headlineEyebrow}
              delay={0.12}
              reduce={!!reduceMotion || mobilePerf}
              lightMotion={mobilePerf}
            />

            <h1 className="hero-modern__headline">
              <MaskLine className="hero-modern__headline-main" delay={0.28} reduce={!!reduceMotion || mobilePerf}>
                {hero.headlineBeforeAccent}
              </MaskLine>
              <MaskLine className="hero-modern__headline-accent" delay={0.46} reduce={!!reduceMotion || mobilePerf}>
                {hero.headlineAccent}
              </MaskLine>
            </h1>

            <FadeCopy
              className="hero-modern__subline"
              text={hero.headlineSubline}
              delay={0.72}
              reduce={!!reduceMotion || mobilePerf}
              lightMotion={mobilePerf}
            />
          </div>

          {!cinematicReduce && slides.length > 1 ? (
            <motion.div
              className="hero-modern__rail"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.88, ease: easeCinematic }}
            >
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
                          <motion.span
                            key={progressKey}
                            className="hero-modern__dot-fill"
                            initial={{ scaleX: 0, y: "-50%" }}
                            animate={{ scaleX: 1, y: "-50%" }}
                            transition={{ duration: holdMs / 1000, ease: "linear" }}
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
