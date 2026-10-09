"use client";

import { studioLocation } from "@/lib/content/location";

const { lat, lng } = studioLocation.coordinates;

/** Live map embed for the Ramallah office (dark-themed via CSS). */
export function OfficeIllustrativeMap() {
  const embedSrc =
    studioLocation.mapEmbedUrl ||
    `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=en&output=embed`;

  return (
    <div className="office-map">
      <iframe
        className="office-map__frame"
        title="OD Architects office — Ramallah, Palestine"
        src={embedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="office-map__veil" aria-hidden />
    </div>
  );
}
