"use client";

import type { NavPanelConfig, NavPanelId } from "@/lib/content/site-navigation";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, type KeyboardEvent } from "react";

type DesktopNavProps = {
  panels: NavPanelConfig[];
  activePanel: NavPanelId | null;
  panelDomId: string;
  searchOpen: boolean;
  isLinkActive: (href: string) => boolean;
  isGalleryRoute: boolean;
  onHoverPanel: (id: NavPanelId) => void;
  onLeavePanel: () => void;
  onFocusPanel: (id: NavPanelId) => void;
  onClosePanels: () => void;
  onNavigate: () => void;
  onToggleSearch: () => void;
};

export function DesktopNav({
  panels,
  activePanel,
  panelDomId,
  searchOpen,
  isLinkActive,
  isGalleryRoute,
  onHoverPanel,
  onLeavePanel,
  onFocusPanel,
  onClosePanels,
  onNavigate,
  onToggleSearch,
}: DesktopNavProps) {
  /** Arrows walk the top-level items; Down opens the panel and steps into it. */
  const onTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLAnchorElement>, panel: NavPanelConfig) => {
      const hasPanel = panel.variant !== "none";

      if (e.key === "ArrowDown" && hasPanel) {
        e.preventDefault();
        onFocusPanel(panel.id);
        window.setTimeout(() => {
          document
            .getElementById(panelDomId)
            ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
            ?.focus();
        }, 40);
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const triggers = Array.from(
          document.querySelectorAll<HTMLAnchorElement>("[data-nav-trigger]"),
        );
        const current = triggers.indexOf(e.currentTarget);
        if (current === -1) return;
        e.preventDefault();
        const step = e.key === "ArrowRight" ? 1 : -1;
        triggers[(current + step + triggers.length) % triggers.length].focus();
      }
    },
    [onFocusPanel, panelDomId],
  );

  return (
    <nav
      className="hidden min-w-0 items-center justify-center gap-4 lg:flex xl:gap-7"
      aria-label="Primary"
    >
      {panels.map((panel) => {
        const hasPanel = panel.variant !== "none";
        const isOpen = activePanel === panel.id;
        const isActive = isOpen || isLinkActive(panel.href) || (panel.id === "gallery" && isGalleryRoute);

        return (
          <div
            key={panel.id}
            className="relative"
            onMouseEnter={() => (hasPanel ? onHoverPanel(panel.id) : onLeavePanel())}
            onMouseLeave={() => {
              if (hasPanel) onLeavePanel();
            }}
          >
            <Link
              href={panel.href}
              data-nav-trigger={panel.id}
              className={`site-nav-link ${hasPanel ? "site-nav-link--trigger" : ""} whitespace-nowrap ${
                isActive ? "site-nav-link--active" : ""
              }`}
              aria-expanded={hasPanel ? isOpen : undefined}
              aria-haspopup={hasPanel ? "true" : undefined}
              aria-controls={hasPanel && isOpen ? panelDomId : undefined}
              aria-current={isLinkActive(panel.href) ? "page" : undefined}
              onFocus={() => {
                if (hasPanel) onFocusPanel(panel.id);
              }}
              onBlur={(e) => {
                if (!hasPanel) return;
                const next = e.relatedTarget as Node | null;
                if (next && e.currentTarget.parentElement?.contains(next)) return;
                onLeavePanel();
              }}
              onKeyDown={(e) => onTriggerKeyDown(e, panel)}
              onClick={onNavigate}
            >
              {panel.label}
              {hasPanel ? (
                <ChevronDown
                  className={`site-nav-link__chevron ${isOpen ? "site-nav-link__chevron--open" : ""}`}
                  strokeWidth={1.5}
                  aria-hidden
                />
              ) : null}
            </Link>
          </div>
        );
      })}

      <button
        type="button"
        data-no-glow
        className={`site-nav-search-bar ${searchOpen ? "site-nav-search-bar--active" : ""}`}
        aria-label="Search"
        aria-expanded={searchOpen}
        aria-controls="site-nav-search"
        onFocus={onClosePanels}
        onClick={onToggleSearch}
      >
        <Search className="site-nav-search-bar__icon" strokeWidth={1.5} aria-hidden />
      </button>
    </nav>
  );
}
