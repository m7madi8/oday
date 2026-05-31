"use client";

import { useIsHeroRouteTarget } from "@/hooks/useIsHeroRouteTarget";
import { usePreloaderDone } from "@/hooks/usePreloaderDone";
import { hero } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import heroImage from "@/imgs/exterior.jpg";
import { ServicesDrawer } from "@/components/ServicesDrawer";

export function Hero() {
  const preloaderDone = usePreloaderDone();
  const heroRouteTarget = useIsHeroRouteTarget();
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prioritizeHeroImage = mounted && preloaderDone && heroRouteTarget;

  useEffect(() => {
    setMounted(true);
  }, []);

  const holdEntrance = !preloaderDone;

  return (
    <section
      id="top"
      className={`section-snap relative flex w-full flex-col bg-bg-primary px-[var(--hero-gutter)] pt-[var(--hero-gutter)] pb-0${holdEntrance ? " hero--hold-entrance" : " hero--ready"}`}
    >
      <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="hero-enter-media relative h-full w-full brightness-[0.78]">
            <Image
              src={heroImage}
              alt={hero.imageAlt}
              fill
              priority={prioritizeHeroImage}
              loading={prioritizeHeroImage ? undefined : "lazy"}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 100vw"
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#121212] via-black/20 to-black/30"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[min(48%,260px)] bg-gradient-to-b from-black/62 via-black/28 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="hero-enter-cta pointer-events-auto absolute right-[clamp(1.25rem,4vw,3.75rem)] top-[var(--hero-cta-top)] z-20 max-sm:right-5">
            <button
              type="button"
              data-no-glow
              className="hero-cta-luxe group"
              aria-label={`${hero.ctaLabel} — ${hero.ctaEyebrow}`}
              onClick={() => setDrawerOpen(true)}
            >
              <span className="flex flex-col items-start gap-0.5 pr-0.5 text-left">
                <span className="hero-cta-luxe__eyebrow font-sub uppercase text-gold/75 transition-colors group-hover:text-gold">
                  {hero.ctaEyebrow}
                </span>
                <span className="hero-cta-luxe__label font-ui tracking-[0.04em] text-white/95 transition-colors group-hover:text-white">
                  {hero.ctaLabel}
                </span>
              </span>
              <span className="hero-cta-luxe__icon" aria-hidden>
                <ArrowUpRight className="h-[22px] w-[22px] stroke-[1.75]" />
              </span>
            </button>
          </div>

          <div className="hero-enter-headline pointer-events-auto absolute bottom-[clamp(2rem,5.5vw,3.75rem)] left-[clamp(1.25rem,4vw,3.75rem)] w-max max-w-[calc(100vw-2.5rem)] max-sm:left-5">
            <p className="font-sub text-[10px] uppercase tracking-[0.34em] text-white/62 md:text-[11px]">
              {hero.headlineEyebrow}
            </p>

            <span
              className="mt-4 block h-px w-[min(4.5rem,28vw)] origin-left bg-gradient-to-r from-gold/80 via-gold/35 to-transparent"
              aria-hidden
            />

            <h1 className="hero-headline mt-5">
              {hero.headlineBeforeAccent}
              <span className="hero-headline-accent">{hero.headlineAccent}</span>
            </h1>

            <p className="mt-4 max-w-[34ch] font-body text-[12px] font-light leading-relaxed text-white/58 md:max-w-[38ch] md:text-[13px]">
              {hero.headlineSubline}
            </p>
          </div>
        </div>
      </div>

      <ServicesDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  );
}
