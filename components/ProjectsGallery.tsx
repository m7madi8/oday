"use client";

import "@/app/portfolio-gallery.css";
import {
  GalleryFilterPill,
  GalleryGoldLine,
  GalleryReveal,
  GallerySectionTransition,
  GalleryStagger,
} from "@/components/animations/GalleryMotion";
import { GalleryHashSync } from "@/components/GalleryHashSync";
import { PortfolioDesignGallery } from "@/components/portfolio/PortfolioDesignGallery";
import { ProjectsGallerySearchSync } from "@/components/ProjectsGallerySearchSync";
import { galleryCardItem, gallerySpring } from "@/lib/gallery-motion";
import { GALLERY_CATEGORY_ANCHORS } from "@/lib/gallery-anchors";
import {
  projectDetailPath,
  projectServiceFilters,
  projects,
  serviceFilterLabel,
  type ExteriorProjectType,
  type ExteriorProjectTypeFilter,
  type Project,
  type ProjectServiceFilter,
} from "@/lib/data";
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

  const isInteriorMode = filter === "interior";
  const isPortfolioMode = filter === "All" || isInteriorMode || filter === "exterior";
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
      setFilter(next);
      setExteriorType("All");
      router.replace(projectsGalleryPath(basePath, next, "All"), { scroll: false });
    },
    [basePath, router],
  );

  const onCategoryFromHash = useCallback((type: ExteriorProjectType) => {
    setFilter("exterior");
    setExteriorType(type);
  }, []);

  const filtered = useMemo(() => {
    if (isPortfolioMode) return [];
    return projects.filter((p) => p.serviceSlug === filter);
  }, [filter, isPortfolioMode]);

  const ancillaryProjects = useMemo(
    () => projects.filter((p) => p.serviceSlug !== "interior" && p.serviceSlug !== "exterior"),
    [],
  );

  const galleryKey = isPortfolioMode ? `portfolio-${filter}` : filter;

  return (
    <main
      id="main-content"
      className={`gallery-page relative bg-bg-primary pb-24 pt-[calc(var(--hero-nav-stack)+1.5rem)] md:pb-32 md:pt-[calc(var(--hero-nav-stack)+2rem)] gallery-page--portfolio overflow-x-clip`}
    >
      <GalleryHashSync onCategoryFromHash={onCategoryFromHash} />
      <div aria-hidden className="gallery-page__glow pointer-events-none absolute inset-0" />

      <Suspense fallback={null}>
        <ProjectsGallerySearchSync onFilterChange={onFilterChange} basePath={basePath} />
      </Suspense>

      <div className="gallery-page__shell relative mx-auto flex max-w-7xl flex-col px-5 md:px-10">
        <GalleryReveal>
          <header className="gallery-page__header flex flex-col gap-2 md:gap-8">
            <div className="min-w-0">
              <p className="label-upper text-gold">Case studies</p>
              <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3.25rem)] font-normal italic leading-[1.05] text-ink-primary">
                {galleryTitle}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-secondary md:mt-5 md:text-[0.9375rem]">
                Editorial grids for interior and exterior work — each card adapts to its cover aspect ratio.
              </p>
            </div>
            <motion.div className="gallery-page__filters flex max-w-full flex-nowrap gap-1.5 overflow-x-auto pb-0.5 scrollbar-none md:flex-wrap md:gap-2">
              {projectServiceFilters.map((tab) => (
                <GalleryFilterPill
                  key={tab}
                  active={filter === tab}
                  onClick={() => setFilterAndUrl(tab)}
                  className={`label-upper shrink-0 rounded-full px-4 py-2 text-[10px] tracking-[0.16em] transition-colors md:text-[11px] ${
                    filter === tab
                      ? "text-ink-primary"
                      : "border border-gold/25 text-ink-secondary hover:border-gold/50 hover:text-ink-primary"
                  }`}
                >
                  {serviceFilterLabel(tab)}
                </GalleryFilterPill>
              ))}
            </motion.div>
          </header>
          <GalleryGoldLine className="mt-8 max-w-md" />
        </GalleryReveal>

        <AnimatePresence mode="wait">
          {isPortfolioMode ? (
            <GallerySectionTransition key={galleryKey} sectionKey={galleryKey} className="mt-10 md:mt-12">
              {GALLERY_CATEGORY_ANCHORS.map((anchor) => (
                <section
                  key={anchor.id}
                  id={anchor.id}
                  aria-label={anchor.label}
                  className="pointer-events-none h-px w-full scroll-mt-[calc(var(--hero-nav-stack)+2rem)]"
                />
              ))}
              <PortfolioDesignGallery
                sections={
                  filter === "All" ? ["interior", "exterior"] : isInteriorMode ? ["interior"] : ["exterior"]
                }
              />
              {filter === "All" && ancillaryProjects.length > 0 ? (
                <div className="mt-16 md:mt-24">
                  <header className="mb-8 border-b border-white/[0.07] pb-6">
                    <p className="label-upper text-ink-muted">More services</p>
                    <h2 className="mt-2 font-display text-3xl italic text-ink-primary md:text-4xl">AI &amp; Drone</h2>
                  </header>
                  <GalleryStagger
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    itemVariants={galleryCardItem}
                    stagger={0.07}
                    delayChildren={0.08}
                  >
                    {ancillaryProjects.map((project) => (
                      <GalleryCard key={project.id} project={project} reduceMotion={!!reduceMotion} />
                    ))}
                  </GalleryStagger>
                </div>
              ) : null}
            </GallerySectionTransition>
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
  project: Project;
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
      <Link href={projectDetailPath(project)} className="absolute inset-0 z-10" aria-label={`View ${project.title}`}>
        <span className="sr-only">View {project.title}</span>
      </Link>
      <motion.div
        className="absolute inset-0"
        whileHover={reduceMotion ? {} : { scale: 1.06 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={project.image} alt={project.imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/45 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] p-6 md:p-7">
        <h2 className="font-display text-2xl italic leading-tight text-ink-primary md:text-[1.65rem]">{project.title}</h2>
        <p className="mt-2 text-sm text-ink-secondary">{project.country}</p>
      </div>
    </motion.article>
  );
}
