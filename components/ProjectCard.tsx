"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";
import {
  getProjectCardPill,
  resolveImageIntrinsic,
  resolveProjectCardRatio,
  type GalleryCardTone,
  type PortfolioSectionId,
  type ProjectCardRatio,
} from "@/lib/project-card-ratio";
import {
  projectDetailPath,
  resolveProjectGalleryFormat,
  serviceFilterLabel,
  type Project,
} from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const cardEase = [0.16, 1, 0.3, 1] as const;

export type ProjectCardVariant = "masonry" | "grid" | "featured";

/** Homepage featured spread — single grid cell composition. */
export type FeaturedCardTier = "cell";

type ProjectCardProps = {
  project: Project;
  variant: ProjectCardVariant;
  /** Position in its list — drives stagger and eager loading of the first frames. */
  index?: number;
  /** @deprecated Featured grid uses uniform cells — tier is ignored. */
  featuredTier?: FeaturedCardTier;
  /** Masonry only: which archive band the card sits in. */
  section?: PortfolioSectionId;
  /** Masonry only: when supplied by the row layout, avoids reflow after image load. */
  ratio?: ProjectCardRatio;
  /** Masonry only: calculated composition tone. */
  tone?: GalleryCardTone;
  /** Masonry only: 12-column span. */
  span?: 4 | 6 | 8 | 12;
  /** Grid only: animate this batch in on mount. */
  batchAnimate?: boolean;
};

/**
 * Single archive card. One href, one metadata contract, three compositions:
 * masonry (editorial rows), grid (uniform listing), featured (homepage strip).
 */
export function ProjectCard({
  project,
  variant,
  index = 0,
  section = "exterior",
  ratio,
  tone,
  span,
  batchAnimate = false,
}: ProjectCardProps) {
  if (variant === "masonry") {
    return <MasonryCard project={project} section={section} tone={tone} span={span} />;
  }
  if (variant === "featured") {
    return <FeaturedCard project={project} index={index} />;
  }
  return <GridCard project={project} index={index} batchAnimate={batchAnimate} />;
}

/** Editorial case number — the primary identifier for projects titled only by number. */
function caseNumber(project: Project, index: number): string {
  return project.orderLabel ?? String(index + 1).padStart(2, "0");
}

/** When title duplicates the case index (interior editorial IDs), surface real metadata instead. */
function featuredHeadline(project: Project): string {
  if (project.title && project.title !== project.orderLabel) {
    return project.title;
  }
  return project.country || project.tag;
}

function MasonryCard({
  project,
  section,
  tone = "frame",
  span = 4,
}: {
  project: Project;
  section: PortfolioSectionId;
  tone?: GalleryCardTone;
  span?: 4 | 6 | 8 | 12;
}) {
  const format = resolveProjectGalleryFormat(project);
  const intrinsic = resolveImageIntrinsic(project.image, format);
  const ratio = resolveProjectCardRatio(project.image, format);
  const pill = getProjectCardPill(project, section);
  const href = projectDetailPath(project);

  return (
    <article
      className={`project-card project-card--${tone}`}
      data-ratio={ratio}
      data-tone={tone}
      data-span={span}
      data-section={section}
      id={project.id}
      style={{ ["--cover-aspect" as string]: intrinsic.aspectRatio }}
    >
      <Link href={href} className="project-card__link" aria-label={`View project ${project.title}`}>
        <div className="project-card__media">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="project-card__img"
            sizes={
              span >= 8
                ? "(max-width: 639px) 92vw, (max-width: 1099px) 92vw, 66vw"
                : "(max-width: 639px) 92vw, (max-width: 1099px) 50vw, 34vw"
            }
          />
          {tone === "index" ? (
            <span className="project-card__display-num" aria-hidden>
              {project.orderLabel}
            </span>
          ) : null}
          <div className="project-card__hover-panel" aria-hidden>
            <span className="project-card__hover-cta">
              View project
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <div className="project-card__info project-card__info--overlay">
            <span className="project-card__pill">{pill}</span>
            <h3 className="project-card__title">
              <span className="project-card__num" aria-hidden>
                {project.orderLabel}
              </span>
              {project.title}
            </h3>
          </div>
        </div>
      </Link>
    </article>
  );
}

function GridCard({
  project,
  index,
  batchAnimate,
}: {
  project: Project;
  index: number;
  batchAnimate: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = batchAnimate && !reduceMotion;
  const serviceLabel = serviceFilterLabel(project.serviceSlug);

  return (
    <motion.article
      id={project.id}
      className="group relative min-w-0 overflow-hidden bg-bg-card"
      initial={shouldAnimate ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reduceMotion
          ? undefined
          : { opacity: 0, scale: 0.97, transition: { duration: 0.3, ease: cardEase } }
      }
      transition={{
        duration: 0.5,
        ease: cardEase,
        delay: shouldAnimate ? index * 0.04 : 0,
      }}
    >
      <Link
        href={projectDetailPath(project)}
        className="block active:scale-[0.98] motion-reduce:active:scale-100"
        aria-label={`View ${project.title} project`}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[4/3] xl:aspect-[3/2]">
          <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
            />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-[400ms] group-hover:bg-black/[0.28]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 z-[1] p-3.5 sm:p-4 md:p-5">
            <p className="truncate font-ui text-[8px] uppercase tracking-[0.2em] text-gold sm:tracking-[0.24em]">
              {project.tag}
            </p>
            <h2 className="mt-1.5 flex items-baseline gap-2 font-display text-[18px] font-light leading-snug text-[#f5f0e8] opacity-80 transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:opacity-100 md:text-[20px]">
              <span className="shrink-0 font-ui text-[10px] tracking-[0.2em] text-gold/70" aria-hidden>
                {caseNumber(project, index)}
              </span>
              <span className="line-clamp-2">{project.title}</span>
            </h2>
            <span
              aria-hidden
              className="project-card-gold-line mt-2 block h-px w-10 origin-left scale-x-0 bg-gold opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-hover:opacity-100"
            />
            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 sm:gap-x-3">
              <p className="shrink-0 font-ui text-[9px] uppercase tracking-[0.14em] text-ink-secondary/80 sm:tracking-[0.18em]">
                {serviceLabel}
              </p>
              {project.country && (
                <p className="min-w-0 truncate font-ui text-[9px] tracking-wide text-ink-muted">
                  {project.country}
                  {project.year ? ` · ${project.year}` : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const headline = featuredHeadline(project);

  return (
    <article className="feat-card" data-section={project.serviceSlug} id={project.id}>
      <Link
        href={projectDetailPath(project)}
        className="feat-card__link group/feat"
        aria-label={`View project ${headline}`}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          quality={90}
          className="feat-card__img object-cover"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 34vw"
          style={{ objectPosition: "50% 42%" }}
          loading={index < 3 ? "eager" : "lazy"}
        />
        <div className="feat-card__shade" aria-hidden />
        <div className="feat-card__overlay">
          <h3 className="feat-card__title">{headline}</h3>
        </div>
      </Link>
    </article>
  );
}
