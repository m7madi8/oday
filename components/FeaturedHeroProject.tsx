"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";
import {
  projectDetailPath,
  resolveProjectGalleryFormat,
  type Project,
  type ProjectGalleryImage,
} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const CROSSFADE_S = 1.65;
const SLIDE_INTERVAL_MS = 4200;

type FeaturedHeroProjectProps = {
  project: Project;
};

export function FeaturedHeroProject({ project }: FeaturedHeroProjectProps) {
  const reduceMotion = useReducedMotion();
  const [frames, setFrames] = useState<ProjectGalleryImage[]>([
    { src: project.image, alt: project.imageAlt, format: resolveProjectGalleryFormat(project) },
  ]);
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    import("@/lib/project-gallery")
      .then(({ getProjectGallery }) => getProjectGallery(project))
      .then((gallery) => {
        if (cancelled || gallery.length === 0) return;
        setFrames(gallery.slice(0, 6));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [project]);

  useEffect(() => {
    if (reduceMotion || frames.length < 2) return;
    const id = window.setTimeout(() => {
      setActive((prev) => (prev + 1) % frames.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [active, frames.length, reduceMotion]);

  const href = projectDetailPath(project);
  const meta = [project.country, project.year, project.area].filter(Boolean).join(" · ");
  const canSlideshow = frames.length > 1 && !reduceMotion;

  return (
    <article className="feat-hero" id={project.id} data-section={project.serviceSlug}>
      <Link href={href} className="feat-hero__link" aria-label={`View project ${project.title}`}>
        <div className="feat-hero__media">
          {frames.map((frame, index) => {
            const isActive = index === active;
            return (
              <motion.div
                key={`${project.id}-${index}`}
                className="feat-hero__slide"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { opacity: { duration: CROSSFADE_S, ease: [0.22, 1, 0.36, 1] } }
                }
                style={{ zIndex: isActive ? 2 : 1 }}
                aria-hidden={!isActive}
              >
                <motion.div
                  className="feat-hero__ken"
                  initial={false}
                  animate={{ scale: canSlideshow && isActive ? 1.07 : 1 }}
                  transition={{
                    duration: canSlideshow && isActive ? SLIDE_INTERVAL_MS / 1000 : 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Image
                    src={frame.src}
                    alt=""
                    fill
                    priority={index === 0}
                    quality={92}
                    sizes="(max-width: 1023px) 100vw, 96vw"
                    className="feat-hero__img object-cover"
                    style={{ objectPosition: "52% 36%" }}
                  />
                </motion.div>
              </motion.div>
            );
          })}

          <div className="feat-hero__shade" aria-hidden />

          {canSlideshow ? (
            <div className="feat-hero__ticks" aria-hidden>
              {frames.map((_, index) => {
                const isActive = index === active;
                return (
                  <span
                    key={`${project.id}-tick-${index}`}
                    className={`feat-hero__tick ${isActive ? "is-active" : ""}`}
                  >
                    {isActive ? (
                      <motion.span
                        key={progressKey}
                        className="feat-hero__tick-fill"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: SLIDE_INTERVAL_MS / 1000, ease: "linear" }}
                      />
                    ) : null}
                  </span>
                );
              })}
            </div>
          ) : null}

          <div className="feat-hero__copy">
            <p className="feat-hero__badge">Featured</p>
            <h3 className="feat-hero__title">{project.title}</h3>
            {meta ? <p className="feat-hero__meta">{meta}</p> : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
