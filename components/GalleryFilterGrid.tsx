"use client";

import type { ReactNode } from "react";

/** Wraps filter tabs in a no-scroll grid — all options visible on small screens. */
export function GalleryFilterGrid({
  children,
  variant = "auto",
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  variant?: "auto" | "services" | "exterior";
  ariaLabel: string;
  className?: string;
}) {
  const variantClass =
    variant === "services"
      ? "gallery-filter-grid--services"
      : variant === "exterior"
        ? "gallery-filter-grid--exterior"
        : "";

  return (
    <nav
      className={`gallery-filter-grid ${variantClass} ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {children}
    </nav>
  );
}

export function GalleryFilterCell({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
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
      className={`gallery-filter-cell${active ? " is-active" : ""}`}
    >
      <span className="gallery-filter-cell__label">{label}</span>
      {count !== undefined ? (
        <span className="gallery-filter-cell__count" aria-hidden>
          {count}
        </span>
      ) : null}
    </button>
  );
}
