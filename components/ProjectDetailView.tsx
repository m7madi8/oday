"use client";

import { ProjectCarousel } from "@/components/ProjectCarousel";
import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  getProjectDetailRows,
  getProjectSummary,
  serviceFilterLabel,
  type Project,
  type ProjectGalleryImage,
} from "@/lib/data";
import Link from "next/link";

export function ProjectDetailView({
  project,
  gallery,
}: {
  project: Project;
  gallery: ProjectGalleryImage[];
}) {
  const summary = getProjectSummary(project);
  const details = getProjectDetailRows(project);

  return (
    <main
      id="main-content"
      className="relative bg-bg-primary pb-24 pt-[calc(var(--hero-nav-stack)+1.25rem)] md:pb-32 md:pt-[calc(var(--hero-nav-stack)+2rem)]"
    >
      <RevealChildren className="mx-auto max-w-6xl px-5 md:px-10" stagger={0.07}>
        <ScrollReveal dramatic>
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 font-outfit text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
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

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.1] pb-6 md:mt-8">
            <div className="min-w-0 max-w-3xl">
              <p className="label-upper text-gold">{serviceFilterLabel(project.serviceSlug)}</p>
              <h1 className="mt-3 font-display text-[clamp(1.85rem,4.5vw,3.25rem)] font-normal italic leading-[1.06] text-ink-primary">
                {project.title}
              </h1>
              <p className="mt-3 text-sm text-ink-secondary md:text-base">{project.country}</p>
            </div>
            <span className="label-upper shrink-0 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-gold/90">
              {project.tag}
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal dramatic delay={0.05} className="mt-8 md:mt-10">
          <ProjectCarousel images={gallery} title={project.title} />
        </ScrollReveal>

        <div className="mt-10 grid gap-8 md:mt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <ScrollReveal dramatic delay={0.08}>
            <p className="label-upper text-ink-muted">Overview</p>
            <p className="mt-4 text-sm leading-[1.72] text-ink-secondary md:text-[0.9375rem]">{summary}</p>
            <p className="mt-6 text-sm leading-[1.65] text-ink-muted">
              Swipe the carousel or use arrow keys to browse all {gallery.length} project frames.
            </p>
          </ScrollReveal>

          <ScrollReveal dramatic delay={0.1}>
            <p className="label-upper text-ink-muted">Project details</p>
            <dl className="mt-4 divide-y divide-white/[0.08] rounded-xl border border-white/[0.1] bg-bg-card/60">
              {details.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3.5 sm:px-5">
                  <dt className="font-outfit text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                    {label}
                  </dt>
                  <dd className="text-right text-sm font-medium text-ink-primary">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/projects?service=${encodeURIComponent(project.serviceSlug)}`}
                className="label-upper inline-flex rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-ink-primary transition-colors hover:bg-gold/18"
              >
                More {serviceFilterLabel(project.serviceSlug)}
              </Link>
              <Link
                href="/#contact"
                className="label-upper inline-flex rounded-full border border-white/[0.12] px-6 py-3 text-ink-secondary transition-colors hover:border-gold/35 hover:text-ink-primary"
              >
                Request brief
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-12 md:mt-14">
          <Link
            href="/projects"
            className="label-upper inline-flex items-center gap-2 text-ink-secondary transition-colors hover:text-gold"
          >
            <span aria-hidden>←</span> Back to gallery
          </Link>
        </ScrollReveal>
      </RevealChildren>
    </main>
  );
}
