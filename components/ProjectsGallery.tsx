"use client";

import { ExteriorGallery } from "@/components/ExteriorGallery";
import { GalleryHashSync } from "@/components/GalleryHashSync";
import { ProjectsGallerySearchSync } from "@/components/ProjectsGallerySearchSync";
import {
  GalleryFilterPill,
  GalleryGoldLine,
  GalleryReveal,
  GallerySectionTransition,
  GalleryStagger,
} from "@/components/animations/GalleryMotion";
import {
  galleryCardItem,
  gallerySpring,
  galleryTransition,
} from "@/lib/gallery-motion";
import {
  projectDetailPath,
  projectServiceFilters,
  projects,
  serviceFilterLabel,
  type ExteriorProjectType,
  type ExteriorProjectTypeFilter,
  type ProjectServiceFilter,
} from "@/lib/data";
import { GALLERY_CATEGORY_ANCHORS } from "@/lib/gallery-anchors";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

function projectsGalleryPath(
  basePath: "/projects" | "/gallery",
  service: ProjectServiceFilter,
  exteriorType: ExteriorProjectTypeFilter,
) {
  if (service === "All") return basePath;
  const params = new URLSearchParams({ service });
  if (service === "exterior" && exteriorType !== "All") {
    params.set("type", exteriorType);
  }
  return `${basePath}?${params.toString()}`;
}

export function ProjectsGallery({
  initialFilter,
  initialExteriorType = "All",
  basePath = "/projects",
}: {
  initialFilter: ProjectServiceFilter;
  initialExteriorType?: ExteriorProjectTypeFilter;
  basePath?: "/projects" | "/gallery";
}) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [filter, setFilter] = useState<ProjectServiceFilter>(initialFilter);
  const [exteriorType, setExteriorType] = useState<ExteriorProjectTypeFilter>(initialExteriorType);

  const isExteriorMode = filter === "exterior";
  const galleryTitle = filter === "All" ? "Project Gallery" : serviceFilterLabel(filter);

  const onFilterChange = useCallback(
    (nextFilter: ProjectServiceFilter, nextExteriorType: ExteriorProjectTypeFilter) => {
      setFilter(nextFilter);
      setExteriorType(nextExteriorType);
    },
    [],
  );

  const setFilterAndUrl = useCallback(
    (next: ProjectServiceFilter) => {
      const nextExteriorType: ExteriorProjectTypeFilter = "All";
      setFilter(next);
      setExteriorType(nextExteriorType);
      router.replace(projectsGalleryPath(basePath, next, nextExteriorType), { scroll: false });
    },
    [basePath, router],
  );

  const setExteriorTypeAndUrl = useCallback(
    (next: ExteriorProjectTypeFilter) => {
      setExteriorType(next);
      router.replace(projectsGalleryPath(basePath, "exterior", next), { scroll: false });
    },
    [basePath, router],
  );

  const onCategoryFromHash = useCallback(
    (type: ExteriorProjectType) => {
      setFilter("exterior");
      setExteriorType(type);
    },
    [],
  );

  const filtered = useMemo(() => {
    if (isExteriorMode) return [];
    if (filter === "All") return projects;
    return projects.filter((p) => p.serviceSlug === filter);
  }, [filter, isExteriorMode]);

  const galleryKey = isExteriorMode ? "exterior" : filter;

  return (
    <main
      id="main-content"
      className={`gallery-page relative bg-bg-primary pb-24 pt-[calc(var(--hero-nav-stack)+1.5rem)] md:pb-32 md:pt-[calc(var(--hero-nav-stack)+2rem)]${
        isExteriorMode ? " gallery-page--exterior" : " overflow-x-clip"
      }`}
    >
      <GalleryHashSync onCategoryFromHash={onCategoryFromHash} />
      <div aria-hidden className="gallery-page__glow pointer-events-none absolute inset-0" />

      <Suspense fallback={null}>
        <ProjectsGallerySearchSync onFilterChange={onFilterChange} basePath={basePath} />
      </Suspense>

      <div className="gallery-page__shell relative mx-auto flex max-w-7xl flex-col px-5 md:px-10">
        <GalleryReveal
          as="header"
          dramatic
          className={`gallery-page__header flex flex-col ${isExteriorMode ? "gap-2 md:gap-8" : "gap-8 lg:flex-row lg:items-end lg:justify-between"}`}
        >
          <div className="max-w-3xl">
            <motion.p
              className="label-upper text-gold"
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={galleryTransition(!!reduceMotion, 0.45, 0.05)}
            >
              Case Studies
            </motion.p>
            <motion.h1
              className={`font-display italic text-ink-primary ${
                isExteriorMode
                  ? "mt-2 text-[2rem] leading-tight md:mt-3 md:text-5xl"
                  : "mt-3 text-4xl md:text-5xl"
              }`}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={galleryTransition(!!reduceMotion, 0.62, 0.1)}
            >
              {galleryTitle}
            </motion.h1>
            <GalleryGoldLine
              className={`max-w-xs ${isExteriorMode ? "mt-3 md:mt-5" : "mt-5"}`}
            />
            <motion.p
              className={`max-w-xl text-sm leading-relaxed text-ink-secondary md:text-base ${
                isExteriorMode ? "mt-3 md:mt-5" : "mt-5"
              }`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={galleryTransition(!!reduceMotion, 0.5, 0.22)}
            >
              {isExteriorMode
                ? "Select a collection. Browse one project at a time."
                : filter === "All"
                  ? "Filter by service line to explore Exterior Design, Interior Design, Ai Design, and Architect Dron collections."
                  : `Case studies and deliverables from our ${serviceFilterLabel(filter)} line.`}
            </motion.p>
          </div>

          <motion.div
            className={`gallery-page__filters flex max-w-full gap-1.5 ${isExteriorMode ? "flex-nowrap overflow-x-auto pb-0.5 scrollbar-none md:mt-2 md:flex-wrap md:gap-2" : "flex-wrap gap-2 md:justify-end"}`}
            role="tablist"
            aria-label="Filter projects by service"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={galleryTransition(!!reduceMotion, 0.5, 0.28)}
          >
            {projectServiceFilters.map((tab) => (
              <GalleryFilterPill
                key={tab}
                active={filter === tab}
                onClick={() => setFilterAndUrl(tab)}
                className={`label-upper rounded-full px-4 py-2 text-[0.65rem] sm:px-5 sm:text-[0.6875rem] ${
                  filter === tab ? "text-ink-primary" : "border border-gold/25 text-ink-secondary hover:border-gold/50 hover:text-ink-primary"
                }`}
              >
                {serviceFilterLabel(tab)}
              </GalleryFilterPill>
            ))}
          </motion.div>
        </GalleryReveal>

        <AnimatePresence mode="wait">
          {isExteriorMode ? (
            <div className="gallery-exterior-slot relative min-h-0 flex-1 md:flex-none">
              {GALLERY_CATEGORY_ANCHORS.map((anchor) => (
                <section
                  key={anchor.id}
                  id={anchor.id}
                  aria-label={anchor.label}
                  className="pointer-events-none h-px w-full scroll-mt-[calc(var(--hero-nav-stack)+2rem)]"
                />
              ))}
              <GallerySectionTransition key="exterior" sectionKey="exterior">
                <ExteriorGallery
                  activeType={exteriorType}
                  onSelectType={setExteriorTypeAndUrl}
                  onBackToServices={() => setFilterAndUrl("All")}
                />
              </GallerySectionTransition>
            </div>
          ) : (
            <GallerySectionTransition key={galleryKey} sectionKey={galleryKey} className="mt-12">
              <GalleryStagger
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                itemVariants={galleryCardItem}
                stagger={0.07}
                delayChildren={0.08}
              >
                {filtered.map((project) => (
                  <GalleryCard key={project.id} project={project} reduceMotion={!!reduceMotion} />
                ))}
              </GalleryStagger>
              {filtered.length === 0 && (
                <p className="mt-12 text-center text-sm text-ink-secondary">No projects match this filter.</p>
              )}
            </GallerySectionTransition>
          )}
        </AnimatePresence>

        <GalleryReveal delay={0.2} className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            href="/#contact"
            data-no-glow
            className="label-upper inline-flex rounded-full border border-gold/45 bg-gold/10 px-6 py-2.5 text-ink-primary transition-colors hover:bg-gold/20"
          >
            Request a project brief
          </Link>
          <Link
            href="/#services"
            data-no-glow
            className="label-upper inline-flex rounded-full border border-gold/25 px-6 py-2.5 text-ink-secondary transition-colors hover:border-gold/45 hover:text-ink-primary"
          >
            Back to services
          </Link>
        </GalleryReveal>
      </div>
    </main>
  );
}

