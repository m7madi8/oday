"use client";

import { OfficeIllustrativeMap } from "@/components/OfficeIllustrativeMap";
import { RevealFade } from "@/components/animations/RevealFade";
import { OFFICE_DIRECTIONS_URL, studioLocation } from "@/lib/content/location";
import { ArrowUpRight } from "lucide-react";

type OfficeVisitCardProps = {
  delay?: number;
};

export function OfficeVisitCard({ delay = 0.12 }: OfficeVisitCardProps) {
  return (
    <RevealFade as="div" delay={delay} className="office-card">
      <header className="office-card__header">
        <p className="office-card__eyebrow">VISIT OUR OFFICE</p>
        <h3 className="office-card__title">{studioLocation.addressLine2}</h3>
      </header>

      <div className="office-card__map">
        <OfficeIllustrativeMap />
      </div>

      <a
        href={OFFICE_DIRECTIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="office-card__directions"
        data-no-glow
        aria-label={`Get directions to ${studioLocation.addressLine2}`}
      >
        <span>Get Directions</span>
        <span className="office-card__directions-icon" aria-hidden>
          <ArrowUpRight className="h-4 w-4 stroke-[1.75]" />
        </span>
      </a>
    </RevealFade>
  );
}
