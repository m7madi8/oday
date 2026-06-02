"use client";

import { GallerySectionTransition } from "@/components/animations/GalleryMotion";
import { GalleryFilterCell, GalleryFilterGrid } from "@/components/GalleryFilterGrid";
import {
  exteriorGalleryCollections,
  getExteriorGalleryCollection,
  getExteriorProjectsByType,
  projectDetailPath,
  type ExteriorGalleryCollection,
  type ExteriorProjectType,
  type ExteriorProjectTypeFilter,
  type Project,
} from "@/lib/data";
import { galleryTransition } from "@/lib/gallery-motion";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_TYPE = exteriorGalleryCollections[0].type;
const SWIPE_THRESHOLD = 48;

type SlideDirection = -1 | 0 | 1;

export function ExteriorGallery({
  activeType,
  onSelectType,
  onBackToServices,
}: {
  activeType: ExteriorProjectTypeFilter;
  onSelectType: (type: ExteriorProjectTypeFilter) => void;
  onBackToServices: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [currentType, setCurrentType] = useState<ExteriorProjectType>(
    activeType === "All" ? DEFAULT_TYPE : activeType,
  );
  const [projectIndex, setProjectIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>(0);
  const touchStartX = useRef<number | null>(null);

  const collection = getExteriorGalleryCollection(currentType);
  const projects = getExteriorProjectsByType(currentType);
  const activeProject = projects[projectIndex] ?? projects[0];
  const progress = projects.length > 0 ? ((projectIndex + 1) / projects.length) * 100 : 0;

  const goToProject = useCallback((index: number, direction: SlideDirection) => {
    if (!projects.length) return;
    const wrapped =
      ((index % projects.length) + projects.length) % projects.length;
    setSlideDirection(direction);
    setProjectIndex(wrapped);
  }, [projects.length]);

  const goNext = useCallback(() => {
    goToProject(projectIndex + 1, 1);
  }, [goToProject, projectIndex]);

  const goPrev = useCallback(() => {
    goToProject(projectIndex - 1, -1);
  }, [goToProject, projectIndex]);

  const handlePick = useCallback(
    (type: ExteriorProjectType) => {
      setSlideDirection(0);
      setCurrentType(type);
      setProjectIndex(0);
      onSelectType(type);
    },
    [onSelectType],
  );

  useEffect(() => {
    if (activeType === "All") return;
    setSlideDirection(0);
    setCurrentType(activeType);
    setProjectIndex(0);
  }, [activeType]);

  useEffect(() => {
    setSlideDirection(0);
    setProjectIndex(0);
  }, [currentType]);

  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null || projects.length < 2) return;
    const delta = touchStartX.current - clientX;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta > 0) goNext();
    else goPrev();
  };

  if (!collection) return null;

  return (
    <GallerySectionTransition key="exterior" sectionKey="exterior" className="xgl-enter">
      <article
        className="xgl"
        style={{ "--xgl-accent": collection.accent } as React.CSSProperties}
      >
        <header className="xgl__header">
          <div className="xgl__header-row">
            <button type="button" data-no-glow onClick={onBackToServices} className="xgl__back">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              <span>Gallery</span>
            </button>
            <p className="xgl__collection-label">
              <span className="xgl__collection-order">{collection.orderLabel}</span>
              {collection.title}
            </p>
          </div>

          <GalleryFilterGrid variant="exterior" ariaLabel="Exterior collections" className="xgl__chips">
            {exteriorGalleryCollections.map((item) => {
              const selected = currentType === item.type;
              return (
                <GalleryFilterCell
                  key={item.type}
                  active={selected}
                  label={item.title}
                  onClick={() => handlePick(item.type)}
                />
              );
            })}
          </GalleryFilterGrid>
        </header>

        <div className="xgl__body" aria-live="polite">
          {projects.length === 0 || !activeProject ? (
            <p className="xgl__empty">No projects in this collection yet.</p>
          ) : (
            <>
              <Stage
                collection={collection}
                project={activeProject}
                projectIndex={projectIndex}
                projectCount={projects.length}
                progress={progress}
                slideDirection={slideDirection}
                reduceMotion={!!reduceMotion}
                onPrev={goPrev}
                onNext={goNext}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                canNavigate={projects.length > 1}
              />

              {projects.length > 1 ? (
                <Filmstrip
                  projects={projects}
                  activeIndex={projectIndex}
                  onSelect={(index) =>
                    goToProject(index, index > projectIndex ? 1 : index < projectIndex ? -1 : 0)
                  }
                />
              ) : null}
            </>
          )}
        </div>
      </article>
    </GallerySectionTransition>
  );
}

