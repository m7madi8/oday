"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader, SectionInner, SectionShell } from "@/components/SectionShell";
import { studioLocation } from "@/lib/content/location";
import { ExternalLink, Navigation } from "lucide-react";

export function Location() {
  return (
    <SectionShell id="location">
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
                title="OD Architects location on map"
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
                  <p className="label-upper text-gold/90">OD Architects</p>
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
                    className="btn btn--primary btn--sm"
                  >
                    <Navigation className="btn__icon" aria-hidden />
                    Directions
                  </a>
                  <a
                    href={studioLocation.openInMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost btn--sm bg-bg-primary/80 backdrop-blur-sm"
                  >
                    <ExternalLink className="btn__icon" aria-hidden />
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
