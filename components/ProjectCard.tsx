"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { animationEasing } from "@/lib/animations";
import { cardInViewHidden, cardInViewVisible, revealInView } from "@/lib/motion-viewport";
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
import { captureGalleryNavigation } from "@/lib/gallery-return";
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
  /** Masonry / featured: stagger delay within a visible band or grid. */
  revealIndex?: number;
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
  tone,
  span,
  revealIndex,
  batchAnimate = false,
}: ProjectCardProps) {
  if (variant === "masonry") {
    return (
      <MasonryCard
        project={project}
        section={section}
        tone={tone}
        span={span}
        revealIndex={revealIndex ?? 0}
      />
    );
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

/** When title duplicates the case index, surface real metadata instead. */
function cardHeadline(project: Project): string {
  const title = project.title.trim();
  const order = project.orderLabel.trim();
  if (title && title !== order) {
    return project.title;
  }
  return project.country || project.tag;
}

function MasonryCard({
  project,
  section,
  tone = "frame",
  span = 4,
  revealIndex = 0,
}: {
  project: Project;
  section: PortfolioSectionId;
  tone?: GalleryCardTone;
  span?: 4 | 6 | 8 | 12;
  revealIndex?: number;
}) {
  const reduceMotion = useReducedMotion();
  const format = resolveProjectGalleryFormat(project);
  const intrinsic = resolveImageIntrinsic(project.image, format);
  const ratio = resolveProjectCardRatio(project.image, format);
  const pill = getProjectCardPill(project, section);
  const href = projectDetailPath(project);
  const headline = cardHeadline(project);

  return (
    <motion.article
      className={`project-card project-card--${tone} scroll-mt-[calc(var(--hero-nav-stack)+1.25rem)]`}
      data-ratio={ratio}
      data-tone={tone}
      data-span={span}
      data-section={section}
      id={project.id}
      style={{
        ["--cover-aspect" as string]: intrinsic.aspectRatio,
        ["--cover-ratio" as string]: String(intrinsic.width / Math.max(intrinsic.height, 1)),
      }}
      initial={reduceMotion ? false : cardInViewHidden}
      whileInView={reduceMotion ? undefined : cardInViewVisible}
      viewport={revealInView}
      transition={{
        duration: reduceMotion ? 0 : 0.62,
        delay: reduceMotion ? 0 : revealIndex * 0.07,
        ease: animationEasing.cinematic,
      }}
    >
      <Link
        href={href}
        className="project-card__link"
        aria-label={`View project ${project.orderLabel} ${headline}`}
        onClick={() => captureGalleryNavigation(project.id)}
      >
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
              <span className="project-card__name">{headline}</span>
            </h3>
          </div>
        </div>
      </Link>
    </motion.article>
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
      className="group relative min-w-0 scroll-mt-[calc(var(--hero-nav-stack)+1.25rem)] overflow-hidden bg-bg-card"
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
        onClick={() => captureGalleryNavigation(project.id)}
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
            <p className="truncate font-mono text-xs uppercase tracking-[0.1em] text-gold">
              {project.tag}
            </p>
            <h2 className="mt-1.5 flex items-baseline gap-2 font-display text-[1.125rem] font-normal leading-snug text-[#f5f0e8] opacity-80 transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:opacity-100 md:text-[1.375rem]">
              <span className="shrink-0 font-mono text-xs tracking-[0.08em] text-gold/65" aria-hidden>
                {caseNumber(project, index)}
              </span>
              <span className="line-clamp-2">{cardHeadline(project)}</span>
            </h2>
            <span
              aria-hidden
              className="project-card-gold-line mt-2 block h-px w-10 origin-left scale-x-0 bg-gold opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-hover:opacity-100"
            />
            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 sm:gap-x-3">
              <p className="shrink-0 font-ui text-xs uppercase tracking-[0.12em] text-ink-secondary/80">
                {serviceLabel}
              </p>
              {project.country && (
                <p className="min-w-0 truncate font-mono text-xs tracking-[0.04em] text-ink-muted">
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
  const reduceMotion = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const lightMotion = reduceMotion || mobilePerf;
  const headline = cardHeadline(project);

  return (
    <motion.article
      className="feat-card"
      data-section={project.serviceSlug}
      id={project.id}
      initial={lightMotion ? false : cardInViewHidden}
      animate={lightMotion ? cardInViewVisible : undefined}
      whileInView={lightMotion ? undefined : cardInViewVisible}
      viewport={revealInView}
      transition={{
        duration: lightMotion ? 0 : 0.52,
        delay: lightMotion ? 0 : 0.08 + index * 0.05,
        ease: animationEasing.smoothOut,
      }}
    >
      <Link
        href={projectDetailPath(project)}
        className="feat-card__link group/feat"
        aria-label={`View project ${headline}`}
        onClick={() => captureGalleryNavigation(project.id)}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          quality={mobilePerf ? 76 : 90}
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
    </motion.article>
  );
}
