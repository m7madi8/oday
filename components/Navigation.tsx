"use client";

import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { NavMegaPanel } from "@/components/navigation/NavMegaPanel";
import { SiteBackButton } from "@/components/SiteBackButton";
import dynamic from "next/dynamic";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useHoverIntent } from "@/hooks/useHoverIntent";
import { getPrimaryNavPanels, type NavPanelId } from "@/lib/content/site-navigation";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import brandLogo from "@/imgs/oday-logo.png";

const SearchOverlay = dynamic(
  () =>
    import("@/components/navigation/SearchOverlay").then((m) => ({ default: m.SearchOverlay })),
  { ssr: false },
);

function MenuToggleIcon() {
  return (
    <span className="site-nav-menu-btn__icon" aria-hidden>
      <span className="site-nav-menu-btn__line site-nav-menu-btn__line--top" />
      <span className="site-nav-menu-btn__line site-nav-menu-btn__line--mid" />
      <span className="site-nav-menu-btn__line site-nav-menu-btn__line--bot" />
    </span>
  );
}

function hrefToSectionId(href: string): string | null {
  if (href === "/#gallery" || href === "#gallery") return "gallery";
  if (href === "/projects" || href.startsWith("/projects")) return null;
  if (href === "/#top" || href === "#top") return "top";
  const hash = href.includes("#") ? href.split("#")[1] : "";
  return hash || null;
}

