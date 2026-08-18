"use client";

import { CounterNumber } from "@/components/animations/CounterNumber";
import { hero } from "@/lib/hero-content";
import { SectionShell } from "@/components/SectionShell";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

const CROSSFADE_S = 1.8;
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
  return (
    <span className={`hero-modern__mask ${className ?? ""}`.trim()}>
      <motion.span
        className="hero-modern__mask-inner"
        initial={reduce ? false : { y: "112%" }}
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
}: {
  text: string;
  className: string;
  delay: number;
  reduce: boolean;
}) {
  if (reduce) {
    return <p className={className}>{text}</p>;
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
  const slides = hero.images;
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [statsReady, setStatsReady] = useState(!!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setStatsReady(true);
      return;
    }
    const id = window.setTimeout(() => setStatsReady(true), 880);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || slides.length < 2) return;

    const current = slides[active];
    const delay = current?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;
    const id = window.setTimeout(() => {
      setActive((i) => (i + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, delay);

    return () => window.clearTimeout(id);
  }, [active, reduceMotion, slides]);

  const holdMs = slides[active]?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;

  return (
    <SectionShell id="top" variant="hero" className="hero--ready hero--modern">
      <div className="hero-modern">
        <div className="hero-modern__media" aria-hidden>
          {slides.map((slide, index) => {
            const isActive = reduceMotion ? index === 0 : index === active;

            return (
              <motion.div
                key={slide.alt}
                className="hero-modern__slide"
                initial={false}
                animate={
                  reduceMotion
                    ? { opacity: index === 0 ? 1 : 0 }
                    : { opacity: isActive ? 1 : 0 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { opacity: { duration: CROSSFADE_S, ease: [0.22, 1, 0.36, 1] } }
                }
                style={{
                  zIndex: isActive ? 2 : 1,
                  ["--hero-pos" as string]: slide.objectPosition,
                  ["--hero-pos-mobile" as string]: slide.objectPositionMobile,
                }}
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  quality={100}
                  className="hero-modern__img object-cover"
                  sizes="100vw"
                />
              </motion.div>
            );
          })}
          <div className="hero-modern__scrim" />
        </div>

        <div className="hero-modern__frame-line" aria-hidden />
        <div className="hero-modern__tag" aria-hidden>
          <span className="hero-modern__tag-mark" />
          <span className="hero-modern__tag-label">Dwg · 01</span>
        </div>

        <div className="hero-modern__content">
          <div className="hero-modern__copy">
            <FadeCopy
              className="hero-modern__eyebrow"
              text={hero.headlineEyebrow}
              delay={0.12}
              reduce={!!reduceMotion}
            />

            <h1 className="hero-modern__headline">
              <MaskLine className="hero-modern__headline-main" delay={0.28} reduce={!!reduceMotion}>
                {hero.headlineBeforeAccent}
              </MaskLine>
              <MaskLine className="hero-modern__headline-accent" delay={0.46} reduce={!!reduceMotion}>
                {hero.headlineAccent}
              </MaskLine>
            </h1>

            <FadeCopy
              className="hero-modern__subline"
              text={hero.headlineSubline}
              delay={0.72}
              reduce={!!reduceMotion}
            />
          </div>

          <motion.div
            className="hero-modern__rail"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.88, ease: easeCinematic }}
          >
            <div className="hero-modern__stats">
              {hero.stats.map((stat, idx) => (
                <div key={stat.label} className="hero-modern__stat">
                  <span className="hero-modern__stat-value">
                    <CounterNumber
                      targetNumber={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      delay={reduceMotion ? 0 : idx * 0.22}
                      duration={reduceMotion ? 0 : 2.15}
                      enabled={statsReady}
                      holdAtZero={!statsReady && !reduceMotion}
                      playOnMount
                    />
                  </span>
                  <span className="hero-modern__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {!reduceMotion && slides.length > 1 ? (
              <div className="hero-modern__nav">
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
                          setActive(index);
                          setProgressKey((k) => k + 1);
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
            ) : null}
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