function Stage({
  collection,
  project,
  projectIndex,
  projectCount,
  progress,
  slideDirection,
  reduceMotion,
  onPrev,
  onNext,
  onTouchStart,
  onTouchEnd,
  canNavigate,
}: {
  collection: ExteriorGalleryCollection;
  project: Project;
  projectIndex: number;
  projectCount: number;
  progress: number;
  slideDirection: SlideDirection;
  reduceMotion: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTouchStart: (x: number) => void;
  onTouchEnd: (x: number) => void;
  canNavigate: boolean;
}) {
  return (
    <div
      className="xgl__stage"
      onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
    >
      {canNavigate ? (
        <div className="xgl__progress" aria-hidden>
          <span className="xgl__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      <div className="xgl__stage-inner">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={`${collection.type}-${project.id}`}
            className="xgl__stage-frame"
            custom={slideDirection}
            variants={{
              enter: (d: SlideDirection) => ({
                opacity: 0,
                x: reduceMotion ? 0 : d > 0 ? 56 : d < 0 ? -56 : 0,
                scale: reduceMotion ? 1 : 1.05,
              }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: SlideDirection) => ({
                opacity: 0,
                x: reduceMotion ? 0 : d > 0 ? -56 : d < 0 ? 56 : 40,
                scale: reduceMotion ? 1 : 0.97,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={galleryTransition(reduceMotion, 0.48)}
          >
            <Link href={projectDetailPath(project)} className="xgl__stage-link group">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                className="xgl__stage-img object-cover"
                sizes="(max-width: 767px) 100vw, 72vw"
                priority
              />
              <div className="xgl__stage-shade" aria-hidden />
              <div className="xgl__stage-grain" aria-hidden />
              <div className="xgl__stage-edge" aria-hidden />

              <div className="xgl__stage-meta">
                <p className="xgl__stage-tagline">{collection.tagline}</p>
                <p className="xgl__stage-index">
                  <span className="xgl__stage-index-current">
                    {String(projectIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="xgl__stage-index-total"> / {String(projectCount).padStart(2, "0")}</span>
                </p>
                <h2 className="xgl__stage-title">{project.title}</h2>
                <span className="xgl__stage-cta">
                  Explore project
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {canNavigate ? (
          <div className="xgl__stage-nav">
            <button
              type="button"
              data-no-glow
              className="xgl__stage-btn"
              aria-label="Previous project"
              onClick={onPrev}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              data-no-glow
              className="xgl__stage-btn"
              aria-label="Next project"
              onClick={onNext}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Filmstrip({
  projects,
  activeIndex,
  onSelect,
}: {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="xgl__film">
      <ul
        className={`xgl__film-track${
          projects.length <= 5 ? ` xgl__film-track--${projects.length}` : " xgl__film-track--many"
        }`}
        role="tablist"
        aria-label="Projects in collection"
      >
        {projects.map((project, index) => {
          const selected = index === activeIndex;
          return (
            <li key={project.id}>
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                data-no-glow
                className={`xgl__film-item${selected ? " is-active" : ""}`}
                onClick={() => onSelect(index)}
              >
                <span className="xgl__film-thumb">
                  <Image src={project.image} alt="" fill className="object-cover" sizes="96px" />
                </span>
                <span className="xgl__film-caption">{project.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
