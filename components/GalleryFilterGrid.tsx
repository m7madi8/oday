"use client";

import type { ReactNode } from "react";

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
  const resolvedTier: GalleryFilterTier =
    tier ?? (variant === "services" ? "primary" : variant === "exterior" ? "secondary" : "secondary");

  const variantClass =
    variant === "services"
      ? "gallery-filter-grid--services"
      : variant === "exterior"
        ? "gallery-filter-grid--exterior"
        : "";

  return (
    <nav
      className={`gallery-filter-grid gallery-filter-grid--${resolvedTier} ${variantClass} ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {children}
    </nav>
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
