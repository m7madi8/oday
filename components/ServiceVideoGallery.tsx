"use client";

import "@/app/service-video-gallery.css";
import { GalleryGoldLine, GalleryReveal } from "@/components/animations/GalleryMotion";
import { ServiceVideoCard } from "@/components/ServiceVideoCard";
import type { ServiceGalleryCopy, ServiceGalleryVideo } from "@/lib/content/service-gallery";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ServiceVideoGallery({
  copy,
  videos,
}: {
  copy: ServiceGalleryCopy;
  videos: ServiceGalleryVideo[];
}) {
  const featured = videos.find((video) => video.featured) ?? videos[0];
  const rest = featured ? videos.filter((video) => video.id !== featured.id) : [];
  const isSolo = videos.length === 1;

  return (
    <section
      className={`svc-gallery${isSolo ? " svc-gallery--solo" : ""}`}
      aria-labelledby={copy.headingId}
    >
      <GalleryReveal dramatic>
        <header className="svc-gallery__header">
          <p className="label-upper text-gold/90">{copy.eyebrow}</p>
          <h2 id={copy.headingId} className="svc-gallery__title">
            {copy.title}
            <span className="mt-1 block text-gold/90">{copy.titleAccent}</span>
          </h2>
          <p className="svc-gallery__lead">{copy.description}</p>
          <GalleryGoldLine className="mt-6 max-w-xs" />
        </header>
      </GalleryReveal>

      <div className="svc-gallery__showcase">
        {featured ? (
          <GalleryReveal delay={0.06} dramatic>
            <ServiceVideoCard video={featured} badge={copy.badge} featured />
          </GalleryReveal>
        ) : null}

        {rest.length > 0 ? (
          <div className="svc-gallery__secondary">
            {rest.map((video, index) => (
              <GalleryReveal key={video.id} delay={0.1 + index * 0.06} dramatic>
                <ServiceVideoCard video={video} badge={copy.badge} />
              </GalleryReveal>
            ))}
          </div>
        ) : null}
      </div>

      <GalleryReveal delay={0.16} className="svc-gallery__cta-wrap">
        <Link
          href={copy.ctaHref}
          className="label-upper svc-gallery__cta inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-7 py-3 text-ink-primary transition-[background-color,border-color,transform] hover:border-gold/65 hover:bg-gold/25 active:scale-[0.99]"
        >
          {copy.ctaLabel}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </GalleryReveal>
    </section>
  );
}
