"use client";

import {
  GalleryGoldLine,
  GalleryReveal,
  GallerySectionTransition,
  GalleryStagger,
} from "@/components/animations/GalleryMotion";
import {
  exteriorGalleryCollections,
  getExteriorGalleryCollection,
  getExteriorProjectsByType,
  getExteriorProjectCount,
  projectDetailPath,
  type ExteriorGalleryCollection,
  type ExteriorGalleryLayout,
  type ExteriorProjectType,
  type ExteriorProjectTypeFilter,
  type Project,
} from "@/lib/data";
import {
  galleryHubCardItem,
  gallerySectionSwap,
  gallerySpring,
  galleryTransition,
} from "@/lib/gallery-motion";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  const isHub = activeType === "All";
  const collection = isHub ? null : getExteriorGalleryCollection(activeType);
  const collectionProjects = isHub ? [] : getExteriorProjectsByType(activeType);

  return (
    <AnimatePresence mode="wait">
      {isHub ? (
        <GallerySectionTransition key="exterior-hub" sectionKey="exterior-hub" className="mt-10">
          <ExteriorHub
            reduceMotion={!!reduceMotion}
            onSelectType={onSelectType}
            onBackToServices={onBackToServices}
          />
        </GallerySectionTransition>
      ) : collection ? (
        <GallerySectionTransition key={activeType} sectionKey={activeType} className="mt-10">
          <ExteriorCollectionView
            collection={collection}
            projects={collectionProjects}
            activeType={activeType}
            reduceMotion={!!reduceMotion}
            onSelectType={onSelectType}
            onBackToHub={() => onSelectType("All")}
            onBackToServices={onBackToServices}
          />
        </GallerySectionTransition>
      ) : null}
    </AnimatePresence>
  );
}

