"use client";

import { ProjectGallery } from "@/components/ProjectGallery";
import { GalleryGoldLine, GalleryReveal } from "@/components/animations/GalleryMotion";
import { exteriorTypeLabel } from "@/lib/content/types";
import type { Project, ProjectGalleryImage } from "@/lib/data";
import { coverAsGallery, getProjectGallery } from "@/lib/project-gallery";
import {
  getProjectDetailRows,
  getProjectSummary,
  projectDetailPath,
  resolveProjectGalleryFormat,
  serviceFilterLabel,
  type ProjectSiblings,
} from "@/lib/project-view";
import { galleryTransition } from "@/lib/gallery-motion";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ProjectDetailView({
  project,
  siblings,
}: {
  project: Project;
  siblings: ProjectSiblings;
}) {
  const reduce = useReducedMotion();
  const summary = getProjectSummary(project);
  const details = getProjectDetailRows(project);
  const galleryFormat = resolveProjectGalleryFormat(project);
  const [gallery, setGallery] = useState<ProjectGalleryImage[]>(() => coverAsGallery(project));
  const titleIsCaseNumber = project.title.trim() === project.orderLabel.trim();

  useEffect(() => {
    let cancelled = false;
    setGallery(coverAsGallery(project));
    getProjectGallery(project)
      .then((frames) => {
        if (!cancelled && frames.length) setGallery(frames);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [project]);

  return (
    <main
      id="main-content"
      className="project-detail relative overflow-hidden bg-bg-primary pb-24 pt-[calc(var(--hero-nav-stack)+1.25rem)] md:pb-32 md:pt-[calc(var(--hero-nav-stack)+2rem)]"
    >
      <div
        aria-hidden
        className="project-detail__glow pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-8%,rgba(245, 197, 24,0.12),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-10">
        <GalleryReveal dramatic>
          <nav
            aria-label="Breadcrumb"
            className="project-detail__crumbs flex flex-wrap items-center gap-x-2 gap-y-1 font-outfit text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted"
          >
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/projects" className="transition-colors hover:text-gold">
              Gallery
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink-secondary">{project.title}</span>
          </nav>

          <div className="project-detail__header mt-6 border-b border-white/[0.1] pb-6 md:mt-8">
            {/* Case number leads. Where the project is titled by its number, the
                numeral is the heading itself rather than being printed twice. */}
            {titleIsCaseNumber ? (
              <h1 className="project-detail__case project-detail__case--title">{project.title}</h1>
            ) : (
              <p className="project-detail__case" aria-hidden>
                {project.orderLabel}
              </p>
            )}
            <div className="min-w-0">
              <p className="label-upper text-gold">{serviceFilterLabel(project.serviceSlug)}</p>
              {titleIsCaseNumber ? null : <h1 className="page-title mt-3">{project.title}</h1>}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="text-sm text-ink-secondary md:text-base">{project.country}</p>
                <span aria-hidden className="h-3 w-px bg-white/20" />
                <span className="label-upper text-gold/90">{project.tag}</span>
                {siblings ? (
                  <>
                    <span aria-hidden className="h-3 w-px bg-white/20" />
                    <span className="caption-meta text-[11px] uppercase text-ink-muted">
                      {String(siblings.position).padStart(2, "0")} / {String(siblings.total).padStart(2, "0")}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <GalleryGoldLine className="mt-6 max-w-md" />
        </GalleryReveal>

        <GalleryReveal delay={0.08} dramatic className="mt-8 md:mt-10">
          <ProjectGallery images={gallery} title={project.title} format={galleryFormat} />
        </GalleryReveal>

        <div className="mt-10 grid gap-8 md:mt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <GalleryReveal delay={0.12}>
            <p className="label-upper text-ink-muted">Overview</p>
            <p className="mt-4 text-sm leading-[1.72] text-ink-secondary md:text-[0.9375rem]">{summary}</p>
            <p className="mt-6 text-sm leading-[1.65] text-ink-muted">
              Swipe horizontally to browse frames, tap any image to open it fullscreen, or use arrow keys in the
              viewer.
            </p>
          </GalleryReveal>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={galleryTransition(!!reduce, 0.55, 0.16)}
          >
            <p className="label-upper text-ink-muted">Project details</p>
            <dl className="mt-4 divide-y divide-white/[0.08] rounded-xl border border-white/[0.1] bg-bg-card/60">
              {details.map(({ label, value, wide }, i) => (
                <motion.div
                  key={label}
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={galleryTransition(!!reduce, 0.4, 0.2 + i * 0.05)}
                  className={
                    wide
                      ? "px-4 py-3.5 sm:px-5"
                      : "flex items-baseline justify-between gap-4 px-4 py-3.5 sm:px-5"
                  }
                >
                  <dt className="shrink-0 font-outfit text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                    {label}
                  </dt>
                  <dd
                    className={
                      wide
                        ? "mt-2 text-sm leading-[1.7] text-ink-secondary"
                        : "text-right text-sm font-medium text-ink-primary"
                    }
                  >
                    {value}
                  </dd>
                </motion.div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={
                  project.serviceSlug === "exterior" && project.exteriorType
                    ? `/projects?service=exterior&type=${encodeURIComponent(project.exteriorType)}`
                    : `/projects?service=${encodeURIComponent(project.serviceSlug)}`
                }
                className="btn btn--primary"
              >
                More{" "}
                {project.serviceSlug === "exterior" && project.exteriorType
                  ? exteriorTypeLabel(project.exteriorType)
                  : serviceFilterLabel(project.serviceSlug)}
              </Link>
              <Link
                href="/#contact"
                className="btn btn--ghost"
              >
                Request brief
              </Link>
            </div>
          </motion.div>
        </div>

        {siblings ? (
          <GalleryReveal delay={0.18} className="mt-12 md:mt-14">
            <nav className="project-detail__pager" aria-label="Project navigation">
              <Link href={projectDetailPath(siblings.previous)} className="project-detail__pager-link">
                <span className="project-detail__pager-dir">
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                  Previous
                </span>
                <span className="project-detail__pager-title">{siblings.previous.title}</span>
                <span className="project-detail__pager-meta">{siblings.previous.country}</span>
              </Link>
              <Link
                href={projectDetailPath(siblings.next)}
                className="project-detail__pager-link project-detail__pager-link--next"
              >
                <span className="project-detail__pager-dir">
                  Next
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="project-detail__pager-title">{siblings.next.title}</span>
                <span className="project-detail__pager-meta">{siblings.next.country}</span>
              </Link>
            </nav>
          </GalleryReveal>
        ) : null}

        <GalleryReveal delay={0.2} className="mt-10 md:mt-12">
          <Link
            href={
              project.serviceSlug === "exterior" && project.exteriorType
                ? `/projects?service=exterior&type=${encodeURIComponent(project.exteriorType)}`
                : `/projects?service=${encodeURIComponent(project.serviceSlug)}`
            }
            data-no-glow
            className="project-detail__back btn-plain"
          >
            <ArrowLeft className="project-detail__back-icon" strokeWidth={1.5} aria-hidden />
            <span>Back to gallery</span>
          </Link>
        </GalleryReveal>
      </div>
    </main>
  );
}
