"use client";

import { services } from "@/lib/content/services";
import { exteriorProjectTypes, exteriorTypeLabel } from "@/lib/data";
import type { ServiceSlug } from "@/lib/content/types";
import { ArrowUpRight, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

const EXTERIOR_SECTIONS = exteriorProjectTypes.map((type) => ({
  type,
  label: exteriorTypeLabel(type),
}));

const MOBILE_BP = 640;
const VIEWPORT_GUTTER = 20;
const EXIT_MS = 420;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function serviceHref(slug: ServiceSlug): string {
  return `/projects?service=${encodeURIComponent(slug)}`;
}

type PopoverLayout = {
  top: number;
  right: number;
  isMobile: boolean;
};

type CaseStudiesMenuProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
};

export function CaseStudiesMenu({ open, onClose, anchorRef }: CaseStudiesMenuProps) {
  const menuId = useId();
  const subPanelId = `${menuId}-exterior`;
  const [exteriorOpen, setExteriorOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [entered, setEntered] = useState(false);
  const [layout, setLayout] = useState<PopoverLayout | null>(null);
  const shownRef = useRef(false);
  const [subOffset, setSubOffset] = useState(0);

  const mainPanelRef = useRef<HTMLElement>(null);
  const exteriorTriggerRef = useRef<HTMLButtonElement>(null);
  const exteriorCloseTimer = useRef<number | null>(null);

  const clearExteriorClose = useCallback(() => {
    if (exteriorCloseTimer.current) {
      window.clearTimeout(exteriorCloseTimer.current);
      exteriorCloseTimer.current = null;
    }
  }, []);

  const openExterior = useCallback(() => {
    clearExteriorClose();
    setExteriorOpen(true);
  }, [clearExteriorClose]);

  const scheduleCloseExterior = useCallback(() => {
    clearExteriorClose();
    exteriorCloseTimer.current = window.setTimeout(() => setExteriorOpen(false), 180);
  }, [clearExteriorClose]);

  const isHoverPointer = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      shownRef.current = true;
      setShown(true);
      if (prefersReducedMotion()) {
        setEntered(true);
        return;
      }
      let cancelled = false;
      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!cancelled) setEntered(true);
        });
      });
      return () => {
        cancelled = true;
        window.cancelAnimationFrame(frame);
      };
    }

    setEntered(false);
    if (!shownRef.current) return;

    const id = window.setTimeout(() => {
      shownRef.current = false;
      setShown(false);
      setExteriorOpen(false);
    }, prefersReducedMotion() ? 0 : EXIT_MS);

    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!shown) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shown]);

  useEffect(() => {
    return () => {
      if (exteriorCloseTimer.current) {
        window.clearTimeout(exteriorCloseTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (exteriorOpen) setExteriorOpen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, exteriorOpen]);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const isMobile = window.innerWidth < MOBILE_BP;

    setLayout({
      top: rect.bottom + 8,
      right: Math.max(VIEWPORT_GUTTER, window.innerWidth - rect.right),
      isMobile,
    });

    if (exteriorOpen && exteriorTriggerRef.current && mainPanelRef.current) {
      setSubOffset(
        exteriorTriggerRef.current.offsetTop - mainPanelRef.current.offsetTop,
      );
    }
  }, [anchorRef, exteriorOpen]);

  useLayoutEffect(() => {
    if (!shown) {
      setLayout(null);
      return;
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [shown, measure]);

  if (!shown || !mounted) return null;

  const popoverStyle: CSSProperties | undefined = layout
    ? {
        ["--cs-popover-top" as string]: `${layout.top}px`,
        top: layout.top,
        ...(layout.isMobile
          ? {
              left: VIEWPORT_GUTTER,
              right: VIEWPORT_GUTTER,
            }
          : {
              right: layout.right,
              left: "auto",
            }),
      }
    : undefined;

  const subStyle: CSSProperties | undefined =
    subOffset > 0
      ? { ["--cs-sub-offset" as string]: `${subOffset}px` }
      : undefined;

  const popoverClass = [
    "case-studies-popover",
    layout?.isMobile ? "case-studies-popover--mobile" : "",
    exteriorOpen ? "is-exterior-open" : "",
    entered ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={`case-studies-menu-backdrop${entered ? " is-open" : ""}`}
        tabIndex={entered ? 0 : -1}
        onClick={onClose}
      />

      <div
        className={popoverClass}
        style={popoverStyle}
        aria-hidden={!entered}
        onClick={(event) => event.stopPropagation()}
      >
        <aside
          id={subPanelId}
          role="region"
          aria-label="Exterior design categories"
          aria-hidden={!exteriorOpen}
          style={subStyle}
          className={`case-studies-menu-sub${exteriorOpen ? " is-open" : ""}`}
          onMouseEnter={openExterior}
          onMouseLeave={scheduleCloseExterior}
        >
          <nav className="case-studies-menu-sub__nav" aria-label="Exterior categories">
            <ul className="case-studies-menu-sub__list">
              <li>
                <Link
                  href={serviceHref("exterior")}
                  className="case-studies-menu__sub case-studies-menu__sub--lead"
                  onClick={onClose}
                >
                  All exterior
                </Link>
              </li>
              {EXTERIOR_SECTIONS.map((section) => (
                <li key={section.type}>
                  <Link
                    href={`/projects?service=exterior&type=${encodeURIComponent(section.type)}`}
                    className="case-studies-menu__sub"
                    onClick={onClose}
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <aside
          ref={mainPanelRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Project categories"
          className="case-studies-menu"
        >
          <header className="case-studies-menu__header">
            <p className="case-studies-menu__eyebrow">Project lines</p>
            <button
              type="button"
              data-no-glow
              aria-label="Close menu"
              className="case-studies-menu__close"
              onClick={onClose}
            >
              <X className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            </button>
          </header>

          <div className="case-studies-menu__rule" aria-hidden />

          <nav className="case-studies-menu__nav" aria-label="Browse by service">
            <ul className="case-studies-menu__list">
              {services.map((service) => {
                const isExterior = service.slug === "exterior";

                if (isExterior) {
                  return (
                    <li
                      key={service.slug}
                      className="case-studies-menu__group"
                      onMouseEnter={openExterior}
                      onMouseLeave={scheduleCloseExterior}
                    >
                      <button
                        ref={exteriorTriggerRef}
                        type="button"
                        data-no-glow
                        className={`case-studies-menu__link case-studies-menu__link--trigger${exteriorOpen ? " is-open" : ""}`}
                        aria-expanded={exteriorOpen}
                        aria-controls={subPanelId}
                        onClick={() => {
                          if (isHoverPointer()) {
                            openExterior();
                            return;
                          }
                          setExteriorOpen((prev) => !prev);
                        }}
                        onFocus={openExterior}
                        onBlur={(event) => {
                          const next = event.relatedTarget as Node | null;
                          const sub = document.getElementById(subPanelId);
                          if (sub?.contains(next) || event.currentTarget.contains(next)) return;
                          scheduleCloseExterior();
                        }}
                      >
                        <span className="case-studies-menu__index">{service.orderLabel}</span>
                        <span className="case-studies-menu__label">{service.title}</span>
                        <ChevronLeft
                          className={`case-studies-menu__chevron case-studies-menu__chevron--left${exteriorOpen ? " is-active" : ""}`}
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={service.slug} className="case-studies-menu__group">
                    <Link
                      href={serviceHref(service.slug)}
                      className="case-studies-menu__link group"
                      onClick={onClose}
                    >
                      <span className="case-studies-menu__index">{service.orderLabel}</span>
                      <span className="case-studies-menu__label">{service.title}</span>
                      <ArrowUpRight className="case-studies-menu__arrow" strokeWidth={1.5} aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="case-studies-menu__rule case-studies-menu__rule--soft" aria-hidden />

          <footer className="case-studies-menu__footer">
            <Link href="/projects" className="case-studies-menu__gallery group" onClick={onClose}>
              <span>View full gallery</span>
              <ArrowUpRight className="case-studies-menu__gallery-icon" strokeWidth={1.5} aria-hidden />
            </Link>
          </footer>
        </aside>
      </div>
    </>,
    document.body,
  );
}