function ExteriorHub({
  reduceMotion,
  onSelectType,
  onBackToServices,
}: {
  reduceMotion: boolean;
  onSelectType: (type: ExteriorProjectType) => void;
  onBackToServices: () => void;
}) {
  const hubSpans: Record<ExteriorProjectType, string> = {
    villas:
      "lg:col-span-12 lg:min-h-[min(48vh,560px)] xl:min-h-[min(52vh,620px)] min-h-[min(72vw,420px)]",
    "residential-buildings":
      "lg:col-span-6 lg:min-h-[380px] xl:min-h-[420px] min-h-[min(56vw,280px)]",
    cottage: "lg:col-span-6 lg:min-h-[380px] xl:min-h-[420px] min-h-[min(48vw,240px)]",
    landscape: "lg:col-span-6 lg:min-h-[380px] xl:min-h-[420px] min-h-[min(52vw,300px)]",
    general: "lg:col-span-6 lg:min-h-[380px] xl:min-h-[420px] min-h-[min(52vw,300px)]",
  };

  return (
    <div className="exterior-gallery">
      <GalleryReveal dramatic>
        <button
          type="button"
          data-no-glow
          onClick={onBackToServices}
          className="group mb-8 inline-flex items-center gap-2 font-outfit text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          All service lines
        </button>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-bg-card/80 px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_12%_0%,rgba(245, 197, 24,0.16),transparent_58%)]"
          />
          <div className="relative lg:flex lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-3xl">
              <p className="label-upper text-gold">Exterior design</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] italic leading-[1.02] text-ink-primary xl:text-[3.75rem]">
                Five collections.
                <span className="mt-1 block text-[0.92em] text-ink-secondary/90">
                  One dedicated gallery each.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base lg:mt-6 lg:text-[1.05rem] lg:leading-relaxed">
                Villas, residential buildings, cottage architecture, landscape, and general scope — each with
                its own layout and case studies, separate from the main service-line gallery.
              </p>
            </div>
            <ul className="mt-8 hidden shrink-0 flex-col gap-3 border-l border-white/10 pl-8 lg:mt-0 lg:flex">
              {exteriorGalleryCollections.map((c) => (
                <li
                  key={c.type}
                  className="flex items-center gap-3 font-outfit text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted"
                >
                  <span className="font-display text-sm italic text-white/40">{c.orderLabel}</span>
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: c.accent }}
                    aria-hidden
                  />
                  {c.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <GalleryGoldLine className="mt-6 max-w-sm" />
      </GalleryReveal>

      <GalleryStagger
        className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-6 xl:gap-7"
        itemVariants={galleryHubCardItem}
        itemClassName={(index) => hubSpans[exteriorGalleryCollections[index].type]}
        stagger={0.09}
        delayChildren={0.18}
      >
        {exteriorGalleryCollections.map((collection) => {
          const items = getExteriorProjectsByType(collection.type);
          const cover = items[0];
          if (!cover) return null;

          return (
            <motion.button
              key={collection.type}
              type="button"
              data-no-glow
              className="exterior-gallery__hub-card exterior-gallery__frame group relative flex h-full w-full min-h-[inherit] flex-col justify-end overflow-hidden rounded-2xl text-left"
              style={{ "--hub-accent": collection.accent } as React.CSSProperties}
              whileHover={
                reduceMotion
                  ? {}
                  : {
                      y: -5,
                      scale: 1.012,
                      boxShadow: `0 32px 72px rgba(0,0,0,0.52), 0 0 40px ${collection.accent}22`,
                    }
              }
              transition={reduceMotion ? { duration: 0 } : gallerySpring.soft}
              onClick={() => onSelectType(collection.type)}
            >
              <div className="absolute inset-0">
                <Image
                  src={cover.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 90vw, (max-width: 1536px) 50vw, 40vw"
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, rgba(8,8,8,0.15) 0%, rgba(8,8,8,0.55) 52%, rgba(8,8,8,0.94) 100%)`,
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] opacity-90"
                style={{ background: collection.accent }}
              />

              <div
                className={`relative z-10 flex flex-col gap-3 p-6 md:p-7 lg:p-8 xl:p-9 ${
                  collection.type === "villas" ? "lg:flex-row lg:items-end lg:justify-between lg:gap-12" : ""
                }`}
              >
                <div className={collection.type === "villas" ? "lg:max-w-md xl:max-w-lg" : ""}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-sm italic text-white/70 lg:text-base">
                      {collection.orderLabel}
                    </span>
                    <span
                      className="rounded-full border px-2.5 py-1 font-outfit text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 lg:px-3 lg:py-1.5 lg:text-[11px]"
                      style={{
                        borderColor: `${collection.accent}66`,
                        background: `${collection.accent}22`,
                      }}
                    >
                      {getExteriorProjectCount(collection.type)} projects
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-display text-2xl italic text-ink-primary md:text-3xl lg:text-[2.1rem] xl:text-4xl">
                      {collection.title}
                    </h3>
                    <p className="mt-1 font-outfit text-[11px] font-medium uppercase tracking-[0.2em] text-white/55 lg:text-xs">
                      {collection.tagline}
                    </p>
                  </div>
                  {collection.type === "villas" ? (
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold lg:mt-6 lg:text-xs">
                      Enter collection <ArrowUpRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" aria-hidden />
                    </span>
                  ) : null}
                </div>
                <ul
                  className={`mt-1 space-y-1 border-t border-white/10 pt-3 ${
                    collection.type === "villas"
                      ? "lg:mt-0 lg:flex-1 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-1.5 xl:max-w-2xl"
                      : "lg:grid lg:grid-cols-1 lg:gap-y-1"
                  }`}
                >
                  {items.slice(0, collection.type === "villas" ? 6 : 4).map((p) => (
                    <li key={p.id} className="text-xs text-white/65 lg:text-[13px]">
                      {p.title}
                    </li>
                  ))}
                </ul>
                {collection.type !== "villas" ? (
                  <span className="mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold lg:mt-3 lg:text-xs">
                    Enter collection <ArrowUpRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" aria-hidden />
                  </span>
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </GalleryStagger>
    </div>
  );
}

function ExteriorCollectionView({
  collection,
  projects,
  activeType,
  reduceMotion,
  onSelectType,
  onBackToHub,
  onBackToServices,
}: {
  collection: ExteriorGalleryCollection;
  projects: Project[];
  activeType: ExteriorProjectType;
  reduceMotion: boolean;
  onSelectType: (type: ExteriorProjectTypeFilter) => void;
  onBackToHub: () => void;
  onBackToServices: () => void;
}) {
  return (
    <div
      className="exterior-gallery mt-8"
      style={
        {
          "--ex-accent": collection.accent,
          "--ex-accent-dim": `${collection.accent}24`,
          "--ex-accent-glow": `${collection.accent}38`,
        } as React.CSSProperties
      }
    >
      <GalleryReveal>
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-2 font-outfit text-[10px] font-medium uppercase tracking-[0.16em] text-ink-muted">
          <button type="button" data-no-glow className="transition-colors hover:text-gold" onClick={onBackToServices}>
            Gallery
          </button>
          <span aria-hidden>/</span>
          <button type="button" data-no-glow className="transition-colors hover:text-gold" onClick={onBackToHub}>
            Exterior
          </button>
          <span aria-hidden>/</span>
          <span className="text-ink-secondary">{collection.title}</span>
        </nav>

        <div className="exterior-gallery__frame exterior-gallery__frame--active relative mt-6 overflow-hidden rounded-2xl px-6 py-9 md:px-10 md:py-11">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
            style={{ background: `${collection.accent}22` }}
          />
          <p className="font-display text-sm italic text-white/50">{collection.orderLabel}</p>
          <h2 className="mt-2 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] italic leading-[1.02] text-ink-primary">
            {collection.title}
          </h2>
          <p className="mt-2 font-outfit text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
            {collection.tagline}
          </p>
          <div className="exterior-gallery__accent-line mt-6 max-w-md" />
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base">
            {collection.description}
          </p>
        </div>
        <GalleryGoldLine className="mt-6 max-w-md" />
      </GalleryReveal>

      <motion.div
        role="tablist"
        aria-label="Exterior collections"
        className="exterior-gallery__collection-nav mt-8 flex gap-2 overflow-x-auto pb-1"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={galleryTransition(!!reduceMotion, 0.45, 0.12)}
      >
        {exteriorGalleryCollections.map((c) => {
          const selected = c.type === activeType;
          return (
            <button
              key={c.type}
              type="button"
              role="tab"
              aria-selected={selected}
              data-no-glow
              className={`shrink-0 rounded-full border px-4 py-2.5 font-outfit text-[10px] font-medium uppercase tracking-[0.14em] transition-all sm:text-[11px] ${
                selected
                  ? "text-ink-primary"
                  : "border-white/10 bg-transparent text-ink-muted hover:border-white/20 hover:text-ink-secondary"
              }`}
              style={
                selected
                  ? {
                      borderColor: `${c.accent}88`,
                      background: `${c.accent}18`,
                      boxShadow: `0 0 24px ${c.accent}22`,
                    }
                  : undefined
              }
              onClick={() => onSelectType(c.type)}
            >
              {c.title}
            </button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          initial={reduceMotion ? false : gallerySectionSwap.initial}
          animate={gallerySectionSwap.animate}
          exit={reduceMotion ? undefined : gallerySectionSwap.exit}
          transition={galleryTransition(!!reduceMotion, 0.52)}
          className="mt-10"
        >
          <CollectionProjectGrid layout={collection.layout} projects={projects} reduceMotion={reduceMotion} />
        </motion.div>
      </AnimatePresence>

      <GalleryReveal delay={0.15} className="mt-12 flex flex-wrap gap-4">
        <button
          type="button"
          data-no-glow
          onClick={onBackToHub}
          className="label-upper inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-6 py-3 text-ink-primary transition-colors hover:bg-gold/18"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All exterior collections
        </button>
        <Link
          href="/request/exterior"
          className="label-upper inline-flex rounded-full border border-white/12 px-6 py-3 text-ink-secondary transition-colors hover:border-gold/35 hover:text-ink-primary"
        >
          Request exterior brief
        </Link>
      </GalleryReveal>
    </div>
  );
}

function CollectionProjectGrid({
  layout,
  projects,
  reduceMotion,
}: {
  layout: ExteriorGalleryLayout;
  projects: Project[];
  reduceMotion: boolean;
}) {
  if (projects.length === 0) {
    return <p className="text-center text-sm text-ink-secondary">No projects in this collection yet.</p>;
  }

  const [featured, ...rest] = projects;

  if (layout === "solo-hero" && featured) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-white/10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <ExteriorProjectCard
            project={featured}
            index={0}
            layout={layout}
            reduceMotion={reduceMotion}
            className="rounded-none border-0 lg:min-h-[520px]"
          />
          <div className="exterior-gallery__frame flex flex-col justify-center border-t border-white/10 bg-bg-card/90 p-8 md:p-10 lg:border-l lg:border-t-0">
            <p className="label-upper text-gold">Featured pavilion</p>
            <h3 className="mt-4 font-display text-3xl italic leading-snug text-ink-primary md:text-4xl">
              {featured.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{featured.tag}</p>
            <p className="mt-2 text-sm text-ink-muted">{featured.country}</p>
            <Link
              href={projectDetailPath(featured)}
              className="label-upper mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-gold/45 bg-gold/12 px-6 py-3 text-ink-primary transition-colors hover:bg-gold/20"
            >
              View case study <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {rest.map((project, index) => (
              <ExteriorProjectCard
                key={project.id}
                project={project}
                index={index + 1}
                layout={layout}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === "cultural-spotlight" && featured) {
    return (
      <div className="space-y-5">
        <ExteriorProjectCard
          project={featured}
          index={0}
          layout={layout}
          reduceMotion={reduceMotion}
        />
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {rest.map((project, index) => (
              <ExteriorProjectCard
                key={project.id}
                project={project}
                index={index + 1}
                layout={layout}
                reduceMotion={reduceMotion}
                className="min-h-[min(58vw,300px)] md:min-h-[320px]"
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const gridClass: Record<ExteriorGalleryLayout, string> = {
    "dual-feature": "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6",
    "tower-pair": "grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6",
    "solo-hero": "grid grid-cols-1 gap-5 sm:grid-cols-2",
    "landscape-grid": "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6",
    "cultural-spotlight": "grid grid-cols-1 gap-5 sm:grid-cols-2",
  };

  return (
    <div className={gridClass[layout]}>
      {projects.map((project, index) => (
        <ExteriorProjectCard
          key={project.id}
          project={project}
          index={index}
          layout={layout}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}

function ExteriorProjectCard({
  project,
  index,
  layout,
  reduceMotion,
  className = "",
}: {
  project: Project;
  index: number;
  layout: ExteriorGalleryLayout;
  reduceMotion: boolean;
  className?: string;
}) {
  const spanClass = getCardSpan(layout, index);
  const minHeight = getCardMinHeight(layout, index);

  return (
    <motion.article
      className={`exterior-gallery__project-card group relative overflow-hidden rounded-2xl bg-bg-card ${spanClass} ${minHeight} ${className}`}
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 28, scale: reduceMotion ? 1 : 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: reduceMotion ? 0 : 0.06 * index,
        duration: reduceMotion ? 0 : 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        reduceMotion
          ? {}
          : {
              y: -5,
              scale: 1.01,
              boxShadow: "0 24px 56px rgba(0, 0, 0, 0.45)",
            }
      }
    >
      <Link
        href={projectDetailPath(project)}
        className="absolute inset-0 z-10"
        aria-label={`View ${project.title}`}
      >
        <span className="sr-only">View {project.title}</span>
      </Link>

      <div className="absolute inset-0">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes={
            layout === "cultural-spotlight" || layout === "solo-hero"
              ? "(max-width: 1024px) 100vw, 70vw"
              : "(max-width: 768px) 100vw, 45vw"
          }
          priority={index === 0}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/35 to-bg-primary/10" />

      <div
        className={`pointer-events-none absolute bottom-0 left-0 right-0 z-[2] p-6 md:p-8 ${
          layout === "tower-pair" && index === 0 ? "md:pb-10" : ""
        }`}
      >
        <span className="font-display text-sm italic text-gold/90">{project.orderLabel}</span>
        <h3
          className={`mt-2 font-display italic leading-tight text-ink-primary ${
            layout === "cultural-spotlight"
              ? "text-3xl md:text-4xl"
              : layout === "tower-pair" && index === 0
                ? "text-3xl md:text-[2.1rem]"
                : "text-2xl md:text-[1.75rem]"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-ink-secondary">{project.country}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-muted">{project.tag}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View case study <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </motion.article>
  );
}

function getCardSpan(layout: ExteriorGalleryLayout, index: number): string {
  if (layout === "dual-feature") {
    if (index === 0) return "md:col-span-2 lg:col-span-4 lg:row-span-2";
    return "lg:col-span-2";
  }
  if (layout === "tower-pair") {
    if (index === 0) return "lg:col-span-7 lg:row-span-2";
    if (index <= 2) return "lg:col-span-5";
    return "lg:col-span-6";
  }
  if (layout === "landscape-grid") {
    if (index === 0) return "sm:col-span-2 lg:col-span-4 lg:row-span-2";
    if (index <= 2) return "lg:col-span-2";
    if (index === 3) return "lg:col-span-3";
    return "lg:col-span-3";
  }
  return "";
}

function getCardMinHeight(layout: ExteriorGalleryLayout, index: number): string {
  switch (layout) {
    case "dual-feature":
      return index === 0
        ? "min-h-[min(72vw,400px)] md:min-h-[440px] lg:min-h-[520px]"
        : "min-h-[min(58vw,280px)] md:min-h-[300px]";
    case "tower-pair":
      return index === 0
        ? "min-h-[min(75vw,400px)] lg:min-h-[500px]"
        : "min-h-[min(56vw,280px)] lg:min-h-[240px]";
    case "solo-hero":
      return "min-h-[min(58vw,300px)] md:min-h-[320px]";
    case "landscape-grid":
      return index === 0
        ? "min-h-[min(65vw,340px)] md:min-h-[400px] lg:min-h-[480px]"
        : "min-h-[min(52vw,260px)] md:min-h-[280px]";
    case "cultural-spotlight":
      return index === 0 ? "min-h-[min(80vw,440px)] md:min-h-[480px]" : "";
    default:
      return "min-h-[280px]";
  }
}
