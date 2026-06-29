"use client";

import { GalleryFilterCell, GalleryFilterGrid, GalleryFilterScope } from "@/components/GalleryFilterGrid";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "@/components/ClientMotion";
import {
  categoryFilterLabel,
  countProjectsForService,
  getCategoryOptions,
  useCategoryCounts,
  type GalleryCategoryFilter,
} from "@/hooks/useFilteredProjects";
import { projectServiceFilters, serviceFilterLabel, type ProjectServiceFilter } from "@/lib/data";

interface FilterBarProps {
  service: ProjectServiceFilter;
  category: GalleryCategoryFilter;
  onServiceChange: (service: ProjectServiceFilter) => void;
  onCategoryChange: (category: GalleryCategoryFilter) => void;
  stickyActive: boolean;
}

export function FilterBar({
  service,
  category,
  onServiceChange,
  onCategoryChange,
  stickyActive,
}: FilterBarProps) {
  const reduceMotion = useReducedMotion();
  const categoryCounts = useCategoryCounts(service);
  const categoryOptions = getCategoryOptions(service);
  const showLevel2 = service !== "All" && categoryOptions.length > 0;

  return (
    <div
      className={`sticky top-[calc(var(--hero-nav-stack)-0.25rem)] z-30 w-full border-b transition-[background-color,box-shadow,backdrop-filter,border-color] duration-200 ${
        stickyActive
          ? "border-white/10 bg-bg-primary shadow-[0_8px_32px_rgba(0,0,0,0.28)] md:bg-bg-primary/95 md:backdrop-blur-md"
          : "border-transparent bg-bg-primary md:bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-3 md:px-10">
        <GalleryFilterGrid variant="services" tier="primary" ariaLabel="Filter by service">
          {projectServiceFilters.map((tab, i) => (
            <GalleryFilterCell
              key={tab}
              tier="primary"
              index={tab === "All" ? undefined : String(i).padStart(2, "0")}
              active={service === tab}
              label={serviceFilterLabel(tab)}
              count={countProjectsForService(tab)}
              onClick={() => onServiceChange(tab)}
            />
          ))}
        </GalleryFilterGrid>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {showLevel2 ? (
          <motion.div
            key={service}
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <div className="mx-auto w-full max-w-7xl px-5 py-2.5 md:px-10 md:py-3">
              <GalleryFilterScope label={service === "exterior" ? "Exterior scope" : "Category"}>
                <GalleryFilterGrid
                  variant={service === "exterior" ? "exterior" : "auto"}
                  tier="secondary"
                  ariaLabel="Filter by category"
                >
                  {categoryOptions.map((cat) => (
                    <GalleryFilterCell
                      key={cat}
                      tier="secondary"
                      active={category === cat}
                      label={categoryFilterLabel(service, cat)}
                      count={categoryCounts[cat]}
                      onClick={() => onCategoryChange(cat)}
                    />
                  ))}
                </GalleryFilterGrid>
              </GalleryFilterScope>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
