"use client";

import { useReducedMotion } from "@/components/ClientMotion";
import {
  projectDetailPath,
  resolveProjectGalleryFormat,
  type Project,
  type ProjectGalleryImage,
} from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const CROSSFADE_MS = 6000;

type FeaturedHeroProjectProps = {
  project: Project;
};

export function FeaturedHeroProject({ project }: FeaturedHeroProjectProps) {
  const reduceMotion = useReducedMotion();
  const [frames, setFrames] = useState<ProjectGalleryImage[]>([
    { src: project.image, alt: project.imageAlt, format: resolveProjectGalleryFormat(project) },
  ]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    import("@/lib/project-gallery")
      .then(({ getProjectGallery }) => getProjectGallery(project))
      .then((gallery) => {
        if (cancelled || gallery.length === 0) return;
        setFrames(gallery.slice(0, 5));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [project]);

  useEffect(() => {
    if (reduceMotion || frames.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % frames.length);
    }, CROSSFADE_MS);
    return () => window.clearInterval(timer);
  }, [frames.length, reduceMotion]);

  const href = projectDetailPath(project);

  return (
    <article className="feat-hero" id={project.id} data-section={project.serviceSlug}>
      <Link href={href} className="feat-hero__link" aria-label={`View project ${project.title}`}>
        <div className="feat-hero__media">
          {frames.map((frame, index) => (
            <Image
              key={`${project.id}-${index}`}
              src={frame.src}
              alt={frame.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`feat-hero__img object-cover transition-opacity duration-[1400ms] ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="feat-hero__shade" aria-hidden />

          <div className="feat-hero__top">
            <span className="feat-hero__badge">Featured</span>
            <span className="feat-hero__index">{project.orderLabel}</span>
          </div>

          <div className="feat-hero__bottom">
            <p className="feat-hero__tag">{project.tag}</p>
            <h3 className="feat-hero__title">{project.title}</h3>
            <p className="feat-hero__meta">
              {[project.country, project.year, project.area].filter(Boolean).join(" · ")}
            </p>
            <span className="feat-hero__cta">
              View case study
              <ArrowUpRight className="feat-hero__cta-icon" strokeWidth={1.5} aria-hidden />
            </span>
          </div>

          {frames.length > 1 ? (
            <div className="feat-hero__dots" aria-hidden>
              {frames.map((_, index) => (
                <span
                  key={index}
                  className={`feat-hero__dot ${index === active ? "feat-hero__dot--on" : ""}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
