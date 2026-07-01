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
  const layout = videos.length === 1 ? "solo" : "duo";

  return (
    <section
      className={`svc-gallery svc-gallery--${layout}`}
      aria-labelledby={copy.headingId}
    >
      <div className="svc-gallery__layout">
        <GalleryReveal dramatic>
          <aside className="svc-gallery__aside">
            {copy.orderLabel ? (
              <span className="svc-gallery__order" aria-hidden>
                {copy.orderLabel}
              </span>
            ) : null}

            <header className="svc-gallery__header">
              <p className="label-upper text-gold/90">{copy.eyebrow}</p>
              <h2 id={copy.headingId} className="svc-gallery__title">
                {copy.title}
                <span className="svc-gallery__title-accent">{copy.titleAccent}</span>
              </h2>
              <p className="svc-gallery__lead">{copy.description}</p>

              {copy.highlights && copy.highlights.length > 0 ? (
                <ul className="svc-gallery__highlights">
                  {copy.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              <GalleryGoldLine className="svc-gallery__line" />
            </header>

            {videos.length > 0 ? (
              <p className="svc-gallery__count label-upper" aria-hidden>
                {String(videos.length).padStart(2, "0")} {videos.length === 1 ? "Film" : "Films"}
              </p>
            ) : null}

            <Link
              href={copy.ctaHref}
              className="label-upper svc-gallery__cta inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-7 py-3 text-ink-primary transition-[background-color,border-color,transform] hover:border-gold/65 hover:bg-gold/25 active:scale-[0.99]"
            >
              {copy.ctaLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </aside>
        </GalleryReveal>

        <div className="svc-gallery__main">
          <div className="svc-gallery__showcase">
            {featured ? (
              <GalleryReveal delay={0.06} dramatic className="svc-gallery__slot svc-gallery__slot--featured">
                <ServiceVideoCard video={featured} badge={copy.badge} featured />
              </GalleryReveal>
            ) : null}

            {rest.length > 0 ? (
              <div className="svc-gallery__secondary">
                {rest.map((video, index) => (
                  <GalleryReveal
                    key={video.id}
                    delay={0.1 + index * 0.06}
                    dramatic
                    className="svc-gallery__slot"
                  >
                    <ServiceVideoCard video={video} badge={copy.badge} />
                  </GalleryReveal>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
