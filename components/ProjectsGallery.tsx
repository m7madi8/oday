"use client";

import "@/app/portfolio-gallery.css";
import {
  GalleryGoldLine,
  GalleryReveal,
  GallerySectionTransition,
  GalleryStagger,
} from "@/components/animations/GalleryMotion";
import { AiDesignGallery } from "@/components/AiDesignGallery";
import { DroneGallery } from "@/components/DroneGallery";
import { GalleryFilterCell, GalleryFilterGrid, GalleryFilterScope } from "@/components/GalleryFilterGrid";
import { GalleryHashSync } from "@/components/GalleryHashSync";
import { PortfolioDesignGallery } from "@/components/portfolio/PortfolioDesignGallery";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectsGallerySearchSync } from "@/components/ProjectsGallerySearchSync";
import { galleryCardItem } from "@/lib/gallery-motion";
import { GALLERY_CATEGORY_ANCHORS } from "@/lib/gallery-anchors";
import {
  categoryFilterLabel,
  countProjectsForCategory,
  countProjectsForService,
  type GalleryCategoryFilter,
} from "@/hooks/useFilteredProjects";
import {
  exteriorProjectTypes,
  projectServiceFilters,
  projects,
  serviceFilterLabel,
  type ExteriorProjectType,
  type ExteriorProjectTypeFilter,
  type ProjectServiceFilter,
} from "@/lib/data";
import { AnimatePresence } from "@/components/ClientMotion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

const ARCHIVE_PATH = "/projects";

function projectsGalleryPath(
  service: ProjectServiceFilter,
  exteriorType: ExteriorProjectTypeFilter,
) {
  if (service === "All") return ARCHIVE_PATH;
  const params = new URLSearchParams({ service });
  if (service === "exterior" && exteriorType !== "All") {
    params.set("type", exteriorType);
  }
  return `${ARCHIVE_PATH}?${params.toString()}`;
}

