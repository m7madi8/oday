"use client";

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
import {
  projectServiceFilters,
  serviceFilterLabel,
  type ProjectServiceFilter,
} from "@/lib/data";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const SERVICE_SHORT: Record<ProjectServiceFilter, string> = {
  All: "All",
  exterior: "Exterior",
  interior: "Interior",
  "architecture-ai": "Ai Design",
  "architecture-drone": "Drone",
};

interface FilterBarProps {
  service: ProjectServiceFilter;
  category: GalleryCategoryFilter;
  onServiceChange: (service: ProjectServiceFilter) => void;
  onCategoryChange: (category: GalleryCategoryFilter) => void;
  stickyActive: boolean;
}

function FilterPill({
  active,
  label,
  shortLabel,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  shortLabel?: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-no-glow
      onClick={onClick}
      className="group relative shrink-0 px-3 py-2.5 active:scale-[0.97] sm:px-4"
    >
      <span className="flex items-baseline gap-1.5">
        <span
          className={`font-ui text-[9px] uppercase tracking-[0.18em] transition-colors duration-200 sm:tracking-[0.22em] ${
            active ? "text-ink-primary" : "text-ink-secondary hover:text-ink-primary"
          }`}
        >
          {shortLabel ? (
            <>
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </>
          ) : (
            label
          )}
        </span>
        {count !== undefined && (
          <span className="font-ui text-[9px] tabular-nums text-ink-muted">{count}</span>
        )}
      </span>
      <span
        aria-hidden
        className={`absolute bottom-1 left-3 right-3 h-px origin-left bg-gold transition-transform duration-200 md:left-4 md:right-4 ${
          active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
    </button>
  );
}

function FilterScrollRow({
  scrollRef,
  ariaLabel,
  children,
  bordered,
  compact,
}: {
  scrollRef: RefObject<HTMLDivElement>;
  ariaLabel: string;
  children: ReactNode;
  bordered?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`filter-bar-clip mx-auto w-full min-w-0 max-w-7xl md:overflow-visible md:px-10 ${
        bordered ? "border-t border-white/[0.08]" : ""
      }`}
    >
      <div
        ref={scrollRef}
        className="filter-bar-scroll overflow-x-auto overflow-y-hidden md:overflow-visible"
        role="presentation"
      >
        <nav
          className={`flex w-max min-w-full flex-nowrap gap-0 px-5 md:w-auto md:min-w-0 md:flex-wrap md:px-0 ${
            compact ? "py-2.5 md:pb-3" : "py-3"
          }`}
          role="tablist"
          aria-label={ariaLabel}
        >
          {children}
        </nav>
      </div>
    </div>
  );
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
  const level1ScrollRef = useRef<HTMLDivElement>(null);
  const level2ScrollRef = useRef<HTMLDivElement>(null);
  const [categoryKey, setCategoryKey] = useState(service);
  const userPickedRef = useRef(false);

  useEffect(() => {
    setCategoryKey(service);
  }, [service]);

  useEffect(() => {
    if (!userPickedRef.current) return;

    const scrollActiveIntoView = (container: HTMLDivElement | null) => {
      if (!container) return;
      const active = container.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!active) return;
      const activeLeft = active.offsetLeft;
      const activeWidth = active.offsetWidth;
      const target = activeLeft - container.clientWidth / 2 + activeWidth / 2;
      container.scrollTo({
        left: Math.max(0, target),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };

    scrollActiveIntoView(level1ScrollRef.current);
    scrollActiveIntoView(level2ScrollRef.current);
  }, [service, category, categoryKey, reduceMotion]);

  const showLevel2 = service !== "All";

  const pickService = (next: ProjectServiceFilter) => {
    userPickedRef.current = true;
    onServiceChange(next);
  };

  const pickCategory = (next: GalleryCategoryFilter) => {
    userPickedRef.current = true;
    onCategoryChange(next);
  };

  return (
    <div
      className={`sticky top-[calc(var(--hero-nav-stack)-0.25rem)] z-30 w-full border-b transition-[background-color,box-shadow,backdrop-filter,border-color] duration-200 ${
        stickyActive
          ? "border-white/10 bg-bg-primary shadow-[0_8px_32px_rgba(0,0,0,0.28)] md:bg-bg-primary/95 md:backdrop-blur-md"
          : "border-transparent bg-bg-primary md:bg-transparent"
      }`}
    >
      <FilterScrollRow scrollRef={level1ScrollRef} ariaLabel="Filter by service">
        {projectServiceFilters.map((tab) => (
          <FilterPill
            key={tab}
            active={service === tab}
            label={serviceFilterLabel(tab)}
            shortLabel={SERVICE_SHORT[tab]}
            count={countProjectsForService(tab)}
            onClick={() => pickService(tab)}
          />
        ))}
      </FilterScrollRow>

      <AnimatePresence mode="wait" initial={false}>
        {showLevel2 && (
          <motion.div
            key={categoryKey}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FilterScrollRow
              scrollRef={level2ScrollRef}
              ariaLabel="Filter by category"
              bordered
              compact
            >
              {categoryOptions.map((cat) => (
                <FilterPill
                  key={cat}
                  active={category === cat}
                  label={categoryFilterLabel(service, cat)}
                  count={categoryCounts[cat]}
                  onClick={() => pickCategory(cat)}
                />
              ))}
            </FilterScrollRow>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
