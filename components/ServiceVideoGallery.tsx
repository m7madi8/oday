"use client";

import "@/app/service-video-gallery.css";
import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { RevealFade } from "@/components/animations/RevealFade";
import { GalleryGoldLine, GalleryReveal } from "@/components/animations/GalleryMotion";
import { MagneticButton } from "@/components/animations/MagneticButton";
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
              <RevealFade as="p" className="label-upper text-gold/90" timing="enter">
                {copy.eyebrow}
              </RevealFade>
              <AnimatedHeading
                as="h2"
                id={copy.headingId}
                className="svc-gallery__title"
                timing="enter"
                delay={0.08}
              >
                <>
                  {copy.title}
                  <span className="svc-gallery__title-accent">{copy.titleAccent}</span>
                </>
              </AnimatedHeading>
              <RevealFade as="p" className="svc-gallery__lead" delay={0.3} timing="enter">
                {copy.description}
              </RevealFade>

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

            <MagneticButton className="inline-flex self-start">
              <Link
                href={copy.ctaHref}
                className="btn btn--primary svc-gallery__cta"
              >
                {copy.ctaLabel}
                <ArrowUpRight className="btn__icon btn__icon--nudge" aria-hidden />
              </Link>
            </MagneticButton>
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