export function ProjectsGallery({
  initialFilter,
  initialExteriorType = "All",
}: {
  initialFilter: ProjectServiceFilter;
  initialExteriorType?: ExteriorProjectTypeFilter;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<ProjectServiceFilter>(initialFilter);
  const [exteriorType, setExteriorType] = useState<ExteriorProjectTypeFilter>(initialExteriorType);

  const isInteriorMode = filter === "interior";
  const isAiMode = filter === "architecture-ai";
  const isDroneMode = filter === "architecture-drone";
  const isVideoGalleryMode = isAiMode || isDroneMode;
  const isPortfolioMode = filter === "All" || isInteriorMode || filter === "exterior";
  const galleryTitle = filter === "All" ? "Project Gallery" : serviceFilterLabel(filter);

  const onFilterChange = useCallback(
    (nextFilter: ProjectServiceFilter, nextExteriorType: ExteriorProjectTypeFilter) => {
      setFilter(nextFilter);
      setExteriorType(nextExteriorType);
      router.replace(projectsGalleryPath(nextFilter, nextExteriorType), { scroll: false });
    },
    [router],
  );

  const setFilterAndUrl = useCallback(
    (next: ProjectServiceFilter) => {
      setFilter(next);
      setExteriorType("All");
      router.replace(projectsGalleryPath(next, "All"), { scroll: false });
    },
    [router],
  );

  const setExteriorTypeAndUrl = useCallback(
    (next: ExteriorProjectTypeFilter) => {
      setExteriorType(next);
      router.replace(projectsGalleryPath("exterior", next), { scroll: false });
    },
    [router],
  );

  const exteriorProjectsForGallery = useMemo(() => {
    const list = projects.filter((p) => p.serviceSlug === "exterior");
    // "All" means the whole exterior archive, not the first collection.
    if (exteriorType === "All") return list;
    return list.filter((p) => p.exteriorType === exteriorType);
  }, [exteriorType]);

  const onCategoryFromHash = useCallback(
    (type: ExteriorProjectType) => {
      setFilter("exterior");
      setExteriorType(type);
      router.replace(projectsGalleryPath("exterior", type), { scroll: false });
    },
    [router],
  );

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
        <ProjectsGallerySearchSync onFilterChange={onFilterChange} />
      </Suspense>

      <div className="gallery-page__shell relative mx-auto flex w-full flex-col">
        <GalleryReveal>
          <header className="gallery-page__header flex flex-col gap-2 md:gap-8">
            <div className="min-w-0">
              <p className="label-upper text-gold">Case studies</p>
              <h1 className="page-title mt-2">
                {galleryTitle}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-secondary md:mt-5 md:text-[0.9375rem]">
                {isAiMode
                  ? "Cinematic AI concept films — motion studies built for fast alignment and premium client presentation."
                  : isDroneMode
                    ? "Aerial site films and drone capture — full-frame delivery for context reads and progress reporting."
                    : "Editorial grids for interior and exterior work — each card adapts to its cover aspect ratio."}
              </p>
            </div>
            <div className="gallery-page__filter-dock">
              <GalleryFilterGrid
                variant="services"
                tier="primary"
                ariaLabel="Filter by service"
                className="gallery-page__filters"
              >
                {projectServiceFilters.map((tab, i) => (
                  <GalleryFilterCell
                    key={tab}
                    tier="primary"
                    index={tab === "All" ? undefined : String(i).padStart(2, "0")}
                    active={filter === tab}
                    label={serviceFilterLabel(tab)}
                    count={countProjectsForService(tab)}
                    onClick={() => setFilterAndUrl(tab)}
                  />
                ))}
              </GalleryFilterGrid>

              {filter === "exterior" ? (
                <GalleryFilterScope label="Exterior scope" className="mt-4 border-t border-white/[0.06] pt-3">
                  <GalleryFilterGrid variant="exterior" tier="secondary" ariaLabel="Exterior collections">
                    <GalleryFilterCell
                      tier="secondary"
                      active={exteriorType === "All"}
                      label={categoryFilterLabel("exterior", "All")}
                      count={countProjectsForCategory("exterior", "All")}
                      onClick={() => setExteriorTypeAndUrl("All")}
                    />
                    {exteriorProjectTypes.map((type) => (
                      <GalleryFilterCell
                        key={type}
                        tier="secondary"
                        active={exteriorType === type}
                        label={categoryFilterLabel("exterior", type as GalleryCategoryFilter)}
                        count={countProjectsForCategory("exterior", type as GalleryCategoryFilter)}
                        onClick={() => setExteriorTypeAndUrl(type)}
                      />
                    ))}
                  </GalleryFilterGrid>
                </GalleryFilterScope>
              ) : null}
            </div>
          </header>
          <GalleryGoldLine className="mt-8 max-w-md" />
        </GalleryReveal>

        <AnimatePresence mode="wait">
          {isVideoGalleryMode ? (
            <GallerySectionTransition key={galleryKey} sectionKey={galleryKey} className="mt-10 md:mt-12">
              {isAiMode ? <AiDesignGallery /> : <DroneGallery />}
            </GallerySectionTransition>
          ) : (
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
                exteriorProjects={filter === "exterior" ? exteriorProjectsForGallery : undefined}
              />
              {filter === "All" && ancillaryProjects.length > 0 ? (
                <div className="mt-16 md:mt-24">
                  <header className="mb-8 border-b border-white/[0.07] pb-6">
                    <p className="label-upper text-ink-muted">More services</p>
                    <h2 className="section-title mt-2">Ai architect &amp; Drone</h2>
                  </header>
                  <GalleryStagger
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    itemVariants={galleryCardItem}
                    stagger={0.07}
                    delayChildren={0.08}
                  >
                    {ancillaryProjects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} variant="grid" index={i} />
                    ))}
                  </GalleryStagger>
                </div>
              ) : null}
            </GallerySectionTransition>
          )}
        </AnimatePresence>

        <GalleryReveal delay={0.2} className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            href="/#contact"
            data-no-glow
            className="btn btn--primary"
          >
            Request a project brief
          </Link>
          <Link
            href="/#services"
            data-no-glow
            className="btn btn--ghost"
          >
            Back to services
          </Link>
        </GalleryReveal>
      </div>
    </main>
  );
}

