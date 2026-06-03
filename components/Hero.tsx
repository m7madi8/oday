"use client";

import { usePreloaderDone } from "@/hooks/usePreloaderDone";
import { hero } from "@/lib/hero-content";
import Image from "next/image";
import heroImage from "@/imgs/exterior.jpg";
import { SectionShell } from "@/components/SectionShell";

export function Hero() {
  const preloaderDone = usePreloaderDone();
  const holdEntrance = !preloaderDone;

  return (
    <SectionShell
      id="top"
      variant="hero"
      className={`px-[var(--hero-gutter)] pt-[var(--hero-gutter)] pb-0${holdEntrance ? " hero--hold-entrance" : " hero--ready"}`}
    >
      <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="hero-enter-media relative h-full w-full brightness-[0.78]">
            <Image
              src={heroImage}
              alt={hero.imageAlt}
              fill
              priority
              fetchPriority="high"
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
    </SectionShell>
  );
}
