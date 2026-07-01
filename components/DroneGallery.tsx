"use client";

import "@/app/drone-gallery.css";
import { GalleryGoldLine, GalleryReveal } from "@/components/animations/GalleryMotion";
import { DroneVideoFilm } from "@/components/DroneVideoFilm";
import { droneGalleryContent, droneVideos } from "@/lib/content/drone-videos";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function DroneGallery() {
  const video = droneVideos[0];
  if (!video) return null;

  const copy = droneGalleryContent;
  const filmCount = droneVideos.length;

  return (
    <section className="drone-gallery" aria-labelledby={copy.headingId}>
      <div className="drone-gallery__inner">
        <GalleryReveal dramatic>
          <aside className="drone-gallery__intro">
            <span className="drone-gallery__index" aria-hidden>
              {copy.orderLabel}
            </span>

            <header className="drone-gallery__header">
              <p className="drone-gallery__eyebrow">{copy.eyebrow}</p>
              <h2 id={copy.headingId} className="drone-gallery__title">
                {copy.title}
                <span className="drone-gallery__title-accent">{copy.titleAccent}</span>
              </h2>
              <p className="drone-gallery__lead">{copy.description}</p>

              <ul className="drone-gallery__highlights">
                {copy.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <GalleryGoldLine className="drone-gallery__line" />
            </header>

            <ul className="drone-gallery__specs">
              {copy.specs.map((spec) => (
                <li key={spec.label}>
                  <span className="drone-gallery__spec-label">{spec.label}</span>
                  <span className="drone-gallery__spec-value">{spec.value}</span>
                </li>
              ))}
            </ul>

            <p className="drone-gallery__count label-upper" aria-hidden>
              {String(filmCount).padStart(2, "0")} {filmCount === 1 ? "Film" : "Films"}
            </p>

            <Link
              href={copy.ctaHref}
              className="label-upper drone-gallery__cta inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-7 py-3 text-ink-primary transition-[background-color,border-color,transform] hover:border-gold/65 hover:bg-gold/25 active:scale-[0.99]"
            >
              {copy.ctaLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </aside>
        </GalleryReveal>

        <GalleryReveal delay={0.08} dramatic className="drone-gallery__media">
          <div className="drone-gallery__showcase">
            <DroneVideoFilm video={video} badge={copy.badge} />
            <div className="drone-gallery__caption">
              <p className="drone-gallery__caption-client">{video.client}</p>
              <h3 className="drone-gallery__caption-title">{video.title}</h3>
              <p className="drone-gallery__caption-desc">{video.description}</p>
            </div>
          </div>
        </GalleryReveal>
      </div>
    </section>
  );
}
