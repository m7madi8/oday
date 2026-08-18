"use client";

import { useCallback, useRef, type KeyboardEvent, type ReactNode } from "react";

export type GalleryFilterTier = "primary" | "secondary";

/** Wraps filter tabs — primary = service lines; secondary = sub-collections. */
export function GalleryFilterGrid({
  children,
  variant = "auto",
  tier,
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  variant?: "auto" | "services" | "exterior";
  tier?: GalleryFilterTier;
  ariaLabel: string;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const resolvedTier: GalleryFilterTier =
    tier ?? (variant === "services" ? "primary" : variant === "exterior" ? "secondary" : "secondary");

  const variantClass =
    variant === "services"
      ? "gallery-filter-grid--services"
      : variant === "exterior"
        ? "gallery-filter-grid--exterior"
        : "";

  // Tablist keyboard contract: arrows move between tabs, Home/End jump to the ends.
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;

    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    if (tabs.length === 0) return;

    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;

    e.preventDefault();
    const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? tabs.length - 1
          : (current + (forward ? 1 : -1) + tabs.length) % tabs.length;

    tabs[next].focus();
  }, []);

  return (
    <div
      ref={listRef}
      className={`gallery-filter-grid gallery-filter-grid--${resolvedTier} ${variantClass} ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

export function GalleryFilterScope({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`gallery-filter-scope ${className}`.trim()}>
      <p className="gallery-filter-scope__label">{label}</p>
      {children}
    </div>
  );
}

export function GalleryFilterCell({
  active,
  label,
  count,
  onClick,
  tier = "secondary",
  index,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
  tier?: GalleryFilterTier;
  index?: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      data-no-glow
      onClick={onClick}
      className={`gallery-filter-cell gallery-filter-cell--${tier}${active ? " is-active" : ""}`}
    >
      {tier === "primary" && index ? (
        <span className="gallery-filter-cell__index" aria-hidden>
          {index}
        </span>
      ) : null}

      <span className="gallery-filter-cell__body">
        <span className="gallery-filter-cell__label">{label}</span>
        {count !== undefined ? (
          <>
            {tier === "secondary" ? (
              <span className="gallery-filter-cell__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="gallery-filter-cell__count" aria-hidden>
              {count}
            </span>
          </>
        ) : null}
      </span>

      {tier === "primary" ? (
        <span className="gallery-filter-cell__corner gallery-filter-cell__corner--br" aria-hidden />
      ) : null}
    </button>
  );
}
