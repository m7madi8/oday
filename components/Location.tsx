"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { studioLocation } from "@/lib/data";
import { revealInView } from "@/lib/motion-viewport";
import { ExternalLink, Navigation } from "lucide-react";

export function Location() {
  const reduce = useReducedMotion();

  return (
    <section id="location" className="relative overflow-hidden bg-bg-primary py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-gold/[0.06] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-gold/[0.05] blur-3xl"
      />

      <RevealChildren className="relative mx-auto max-w-7xl px-5 md:px-10" stagger={0.08}>
        <ScrollReveal dramatic className="mx-auto max-w-2xl text-center">
          <p className="label-upper text-gold">{studioLocation.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(1.85rem,4vw,3rem)] font-normal italic leading-[1.08] text-ink-primary">
            {studioLocation.heading}{" "}
            <span className="text-gold/90">{studioLocation.headingAccent}</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal dramatic delay={0.06} className="relative mt-10 md:mt-12">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-gold/25 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:min-h-[380px] md:min-h-[440px]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-4 top-4 z-20 h-8 w-8 border-l-2 border-t-2 border-gold/50"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 right-4 z-20 h-8 w-8 border-b-2 border-r-2 border-gold/50"
            />

            <iframe
              title="OD Studio location on map"
              src={studioLocation.mapEmbedUrl}
              className="pointer-events-none absolute inset-0 h-full w-full border-0 opacity-[0.88] contrast-[1.05] saturate-[0.65] brightness-[0.72]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(18,18,18,0.55)_0%,rgba(18,18,18,0.12)_42%,rgba(18,18,18,0.6)_100%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(245, 197, 24,0.12),transparent_60%)]"
            />

            <motion.div
              className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-4 sm:bottom-6 sm:left-6 sm:right-6 sm:flex-row sm:items-end sm:justify-between"
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealInView}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.12 }}
            >
              <div className="rounded-xl border border-white/15 bg-bg-primary/85 px-4 py-3 backdrop-blur-md">
                <p className="label-upper text-gold/90">OD Studio</p>
                <p className="mt-1 font-outfit text-sm font-medium text-ink-primary">
                  {studioLocation.addressLine2}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {studioLocation.coordinates.lat.toFixed(4)}° N · {studioLocation.coordinates.lng.toFixed(4)}° E
                </p>
              </div>

              <motion.div className="flex flex-wrap gap-2.5 sm:shrink-0 sm:justify-end">
                <motion.a
                  href={studioLocation.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-upper inline-flex items-center justify-center gap-2 rounded-full border border-gold/45 bg-gold/15 px-5 py-2.5 text-[0.62rem] text-ink-primary backdrop-blur-sm transition-colors hover:bg-gold/25"
                  whileHover={reduce ? {} : { scale: 1.02 }}
                  whileTap={reduce ? {} : { scale: 0.98 }}
                >
                  <Navigation className="h-3.5 w-3.5" aria-hidden />
                  Directions
                </motion.a>
                <motion.a
                  href={studioLocation.openInMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-upper inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-bg-primary/80 px-5 py-2.5 text-[0.62rem] text-ink-secondary backdrop-blur-sm transition-colors hover:border-gold/35 hover:text-ink-primary"
                  whileHover={reduce ? {} : { scale: 1.02 }}
                  whileTap={reduce ? {} : { scale: 0.98 }}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  Google Maps
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </ScrollReveal>
      </RevealChildren>
    </section>
  );
}
