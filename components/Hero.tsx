"use client";

import { hero } from "@/lib/hero-content";
import { SectionShell } from "@/components/SectionShell";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import Image from "next/image";
import { useEffect, useState } from "react";

const CROSSFADE_S = 2.1;
const easeSoft = [0.33, 1, 0.68, 1] as const;
const easeCinematic = [0.22, 1, 0.36, 1] as const;

/** Subtle per-slide drift — keeps transitions alive without feeling busy. */
const slideMotion = [
  { enter: { scale: 1.06, x: "1.2%", y: 0 }, active: { scale: 1.12, x: "-0.8%", y: "0.6%" } },
  { enter: { scale: 1.08, x: "-1%", y: "0.4%" }, active: { scale: 1.14, x: "0.6%", y: "-0.5%" } },
  { enter: { scale: 1.05, x: 0, y: "0.8%" }, active: { scale: 1.11, x: "-0.4%", y: "-0.6%" } },
] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const slides = hero.images;
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

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

  const holdMs =
    slides[active]?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;

  return (
    <SectionShell
      id="top"
      variant="hero"
      className="hero--ready hero--framed px-[var(--hero-gutter)] pt-[var(--hero-gutter)] pb-0"
    >
      <div className="hero-frame relative z-0 flex min-h-0 flex-1 flex-col">
        <div className="hero-frame__stage pointer-events-none absolute inset-0 z-0">
          <div className="hero-frame__media hero-enter-media relative h-full w-full">
            {slides.map((slide, index) => {
              const isActive = reduceMotion ? index === 0 : index === active;
              const motionProfile = slideMotion[index % slideMotion.length];
              const hold = slide.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;

              return (
                <motion.div
                  key={slide.alt}
                  className="hero-frame__slide absolute inset-0"
                  initial={false}
                  animate={
                    reduceMotion
                      ? { opacity: index === 0 ? 1 : 0 }
                      : {
                          opacity: isActive ? 1 : 0,
                          filter: isActive
                            ? "blur(0px) brightness(1)"
                            : "blur(8px) brightness(0.88)",
                        }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          opacity: { duration: CROSSFADE_S, ease: easeCinematic },
                          filter: { duration: CROSSFADE_S * 0.9, ease: easeSoft },
                        }
                  }
                  style={{ zIndex: isActive ? 2 : 1 }}
                  aria-hidden={!isActive}
                >
                  <motion.div
                    className="hero-frame__ken absolute inset-0"
                    initial={false}
                    animate={
                      reduceMotion
                        ? { scale: 1, x: 0, y: 0 }
                        : isActive
                          ? motionProfile.active
                          : motionProfile.enter
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : isActive
                          ? {
                              duration: hold / 1000,
                              ease: "linear",
                            }
                          : {
                              duration: CROSSFADE_S,
                              ease: easeSoft,
                            }
                    }
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className="hero-frame__img object-cover"
                      sizes="100vw"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="hero-frame__veil" aria-hidden />
          <div className="hero-frame__bloom" aria-hidden />
          <div className="hero-frame__edge" aria-hidden />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="hero-enter-headline pointer-events-auto absolute bottom-[clamp(1.75rem,4.5vw,3.25rem)] left-[clamp(1.25rem,3.5vw,3rem)] w-max max-w-[calc(100vw-2.5rem)] max-sm:left-5">
            <p className="font-sub text-[10px] uppercase tracking-[0.34em] text-white/70 md:text-[11px]">
              {hero.headlineEyebrow}
            </p>

            <span
              className="mt-4 block h-px w-[min(4.5rem,28vw)] origin-left bg-gradient-to-r from-gold/85 via-gold/40 to-transparent"
              aria-hidden
            />

            <h1 className="hero-headline mt-5">
              {hero.headlineBeforeAccent}
              <span className="hero-headline-accent">{hero.headlineAccent}</span>
            </h1>

            <p className="mt-4 max-w-[34ch] font-body text-[12px] font-light leading-relaxed text-white/65 md:max-w-[38ch] md:text-[13px]">
              {hero.headlineSubline}
            </p>
          </div>

          {!reduceMotion && slides.length > 1 ? (
            <div
              className="hero-frame__pips absolute bottom-[clamp(1.75rem,4.5vw,3.25rem)] right-[clamp(1.25rem,3.5vw,3rem)] z-10 flex items-center gap-2 max-sm:right-5"
              aria-hidden
            >
              {slides.map((slide, index) => {
                const isActive = index === active;
                return (
                  <span
                    key={slide.alt}
                    className={`hero-frame__pip ${isActive ? "hero-frame__pip--active" : ""} ${slide.primary ? "hero-frame__pip--primary" : ""}`}
                  >
                    {isActive ? (
                      <motion.span
                        key={progressKey}
                        className="hero-frame__pip-fill"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: holdMs / 1000, ease: "linear" }}
                      />
                    ) : null}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
