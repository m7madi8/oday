"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  isValidServiceSlug,
  projectServiceFilters,
  projects,
  serviceFilterLabel,
  type ProjectServiceFilter,
} from "@/lib/data";
import { revealInView } from "@/lib/motion-viewport";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export function ProjectsGallery({ initialFilter }: { initialFilter: ProjectServiceFilter }) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<ProjectServiceFilter>(initialFilter);

  useEffect(() => {
    const raw = searchParams.get("service");
    if (!raw) {
      setFilter("All");
      return;
    }
    if (isValidServiceSlug(raw)) {
      setFilter(raw);
    } else {
      setFilter("All");
      router.replace("/projects", { scroll: false });
    }
  }, [searchParams, router]);

  const setFilterAndUrl = useCallback(
    (next: ProjectServiceFilter) => {
      setFilter(next);
      if (next === "All") {
        router.replace("/projects", { scroll: false });
      } else {
        router.replace(`/projects?service=${encodeURIComponent(next)}`, { scroll: false });
      }
    },
    [router],
  );

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.serviceSlug === filter);
  }, [filter]);

  return (
    <main id="main-content" className="relative bg-bg-primary pb-24 pt-[calc(var(--hero-nav-stack)+1.5rem)] md:pb-32 md:pt-[calc(var(--hero-nav-stack)+2rem)]">
      <RevealChildren className="mx-auto max-w-7xl px-5 md:px-10" stagger={0.06}>
        <ScrollReveal
          dramatic
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="label-upper text-gold">Case Studies</p>
            <h1 className="mt-3 font-display text-4xl italic text-ink-primary md:text-5xl">
              Project Gallery
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-secondary md:text-base">
              Filter by service line to explore representative work across interior, landscape,
              exterior, drone intelligence, and AI-assisted workflows.
            </p>
          </div>

          <div
            className="flex max-w-full flex-wrap gap-2 md:justify-end"
            role="tablist"
            aria-label="Filter projects by service"
          >
            {projectServiceFilters.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={filter === tab}
                className={`label-upper rounded-full border px-4 py-2 text-[0.65rem] transition-colors sm:px-5 sm:text-[0.6875rem] ${
                  filter === tab
                    ? "border-gold/50 bg-gold/15 text-ink-primary"
                    : "border-gold/25 text-ink-secondary hover:border-gold/50 hover:text-ink-primary"
                }`}
                onClick={() => setFilterAndUrl(tab)}
              >
                {serviceFilterLabel(tab)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={filter}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {filtered.map((project, idx) => (
              <GalleryCard key={project.id} project={project} index={idx} reduceMotion={!!reduceMotion} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-ink-secondary">No projects match this filter.</p>
        )}

        <motion.div
          className="mt-14 flex flex-wrap justify-center gap-4"
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={revealInView}
        >
          <Link
            href="/#contact"
            className="label-upper inline-flex rounded-full border border-gold/45 bg-gold/10 px-6 py-2.5 text-ink-primary transition-colors hover:bg-gold/20"
          >
            Request a project brief
          </Link>
          <Link
            href="/#services"
            className="label-upper inline-flex rounded-full border border-gold/25 px-6 py-2.5 text-ink-secondary transition-colors hover:border-gold/45 hover:text-ink-primary"
          >
            Back to services
          </Link>
        </motion.div>
      </RevealChildren>
    </main>
  );
}

function GalleryCard({
  project,
  index,
  reduceMotion,
}: {
  project: (typeof projects)[number];
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      id={project.id}
      className="group relative min-h-[280px] overflow-hidden rounded-xl border border-gold/25 bg-bg-card"
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealInView}
      transition={{
        delay: reduceMotion ? 0 : 0.04 * (index % 6),
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href="/#contact"
        className="absolute inset-0 z-10"
        aria-label={`Inquire about ${project.title}`}
      >
        <span className="sr-only">Inquire about {project.title}</span>
      </Link>

      <span className="pointer-events-none absolute left-4 top-4 z-[2] font-display text-sm italic text-gold md:text-base">
        {project.orderLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-[2] max-w-[10rem] truncate text-right font-outfit text-[10px] font-medium uppercase tracking-[0.14em] text-[#f0e2c6]/90">
        {project.tag}
      </span>

      <motion.div
        className="absolute inset-0"
        whileHover={reduceMotion ? {} : { scale: 1.04 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] p-6 md:p-7">
        <h2 className="font-display text-2xl italic leading-tight text-ink-primary md:text-[1.65rem]">
          {project.title}
        </h2>
        <p className="mt-2 text-sm text-ink-secondary">{project.country}</p>
        <span className="mt-4 inline-flex translate-y-1 items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Inquire <span aria-hidden>→</span>
        </span>
      </div>
    </motion.article>
  );
}
