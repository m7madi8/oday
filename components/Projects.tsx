"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  projectFilters,
  projects,
  serviceFilterLabel,
  type ProjectFilter,
} from "@/lib/data";
import { revealInView } from "@/lib/motion-viewport";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import aboutShowcaseImage from "@/imgs/about.jpg";
import interiorShowcaseImage from "@/imgs/interior.jpg";

const sectionShowcase = [
  {
    id: "showcase-1",
    image: interiorShowcaseImage,
    alt: "Premium interior space with sculpted ceiling design",
    label: "Interior Experience",
  },
  {
    id: "showcase-2",
    image: aboutShowcaseImage,
    alt: "Contemporary landscape and architectural outdoor setting",
    label: "Architectural Presence",
  },
  {
    id: "showcase-3",
    image: interiorShowcaseImage,
    alt: "Luxury hospitality-inspired interior composition",
    label: "Investor Appeal",
  },
] as const;

export function Projects() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<ProjectFilter>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.serviceSlug === filter);
  }, [filter]);

  const display = filtered.slice(0, 6);

  return (
    <section
      id="projects"
      className="relative bg-bg-primary py-24 md:py-32"
    >
      <RevealChildren className="mx-auto max-w-7xl px-5 md:px-10" stagger={0.07}>
        <ScrollReveal
          dramatic
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="label-upper text-gold">Case Studies</p>
            <h2 className="mt-3 font-display text-4xl italic text-ink-primary md:text-5xl">
              Projects That Perform
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-secondary md:text-base">
              A focused selection of high-impact developments crafted to lift market value, user appeal, and long-term asset performance.
            </p>
            <Link
              href="/projects"
              className="mt-6 inline-flex items-center gap-2 font-outfit text-xs font-medium uppercase tracking-[0.18em] text-gold transition-opacity hover:opacity-85"
            >
              View full gallery <span aria-hidden>→</span>
            </Link>
          </div>

          <div
            className="flex flex-wrap gap-3"
            role="tablist"
            aria-label="Filter projects by service line"
          >
            {projectFilters.map((tab) => (
              <button
                key={tab}
                type="button"
                suppressHydrationWarning
                role="tab"
                aria-selected={filter === tab}
                className={`label-upper rounded-full border px-5 py-2 transition-colors ${
                  filter === tab
                    ? "border-gold/50 bg-gold/15 text-ink-primary"
                    : "border-gold/25 text-ink-secondary hover:border-gold/50 hover:text-ink-primary"
                }`}
                onClick={() => setFilter(tab)}
              >
                {serviceFilterLabel(tab)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealInView}
          transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          {sectionShowcase.map((item) => (
            <article
              key={item.id}
              className="group relative h-44 overflow-hidden rounded-xl border border-gold/25 bg-bg-card"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1913]/72 via-[#1e1913]/22 to-transparent" />
              <p className="label-upper absolute bottom-4 left-4 text-[#f4e8d1]">
                {item.label}
              </p>
            </article>
          ))}
        </motion.div>

        <AnimatePresence initial={false}>
          <motion.div
            key={filter}
            className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-6"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            {display.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                layout={idx}
                reduceMotion={!!reduceMotion}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {display.length === 0 && (
          <p className="mt-12 text-center text-sm text-ink-secondary">
            No case studies in this category yet - switch to All for the full portfolio.
          </p>
        )}
      </RevealChildren>
    </section>
  );
}

function ProjectCard({
  project,
  layout,
  reduceMotion,
}: {
  project: (typeof projects)[number];
  layout: number;
  reduceMotion: boolean;
}) {
  const span =
    layout === 0
      ? "md:col-span-2 md:row-span-1 md:min-h-[28rem]"
      : layout === 1
        ? "md:col-span-2 md:row-span-1 md:min-h-[28rem]"
        : "md:col-span-2 md:row-span-1 md:min-h-[20rem]";

  return (
    <motion.article
      id={project.id}
      className={`group relative min-h-[280px] overflow-hidden rounded-lg border border-gold/25 bg-bg-card ${span}`}
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealInView}
      transition={{
        delay: reduceMotion ? 0 : 0.08 * layout,
        duration: reduceMotion ? 0 : 0.58,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        clipPath:
          layout % 2 === 0
            ? "polygon(0 0, 100% 0, 100% 100%, 6% 100%, 0 92%)"
            : "polygon(0 0, 94% 0, 100% 8%, 100% 100%, 0 100%)",
      }}
    >
      <Link
        href={`/projects?service=${encodeURIComponent(project.serviceSlug)}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${project.title} in gallery`}
      >
        <span className="sr-only">View {project.title} in gallery</span>
      </Link>

      <span className="pointer-events-none absolute left-6 top-6 z-[2] font-display text-lg italic text-gold">
        {project.orderLabel}
      </span>
      <span className="pointer-events-none absolute right-6 top-6 z-[2] label-upper text-[#f0e2c6]">
        Case Study
      </span>

      <motion.div
        className="absolute inset-0"
        whileHover={reduceMotion ? {} : { scale: 1.05 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/35 to-transparent" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] p-8">
        <RevealChildren stagger={0.05}>
          <p className="label-upper text-ink-secondary">{project.tag}</p>
          <h3 className="mt-3 font-display text-3xl italic text-ink-primary md:text-[2rem]">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-ink-secondary">{project.country}</p>
          <span className="mt-6 inline-flex translate-y-2 items-center gap-2 text-sm uppercase tracking-[0.22em] text-gold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View Case <span aria-hidden>→</span>
          </span>
        </RevealChildren>
      </div>
    </motion.article>
  );
}