function GalleryCard({
  project,
  reduceMotion,
}: {
  project: (typeof projects)[number];
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      id={project.id}
      className="gallery-card group relative min-h-[280px] overflow-hidden rounded-xl border border-gold/25 bg-bg-card"
      whileHover={
        reduceMotion
          ? {}
          : {
              y: -6,
              scale: 1.015,
              borderColor: "rgba(245, 197, 24, 0.45)",
              boxShadow: "0 28px 64px rgba(0, 0, 0, 0.48)",
            }
      }
      transition={reduceMotion ? { duration: 0 } : gallerySpring.soft}
    >
      <Link
        href={projectDetailPath(project)}
        className="absolute inset-0 z-10"
        aria-label={`View ${project.title} project`}
      >
        <span className="sr-only">View {project.title}</span>
      </Link>

      <motion.span
        aria-hidden
        className="gallery-card__shine pointer-events-none absolute inset-x-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={reduceMotion ? {} : { scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      <span className="pointer-events-none absolute left-4 top-4 z-[2] font-display text-sm italic text-gold md:text-base">
        {project.orderLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-[2] max-w-[10rem] truncate text-right font-outfit text-[10px] font-medium uppercase tracking-[0.14em] text-[#fff4c9]/90">
        {project.tag}
      </span>

      <motion.div
        className="absolute inset-0"
        whileHover={reduceMotion ? {} : { scale: 1.06 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/45 to-transparent" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] p-6 md:p-7">
        <h2 className="font-display text-2xl italic leading-tight text-ink-primary md:text-[1.65rem]">
          {project.title}
        </h2>
        <p className="mt-2 text-sm text-ink-secondary">{project.country}</p>
        <motion.span
          className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold"
          initial={{ opacity: 0, y: 8 }}
          whileHover={reduceMotion ? {} : { opacity: 1, y: 0 }}
        >
          View project <span aria-hidden>→</span>
        </motion.span>
      </div>
    </motion.article>
  );
}
