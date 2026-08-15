"use client";

import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { NavMegaPanel } from "@/components/navigation/NavMegaPanel";
import { SearchOverlay } from "@/components/navigation/SearchOverlay";
import { SiteBackButton } from "@/components/SiteBackButton";
import { useActiveSection } from "@/hooks/useActiveSection";
import {
  getPrimaryNavPanels,
  type NavPanelId,
} from "@/lib/content/site-navigation";
import { ChevronDown, Facebook, Instagram, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import brandLogo from "@/imgs/oday-logo.png";

const loadEase = [0.22, 1, 0.36, 1] as const;
const softOut = [0.33, 1, 0.68, 1] as const;
const OPEN_DELAY = 90;
const CLOSE_DELAY = 240;
const SWITCH_DELAY = 0;

const menuListContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.06 },
  },
};

const menuListItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: softOut },
  },
};

const menuFooterVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: loadEase, delay: 0.22 },
  },
};

const menuPanelVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.28, ease: loadEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: loadEase },
  },
};

function MenuToggleIcon() {
  return (
    <span className="site-nav-menu-btn__icon" aria-hidden>
      <span className="site-nav-menu-btn__line site-nav-menu-btn__line--top" />
      <span className="site-nav-menu-btn__line site-nav-menu-btn__line--mid" />
      <span className="site-nav-menu-btn__line site-nav-menu-btn__line--bot" />
    </span>
  );
}

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
] as const;

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpand, setMobileExpand] = useState<NavPanelId | null>(null);
  const [activePanel, setActivePanel] = useState<NavPanelId | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isGallery = pathname.startsWith("/projects");
  const isRequest = pathname.startsWith("/request");
  const activeSection = useActiveSection(isHome);

  const panels = useMemo(() => getPrimaryNavPanels(), []);
  const activePanelConfig = useMemo(
    () => panels.find((p) => p.id === activePanel) ?? null,
    [panels, activePanel],
  );
  const displayedPanelRef = useRef(activePanelConfig);
  if (activePanelConfig) displayedPanelRef.current = activePanelConfig;
  const displayedPanel = activePanelConfig ?? displayedPanelRef.current;

  const invertLogo =
    isGallery || isRequest || (isHome && scrolled) || activePanel != null || searchOpen;
  const heroLogoGlow =
    isHome && !scrolled && !isGallery && !isRequest && !activePanel && !searchOpen;

  const clearTimers = useCallback(() => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const openPanelNow = useCallback(
    (id: NavPanelId) => {
      if (searchOpen || mobileOpen) return;
      const target = panels.find((p) => p.id === id);
      if (!target || target.variant === "none") return;
      clearTimers();
      setActivePanel(id);
    },
    [clearTimers, mobileOpen, panels, searchOpen],
  );

  const scheduleOpenPanel = useCallback(
    (id: NavPanelId) => {
      if (searchOpen || mobileOpen) return;
      const target = panels.find((p) => p.id === id);
      if (!target || target.variant === "none") return;
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      if (activePanel === id) return;
      if (activePanel) {
        clearTimers();
        if (SWITCH_DELAY <= 0) {
          setActivePanel(id);
          return;
        }
        openTimer.current = window.setTimeout(() => setActivePanel(id), SWITCH_DELAY);
        return;
      }
      openTimer.current = window.setTimeout(() => setActivePanel(id), OPEN_DELAY);
    },
    [activePanel, clearTimers, mobileOpen, panels, searchOpen],
  );

  const scheduleClosePanel = useCallback(() => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = window.setTimeout(() => setActivePanel(null), CLOSE_DELAY);
  }, []);

  const closeDesktopPanels = useCallback(() => {
    clearTimers();
    setActivePanel(null);
  }, [clearTimers]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileExpand(null);
  }, []);

  const openSearch = useCallback(() => {
    closeDesktopPanels();
    closeMobile();
    setSearchOpen(true);
  }, [closeDesktopPanels, closeMobile]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const linkActive = (href: string) => isNavLinkActive(pathname, href, activeSection);

  const handleMenuNavigate = useCallback(() => {
    closeMobile();
    closeDesktopPanels();
    closeSearch();
  }, [closeDesktopPanels, closeMobile, closeSearch]);

  useEffect(() => () => clearTimers(), [clearTimers]);

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (searchOpen) closeSearch();
        else if (activePanel) closeDesktopPanels();
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
  }, [
    activePanel,
    closeDesktopPanels,
    closeMobile,
    closeSearch,
    mobileOpen,
    openSearch,
    searchOpen,
  ]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    closeDesktopPanels();
    closeMobile();
    closeSearch();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const layerOpen = reduceMotion ? { duration: 0 } : { duration: 0.32, ease: loadEase };
  const layerClose = reduceMotion ? { duration: 0 } : { duration: 0.22, ease: loadEase };

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
          className={`mx-auto grid h-[var(--site-nav-height)] max-w-7xl items-center gap-3 overflow-visible px-4 sm:gap-4 sm:px-[var(--hero-gutter)] md:gap-6 md:px-8 lg:px-10 ${isHome ? "grid-cols-[auto_1fr_auto]" : "grid-cols-[auto_auto_1fr_auto]"}`}
        >
          {!isHome ? <SiteBackButton /> : null}
          <Link
            href="/#top"
            className="site-nav-logo flex shrink-0 items-center overflow-visible transition-opacity duration-300 hover:opacity-90"
            aria-label="OD Architects home"
            onClick={() => {
              closeMobile();
              closeDesktopPanels();
              closeSearch();
            }}
          >
            <Image
              src={brandLogo}
              alt="OD Architects"
              height={72}
              width={288}
              className={`site-nav-logo__img h-11 w-auto ${isHome ? "max-w-[min(240px,calc(100vw-7rem))]" : "max-w-[min(200px,calc(100vw-10.5rem))] sm:max-w-[min(240px,calc(100vw-12rem))]"} origin-left scale-[1.62] md:scale-[1.72] lg:scale-[1.82] ${invertLogo ? "site-nav-logo__img--inverted" : ""} ${heroLogoGlow ? "site-nav-logo__img--hero-glow" : ""}`}
              sizes="(max-width: 1024px) 200px, 280px"
            />
          </Link>

          <nav
            className="hidden min-w-0 items-center justify-center gap-4 lg:flex xl:gap-7"
            aria-label="Primary"
          >
            {panels.map((panel) => {
              const hasPanel = panel.variant !== "none";
              const isActive =
                activePanel === panel.id ||
                linkActive(panel.href) ||
                (panel.id === "gallery" && isGallery);
              return (
                <div
                  key={panel.id}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasPanel) scheduleOpenPanel(panel.id);
                    else scheduleClosePanel();
                  }}
                  onMouseLeave={() => {
                    if (hasPanel) scheduleClosePanel();
                  }}
                >
                  <Link
                    href={panel.href}
                    className={`site-nav-link ${hasPanel ? "site-nav-link--trigger" : ""} whitespace-nowrap ${isActive ? "site-nav-link--active" : ""}`}
                    aria-expanded={hasPanel ? activePanel === panel.id : undefined}
                    aria-haspopup={hasPanel ? "true" : undefined}
                    aria-current={linkActive(panel.href) ? "page" : undefined}
                    onFocus={() => {
                      if (hasPanel) openPanelNow(panel.id);
                    }}
                    onBlur={(e) => {
                      if (!hasPanel) return;
                      const next = e.relatedTarget as Node | null;
                      if (next && e.currentTarget.parentElement?.contains(next)) return;
                      scheduleClosePanel();
                    }}
                    onClick={handleMenuNavigate}
                  >
                    {panel.label}
                    {hasPanel ? (
                      <ChevronDown
                        className={`site-nav-link__chevron ${activePanel === panel.id ? "site-nav-link__chevron--open" : ""}`}
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
              onClick={() => (searchOpen ? closeSearch() : openSearch())}
            >
              <Search className="site-nav-search-bar__icon" strokeWidth={1.5} aria-hidden />
              <span className="site-nav-search-bar__label">Search</span>
            </button>
          </nav>

          <div className="flex shrink-0 items-center justify-end">
            <button
              type="button"
              data-no-glow
              suppressHydrationWarning
              className={`site-nav-menu-btn lg:hidden ${mobileOpen ? "site-nav-menu-btn--open" : ""}`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="site-menu-overlay"
              onClick={() => {
                closeSearch();
                closeDesktopPanels();
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
            if (activePanel) clearTimers();
          }}
        >
          <div className="pointer-events-auto">
            {displayedPanel && displayedPanel.variant !== "none" ? (
              <NavMegaPanel
                panel={displayedPanel}
                open={activePanel != null}
                onClose={closeDesktopPanels}
                onNavigate={() => undefined}
                onMouseEnter={() => {
                  if (activePanel) openPanelNow(activePanel);
                }}
                onMouseLeave={scheduleClosePanel}
              />
            ) : null}
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="menu-layer"
            id="site-menu-overlay"
            className="site-menu-overlay nav-menu-layer pointer-events-auto fixed inset-0 z-[530] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: layerOpen }}
            exit={{ opacity: 0, transition: layerClose }}
          >
            <motion.nav
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="site-menu-panel"
              variants={reduceMotion ? undefined : menuPanelVariants}
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? false : "show"}
              exit={reduceMotion ? undefined : "exit"}
            >
              <div className="site-menu-panel__head pt-5">
                <p className="site-menu-panel__eyebrow">Navigation</p>
              </div>

              <motion.ul
                className="site-menu-list"
                variants={reduceMotion ? undefined : menuListContainer}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? false : "show"}
              >
                {panels.map((panel, index) => {
                  const hasPanel = panel.variant !== "none";
                  if (!hasPanel) {
                    return (
                      <motion.li key={panel.id} variants={menuListItem}>
                        <Link
                          href={panel.href}
                          className="site-menu-item group w-full text-left"
                          onClick={handleMenuNavigate}
                        >
                          <span className="site-menu-item__index">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="site-menu-item__label">{panel.label}</span>
                        </Link>
                      </motion.li>
                    );
                  }

                  return (
                    <motion.li key={panel.id} variants={menuListItem}>
                      <button
                        type="button"
                        data-no-glow
                        className={`site-menu-item group w-full text-left ${mobileExpand === panel.id ? "site-menu-item--active" : ""}`}
                        aria-expanded={mobileExpand === panel.id}
                        onClick={() =>
                          setMobileExpand((v) => (v === panel.id ? null : panel.id))
                        }
                      >
                        <span className="site-menu-item__index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="site-menu-item__label">{panel.label}</span>
                        <ChevronDown
                          className={`site-menu-item__arrow h-5 w-5 stroke-[1.5] transition-transform ${mobileExpand === panel.id ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileExpand === panel.id ? (
                          <motion.div
                            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.38, ease: loadEase }}
                            className="overflow-hidden"
                          >
                            {panel.variant === "portrait" && panel.portrait ? (
                              <Link
                                href={panel.href}
                                className="site-menu-portrait"
                                onClick={handleMenuNavigate}
                              >
                                <span className="site-menu-portrait__media">
                                  <Image
                                    src={panel.portrait.image}
                                    alt={panel.portrait.imageAlt}
                                    fill
                                    className="object-cover object-[center_18%]"
                                    sizes="120px"
                                  />
                                </span>
                                <span className="site-menu-portrait__copy">
                                  <span className="site-menu-portrait__name">
                                    {panel.portrait.name}
                                  </span>
                                  <span className="site-menu-portrait__role">
                                    {panel.portrait.role}
                                  </span>
                                  <span className="site-menu-portrait__body">
                                    {panel.portrait.description}
                                  </span>
                                </span>
                              </Link>
                            ) : (
                              <ul className="site-menu-sublist">
                                <li>
                                  <Link
                                    href={panel.href}
                                    className="site-menu-subitem"
                                    onClick={handleMenuNavigate}
                                  >
                                    Overview
                                  </Link>
                                </li>
                                {panel.items.map((item) => (
                                  <li key={item.id}>
                                    <Link
                                      href={item.href}
                                      className="site-menu-subitem"
                                      onClick={handleMenuNavigate}
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.div
                className="site-menu-footer"
                variants={menuFooterVariants}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? false : "show"}
              >
                <div className="site-menu-footer__meta">
                  <div className="site-menu-footer__social">
                    {socialLinks.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        onClick={closeMobile}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden />
                      </a>
                    ))}
                  </div>
                  <p className="site-menu-footer__copy">© 2026 OD Architects</p>
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
