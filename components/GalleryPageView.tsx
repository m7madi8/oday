"use client";

import "@/app/portfolio-gallery.css";
import { FilterBar } from "@/components/FilterBar";
import { PortfolioDesignGallery } from "@/components/portfolio/PortfolioDesignGallery";
import { GalleryHashSync } from "@/components/GalleryHashSync";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectsGallerySearchSync } from "@/components/ProjectsGallerySearchSync";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "@/components/ClientMotion";
import {
  getCategoryOptions,
  type GalleryCategoryFilter,
} from "@/hooks/useFilteredProjects";
import { useFilteredProjects } from "@/hooks/useFilteredProjects";
import {
  projects,
  serviceSlugs,
  type ExteriorProjectType,
  type ExteriorProjectTypeFilter,
  type ProjectServiceFilter,
} from "@/lib/data";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const pageEase = [0.16, 1, 0.3, 1] as const;

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

function defaultCategoryForService(service: ProjectServiceFilter): GalleryCategoryFilter {
  if (service === "exterior") return "villas";
  return "All";
}

export function GalleryPageView({
  initialFilter,
  initialExteriorType = "villas",
  basePath = "/gallery",
}: {
  initialFilter: ProjectServiceFilter;
  initialExteriorType?: ExteriorProjectTypeFilter;
  basePath?: "/projects" | "/gallery";
}) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const [service, setService] = useState<ProjectServiceFilter>(initialFilter);
  const [category, setCategory] = useState<GalleryCategoryFilter>(
    initialFilter === "exterior" ? initialExteriorType : "All",
  );
  const [stickyActive, setStickyActive] = useState(false);
  const [batchAnimate, setBatchAnimate] = useState(false);
  const [filterKey, setFilterKey] = useState(`${initialFilter}-${initialExteriorType}`);
  const isFirstFilter = useRef(true);

  const filtered = useFilteredProjects(service, category);
  const isPortfolioService = service === "interior" || service === "exterior";
  const ancillaryFiltered = useMemo(
    () => (service === "All" ? filtered.filter((p) => p.serviceSlug !== "interior" && p.serviceSlug !== "exterior") : []),
    [filtered, service],
  );

  const onFilterChange = useCallback(
    (nextService: ProjectServiceFilter, nextExteriorType: ExteriorProjectTypeFilter) => {
      const nextCategory: GalleryCategoryFilter =
        nextService === "exterior" ? nextExteriorType : "All";
      setService(nextService);
      setCategory(nextCategory);
      setFilterKey(`${nextService}-${nextCategory}`);
    },
    [],
  );

  const onCategoryFromHash = useCallback((type: ExteriorProjectType) => {
    setService("exterior");
    setCategory(type);
    setFilterKey(`exterior-${type}`);
  }, []);

  const handleServiceChange = useCallback(
    (next: ProjectServiceFilter) => {
      const nextCategory = defaultCategoryForService(next);
      setService(next);
      setCategory(nextCategory);
      setFilterKey(`${next}-${nextCategory}`);
      router.replace(
        projectsGalleryPath(
          basePath,
          next,
          next === "exterior" && nextCategory !== "All" && nextCategory !== "Residential" && nextCategory !== "Cultural"
            ? (nextCategory as ExteriorProjectTypeFilter)
            : "All",
        ),
        { scroll: false },
      );
    },
    [basePath, router],
  );

  const handleCategoryChange = useCallback(
    (next: GalleryCategoryFilter) => {
      setCategory(next);
      setFilterKey(`${service}-${next}`);
      if (service === "exterior") {
        const extType =
          next === "All" || next === "Residential" || next === "Cultural"
            ? "All"
            : (next as ExteriorProjectTypeFilter);
        router.replace(projectsGalleryPath(basePath, "exterior", extType), { scroll: false });
      }
    },
    [basePath, router, service],
  );

  const clearFilters = useCallback(() => {
    setService("All");
    setCategory("All");
    setFilterKey("All-All");
    router.replace(basePath, { scroll: false });
  }, [basePath, router]);

  useEffect(() => {
    if (isFirstFilter.current) {
      isFirstFilter.current = false;
      return;
    }
    setBatchAnimate(true);
    const timer = window.setTimeout(() => setBatchAnimate(false), 900);
    return () => window.clearTimeout(timer);
  }, [filterKey]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStickyActive(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (service !== "All" && !getCategoryOptions(service).includes(category)) {
      setCategory("All");
    }
  }, [service, category]);

  const eyebrow = `${serviceSlugs.length} Services · ${projects.length} Projects`;

  return (
    <main
      id="main-content"
      className={`gallery-page relative min-h-screen bg-bg-primary pb-24 pt-[calc(var(--hero-nav-stack)+1.5rem)] md:pb-32 md:pt-[calc(var(--hero-nav-stack)+2rem)]${
        service === "exterior" ? " gallery-page--exterior-flat" : ""
      }`}
    >
      <GalleryHashSync onCategoryFromHash={onCategoryFromHash} />

      <Suspense fallback={null}>
        <ProjectsGallerySearchSync onFilterChange={onFilterChange} basePath={basePath} />
      </Suspense>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <header ref={heroRef} className="pb-8 md:pb-10">
          <motion.p
            className="font-ui text-[9px] uppercase tracking-[0.28em] text-gold"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: pageEase }}
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            className="mt-4 font-display text-[40px] font-extralight leading-[1.05] tracking-tight text-ink-primary md:text-[56px] xl:text-[72px]"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.12, ease: pageEase }}
          >
            Our Work
          </motion.h1>

          <motion.div
            aria-hidden
            className="mt-6 h-px w-16 bg-gold/70"
            initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.22, ease: pageEase }}
            style={{ originX: 0 }}
          />

          <motion.p
            className="mt-5 max-w-lg font-sub text-sm text-ink-secondary md:text-base"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: pageEase }}
          >
            Case studies across Exterior Design, Interior Design, Ai Design, and Architect Dron.
          </motion.p>
        </header>
      </div>

      <div
        className="min-w-0"
        style={
          reduceMotion
            ? undefined
            : {
                opacity: 0,
                animation: "gallery-filter-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.34s forwards",
              }
        }
      >
        <FilterBar
          service={service}
          category={category}
          onServiceChange={handleServiceChange}
          onCategoryChange={handleCategoryChange}
          stickyActive={stickyActive}
        />
      </div>

      <div className="relative mx-auto min-w-0 max-w-7xl px-5 md:px-10">
        <section className="mt-8 min-w-0 md:mt-10">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: pageEase }}
              >
                <p className="font-display text-2xl italic text-ink-muted md:text-3xl">
                  No projects found.
                </p>
                <button
                  type="button"
                  data-no-glow
                  onClick={clearFilters}
                  className="mt-4 font-ui text-[9px] uppercase tracking-[0.22em] text-gold transition-opacity hover:opacity-80"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : isPortfolioService || service === "All" ? (
              <motion.div
                key={filterKey}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <PortfolioDesignGallery
                  sections={
                    service === "All"
                      ? ["interior", "exterior"]
                      : service === "interior"
                        ? ["interior"]
                        : ["exterior"]
                  }
                  interiorProjects={service === "interior" || service === "All" ? filtered.filter((p) => p.serviceSlug === "interior") : undefined}
                  exteriorProjects={service === "exterior" || service === "All" ? filtered.filter((p) => p.serviceSlug === "exterior") : undefined}
                />
                {service === "All" && ancillaryFiltered.length > 0 ? (
                  <div className="mt-16 border-t border-white/[0.07] pt-12 md:mt-24">
                    <h2 className="mb-8 font-display text-3xl italic text-ink-primary">AI &amp; Drone</h2>
                    <div className="grid min-w-0 grid-cols-1 gap-px bg-white/[0.06] md:grid-cols-2 xl:grid-cols-3">
                      {ancillaryFiltered.map((project, index) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={index}
                          batchAnimate={batchAnimate}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ) : (
              <motion.div
                key={filterKey}
                className="grid min-w-0 grid-cols-1 gap-px bg-white/[0.06] md:grid-cols-2 xl:grid-cols-3"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {filtered.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    batchAnimate={batchAnimate}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
