"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader, SectionInner, SectionShell } from "@/components/SectionShell";
import { studioLocation } from "@/lib/data";
import { ExternalLink, Navigation } from "lucide-react";

export function Location() {
  return (
    <SectionShell id="location">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <SectionInner>
        <RevealChildren stagger={0.08}>
          <ScrollReveal dramatic>
            <SectionHeader
              eyebrow={studioLocation.eyebrow}
              title={
                <>
                  {studioLocation.heading}{" "}
                  <span className="text-gold/90">{studioLocation.headingAccent}</span>
                </>
              }
            />
          </ScrollReveal>

          <ScrollReveal dramatic delay={0.06} className="relative mt-8 md:mt-10">
            <div className="section-card relative min-h-[320px] overflow-hidden sm:min-h-[380px] md:min-h-[420px]">
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

              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-4 sm:bottom-6 sm:left-6 sm:right-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="section-card rounded-xl border-white/15 bg-bg-primary/85 px-4 py-3 backdrop-blur-md">
                  <p className="label-upper text-gold/90">OD Studio</p>
                  <p className="mt-1 font-outfit text-sm font-medium text-ink-primary">
                    {studioLocation.addressLine2}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {studioLocation.coordinates.lat.toFixed(4)}° N ·{" "}
                    {studioLocation.coordinates.lng.toFixed(4)}° E
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 sm:shrink-0 sm:justify-end">
                  <a
                    href={studioLocation.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-upper inline-flex items-center justify-center gap-2 rounded-full border border-gold/45 bg-gold/15 px-5 py-2.5 text-[0.62rem] text-ink-primary backdrop-blur-sm transition-colors hover:bg-gold/25"
                  >
                    <Navigation className="h-3.5 w-3.5" aria-hidden />
                    Directions
                  </a>
                  <a
                    href={studioLocation.openInMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-upper inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-bg-primary/80 px-5 py-2.5 text-[0.62rem] text-ink-secondary backdrop-blur-sm transition-colors hover:border-gold/35 hover:text-ink-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    Google Maps
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </RevealChildren>
      </SectionInner>
    </SectionShell>
  );
}