function isNavLinkActive(pathname: string, href: string, activeSection: string): boolean {
  if (href.startsWith("/projects") || href.includes("service=")) {
    return pathname.startsWith("/projects");
  }
  if (pathname !== "/") return false;
  const sectionId = hrefToSectionId(href);
  return sectionId != null && activeSection === sectionId;
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchReady, setSearchReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpand, setMobileExpand] = useState<NavPanelId | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelDomId = useId();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isGallery = pathname.startsWith("/projects");
  const isRequest = pathname.startsWith("/request");
  const activeSection = useActiveSection(isHome);

  const panels = useMemo(() => getPrimaryNavPanels(), []);

  // Overlays own the viewport while open, so hover panels stand down.
  const hover = useHoverIntent<NavPanelId>({
    openDelay: 90,
    closeDelay: 240,
    enabled: !searchOpen && !mobileOpen,
  });
  const activePanel = hover.value;

  const activePanelConfig = useMemo(
    () => panels.find((p) => p.id === activePanel) ?? null,
    [panels, activePanel],
  );
  // Keep the last panel mounted through its exit animation.
  const displayedPanelRef = useRef(activePanelConfig);
  if (activePanelConfig) displayedPanelRef.current = activePanelConfig;
  const displayedPanel = activePanelConfig ?? displayedPanelRef.current;

  const invertLogo =
    isGallery || isRequest || (isHome && scrolled) || activePanel != null || searchOpen;
  const heroLogoGlow =
    isHome && !scrolled && !isGallery && !isRequest && !activePanel && !searchOpen;

  const hasPanel = useCallback(
    (id: NavPanelId) => panels.find((p) => p.id === id)?.variant !== "none",
    [panels],
  );

  const openPanel = useCallback(
    (id: NavPanelId) => {
      if (hasPanel(id)) hover.openNow(id);
    },
    [hasPanel, hover],
  );

  const hoverPanel = useCallback(
    (id: NavPanelId) => {
      if (hasPanel(id)) hover.scheduleOpen(id);
      else hover.scheduleClose();
    },
    [hasPanel, hover],
  );

  /** Closing a hover panel from the keyboard must not drop focus onto <body>. */
  const closePanels = useCallback(() => {
    const openId = hover.value;
    hover.closeNow();
    if (!openId) return;
    const panelEl = document.getElementById(panelDomId);
    if (panelEl?.contains(document.activeElement)) {
      document.querySelector<HTMLElement>(`[data-nav-trigger="${openId}"]`)?.focus();
    }
  }, [hover, panelDomId]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileExpand(null);
  }, []);

  const openSearch = useCallback(() => {
    hover.closeNow();
    closeMobile();
    setSearchReady(true);
    setSearchOpen(true);
  }, [closeMobile, hover]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const handleMenuNavigate = useCallback(() => {
    closeMobile();
    hover.closeNow();
    closeSearch();
  }, [closeMobile, closeSearch, hover]);

  const isLinkActive = useCallback(
    (href: string) => isNavLinkActive(pathname, href, activeSection),
    [activeSection, pathname],
  );

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 48;
        setScrolled((prev) => (prev === next ? prev : next));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Single Escape owner for all three overlays, closing the topmost one first.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (searchOpen) closeSearch();
        else if (activePanel) closePanels();
        else if (mobileOpen) closeMobile();
      }
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activePanel, closeMobile, closePanels, closeSearch, mobileOpen, openSearch, searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    hover.closeNow();
    closeMobile();
    closeSearch();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const navTone = mobileOpen
    ? "site-nav--menu-open"
    : searchOpen || activePanel
      ? "site-nav--panel-open"
      : isGallery || isRequest || scrolled
        ? "site-nav--scrolled"
        : "site-nav--at-hero";

  return (
    <>
      <header
        suppressHydrationWarning
        className={`site-nav fixed inset-x-0 top-0 overflow-visible pt-[var(--hero-gutter)] ${
          mobileOpen || searchOpen || activePanel ? "z-[560]" : "z-[500]"
        } ${navTone}`}
      >
        <div
          className={`mx-auto grid h-[var(--site-nav-height)] max-w-7xl items-center gap-3 overflow-visible px-4 sm:gap-4 sm:px-[var(--hero-gutter)] md:gap-6 md:px-8 lg:px-10 ${
            isHome ? "grid-cols-[auto_1fr_auto]" : "grid-cols-[auto_auto_1fr_auto]"
          }`}
        >
          {!isHome ? <SiteBackButton /> : null}
          <Link
            href="/#top"
            className="site-nav-logo flex shrink-0 items-center overflow-visible transition-opacity duration-300 hover:opacity-90"
            aria-label="OD Architects home"
            onClick={handleMenuNavigate}
          >
            <Image
              src={brandLogo}
              alt="OD Architects"
              height={72}
              width={288}
              className={`site-nav-logo__img h-11 w-auto ${
                isHome
                  ? "max-w-[min(240px,calc(100vw-7rem))]"
                  : "max-w-[min(200px,calc(100vw-10.5rem))] sm:max-w-[min(240px,calc(100vw-12rem))]"
              } origin-left scale-[1.62] md:scale-[1.72] lg:scale-[1.82] ${
                invertLogo ? "site-nav-logo__img--inverted" : ""
              } ${heroLogoGlow ? "site-nav-logo__img--hero-glow" : ""}`}
              sizes="(max-width: 1024px) 200px, 280px"
            />
          </Link>

          <DesktopNav
            panels={panels}
            activePanel={activePanel}
            panelDomId={panelDomId}
            searchOpen={searchOpen}
            isLinkActive={isLinkActive}
            isGalleryRoute={isGallery}
            onHoverPanel={hoverPanel}
            onLeavePanel={hover.scheduleClose}
            onFocusPanel={openPanel}
            onClosePanels={hover.closeNow}
            onNavigate={handleMenuNavigate}
            onToggleSearch={() => (searchOpen ? closeSearch() : openSearch())}
          />

          <div className="flex shrink-0 items-center justify-end">
            <button
              ref={menuButtonRef}
              type="button"
              data-no-glow
              suppressHydrationWarning
              className={`site-nav-menu-btn lg:hidden ${mobileOpen ? "site-nav-menu-btn--open" : ""}`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="site-menu-overlay"
              onClick={() => {
                closeSearch();
                hover.closeNow();
                setMobileOpen((v) => !v);
              }}
            >
              <MenuToggleIcon />
              <span className="site-nav-menu-btn__label">{mobileOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-full hidden lg:block"
          onMouseEnter={() => {
            if (activePanel) hover.clearTimers();
          }}
        >
          <div className="pointer-events-auto">
            {displayedPanel && displayedPanel.variant !== "none" ? (
              <NavMegaPanel
                id={panelDomId}
                panel={displayedPanel}
                open={activePanel != null}
                onClose={hover.closeNow}
                onNavigate={handleMenuNavigate}
                onMouseEnter={() => {
                  if (activePanel) hover.openNow(activePanel);
                }}
                onMouseLeave={hover.scheduleClose}
              />
            ) : null}
          </div>
        </div>
      </header>

      {searchReady ? <SearchOverlay open={searchOpen} onClose={closeSearch} /> : null}

      <MobileMenu
        open={mobileOpen}
        panels={panels}
        expanded={mobileExpand}
        onToggleExpand={(id) => setMobileExpand((v) => (v === id ? null : id))}
        onNavigate={handleMenuNavigate}
        onClose={closeMobile}
        onOpenSearch={openSearch}
      />
    </>
  );
}
