"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";
import {
  getProjectCardDescription,
  getProjectCardPill,
  resolveProjectCardRatio,
  type PortfolioSectionId,
  type ProjectCardRatio,
} from "@/lib/project-card-ratio";
import {
  exteriorTypeLabel,
  projectDetailPath,
  resolveProjectGalleryFormat,
  serviceFilterLabel,
  type Project,
} from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, type SyntheticEvent } from "react";

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
  batchAnimate = false,
}: ProjectCardProps) {
  if (variant === "masonry") {
    return <MasonryCard project={project} section={section} ratio={ratio} />;
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
  ratio: ratioProp,
}: {
  project: Project;
  section: PortfolioSectionId;
  ratio?: ProjectCardRatio;
}) {
  const format = resolveProjectGalleryFormat(project);
  const [ratio, setRatio] = useState<ProjectCardRatio>(
    ratioProp ?? resolveProjectCardRatio(project.image, format),
  );
  const displayRatio = ratioProp ?? ratio;

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      if (ratioProp) return;
      const img = e.currentTarget;
      if (!img.naturalWidth || !img.naturalHeight) return;
      setRatio(img.naturalWidth / img.naturalHeight <= 0.92 ? "portrait" : "landscape");
    },
    [ratioProp],
  );

  const pill = getProjectCardPill(project, section);
  const description = getProjectCardDescription(project);
  const href = projectDetailPath(project);
  const isPortrait = displayRatio === "portrait";

  const info = (
    <div
      className={`project-card__info ${
        isPortrait ? "project-card__info--overlay" : "project-card__info--below"
      }`}
    >
      <span className="project-card__pill">{pill}</span>
      <h3 className="project-card__title">
        <span className="project-card__num" aria-hidden>
          {project.orderLabel}
        </span>
        {project.title}
      </h3>
      <p className="project-card__desc">{description}</p>
    </div>
  );

  if (isPortrait) {
    return (
      <article className="project-card" data-ratio="portrait" data-section={section} id={project.id}>
        <Link href={href} className="project-card__link project-card__link--portrait">
          <div className="project-card__media project-card__media--portrait">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              className="project-card__img"
              sizes="(max-width: 640px) 85vw, 280px"
              onLoad={onImageLoad}
            />
            <div className="project-card__shade" aria-hidden />
            <div className="project-card__hover-veil" aria-hidden />
            <span className="project-card__hover-cta">
              View project
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            {info}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className="project-card"
      data-ratio="landscape"
      data-ratio-locked={ratioProp ? "true" : undefined}
      data-section={section}
      id={project.id}
    >
      <Link href={href} className="project-card__link project-card__link--landscape">
        <div className="project-card__media project-card__media--landscape">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="project-card__img project-card__img--zoom"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            onLoad={onImageLoad}
          />
          <div className="project-card__hover-panel" aria-hidden>
            <span className="project-card__hover-cta project-card__hover-cta--landscape">
              View project
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
        {info}
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
  const categoryLabel =
    project.serviceSlug === "exterior" && project.exteriorType
      ? exteriorTypeLabel(project.exteriorType)
      : project.tag;
  const headline = featuredHeadline(project);
  const metaParts = [project.country, project.year].filter(Boolean);

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
          className="feat-card__img object-cover transition-transform duration-700 ease-out group-hover/feat:scale-[1.04]"
          sizes="(max-width: 1024px) 50vw, 25vw"
          loading={index < 4 ? "eager" : "lazy"}
        />
        <div className="feat-card__shade" aria-hidden />
        <div className="feat-card__overlay">
          <span className="feat-card__num">{caseNumber(project, index)}</span>
          <div className="feat-card__copy">
            <p className="feat-card__tag">{categoryLabel}</p>
            <h3 className="feat-card__title">{headline}</h3>
            {metaParts.length > 0 ? (
              <p className="feat-card__meta">{metaParts.join(" · ")}</p>
            ) : null}
          </div>
          <span className="feat-card__arrow" aria-hidden>
            <ArrowUpRight strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </article>
  );
}
