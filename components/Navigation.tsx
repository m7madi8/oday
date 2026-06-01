"use client";

import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

import brandLogo from "@/imgs/oday-logo.png";

const loadEase = [0.22, 1, 0.36, 1] as const;
const softOut = [0.33, 1, 0.68, 1] as const;

const menuListContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const menuListItem = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.48, ease: softOut },
  },
};

const menuFooterVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: loadEase, delay: 0.35 },
  },
};

const menuPanelVariants = {
  hidden: { opacity: 0, x: "100%" },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: loadEase },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.28, ease: loadEase },
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

function resolveMenuHref(href: string): string {
  if (href.startsWith("/")) return href;
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

const mainLinks = [
  { href: "/#top", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/projects", label: "Gallery" },
  { href: "/#location", label: "Location" },
] as const;

const secondaryLinks = [
  { href: "/#contact", label: "Contact" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#footer", label: "Legal" },
] as const;

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
] as const;

function hrefToSectionId(href: string): string | null {
  if (href === "/projects" || href.startsWith("/projects")) return null;
  if (href === "/#top" || href === "#top") return "top";
  const hash = href.includes("#") ? href.split("#")[1] : "";
  return hash || null;
}

function isNavLinkActive(pathname: string, href: string, activeSection: string): boolean {
  if (href === "/projects" || href.startsWith("/projects")) {
    return pathname.startsWith("/projects");
  }
  if (pathname !== "/") return false;
  const sectionId = hrefToSectionId(href);
  return sectionId != null && activeSection === sectionId;
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isGallery = pathname.startsWith("/projects");
  const isRequest = pathname.startsWith("/request");
  const activeSection = useActiveSection(isHome);
  const invertLogo = isGallery || isRequest || (isHome && scrolled);
  const heroLogoGlow = isHome && !scrolled && !isGallery && !isRequest;

  const close = useCallback(() => setOpen(false), []);
  const linkActive = (href: string) => isNavLinkActive(pathname, href, activeSection);
  const toggle = () => setOpen((v) => !v);

  const handleMenuNavigate = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      close();

      const resolved = resolveMenuHref(href);
      let path: string;
      let hash = "";

      try {
        const url = new URL(resolved, window.location.origin);
        path = url.pathname;
        hash = url.hash.replace(/^#/, "");
      } catch {
        return;
      }

      if (path === pathname && hash) {
        close();
      }
    },
    [close, pathname],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const layerOpen = reduceMotion ? { duration: 0 } : { duration: 0.32, ease: loadEase };
  const layerClose = reduceMotion ? { duration: 0 } : { duration: 0.22, ease: loadEase };

  const navTone = open
    ? "site-nav--menu-open"
    : isGallery || isRequest || scrolled
      ? "site-nav--scrolled"
      : "site-nav--at-hero";

  return (
    <>
      <header
        suppressHydrationWarning
        className={`site-nav fixed inset-x-0 top-0 overflow-visible border-b pt-[var(--hero-gutter)] ${open ? "z-[560]" : "z-[500]"} ${navTone}`}
      >
        <div className="mx-auto grid h-[var(--site-nav-height)] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 overflow-visible px-4 sm:px-[var(--hero-gutter)] md:gap-6 md:px-8 lg:px-10">
          <Link
            href="/#top"
            className="site-nav-logo flex shrink-0 items-center overflow-visible transition-opacity duration-300 hover:opacity-90"
            aria-label="OD Studio home"
            onClick={() => open && close()}
          >
            <Image
              src={brandLogo}
              alt="OD Studio"
              height={72}
              width={288}
              className={`site-nav-logo__img h-11 w-auto max-w-[min(240px,calc(100vw-7rem))] origin-left scale-[1.62] md:scale-[1.72] lg:scale-[1.82] ${invertLogo ? "site-nav-logo__img--inverted" : ""} ${heroLogoGlow ? "site-nav-logo__img--hero-glow" : ""}`}
              priority
              sizes="(max-width: 1024px) 200px, 280px"
            />
          </Link>

          <nav
            className="hidden min-w-0 items-center justify-center gap-5 lg:flex xl:gap-8"
            aria-label="Primary"
          >
            {mainLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`site-nav-link whitespace-nowrap ${linkActive(link.href) ? "site-nav-link--active" : ""}`}
                aria-current={linkActive(link.href) ? "page" : undefined}
                onClick={(e) => handleMenuNavigate(e, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              data-no-glow
              suppressHydrationWarning
              className={`site-nav-menu-btn lg:hidden ${open ? "site-nav-menu-btn--open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu-overlay"
              onClick={toggle}
            >
              <MenuToggleIcon />
              <span className="site-nav-menu-btn__label">{open ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-layer"
            id="site-menu-overlay"
            className="site-menu-overlay nav-menu-layer pointer-events-auto fixed inset-0 z-[530] flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: layerOpen }}
            exit={{ opacity: 0, transition: layerClose }}
          >
            <button
              type="button"
              className="site-menu-overlay__backdrop min-h-0 min-w-0 flex-1"
              aria-label="Close menu"
              onClick={close}
            />
            <motion.nav
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="site-menu-panel relative z-10 h-full shrink-0"
              variants={reduceMotion ? undefined : menuPanelVariants}
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? false : "show"}
              exit={reduceMotion ? undefined : "exit"}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="site-menu-panel__head pt-5">
                <p className="site-menu-panel__eyebrow">Navigation</p>
              </div>

              {reduceMotion ? (
                <ul className="site-menu-list">
                  {mainLinks.map((link, index) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className={`site-menu-item group ${linkActive(link.href) ? "site-menu-item--active" : ""}`}
                        aria-current={linkActive(link.href) ? "page" : undefined}
                        onClick={(e) => handleMenuNavigate(e, link.href)}
                      >
                        <span className="site-menu-item__index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="site-menu-item__label">{link.label}</span>
                        <ArrowUpRight className="site-menu-item__arrow h-5 w-5 stroke-[1.5]" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <motion.ul className="site-menu-list" variants={menuListContainer} initial="hidden" animate="show">
                  {mainLinks.map((link, index) => (
                    <motion.li key={link.href + link.label} variants={menuListItem}>
                      <Link
                        href={link.href}
                        className={`site-menu-item group ${linkActive(link.href) ? "site-menu-item--active" : ""}`}
                        aria-current={linkActive(link.href) ? "page" : undefined}
                        onClick={(e) => handleMenuNavigate(e, link.href)}
                      >
                        <span className="site-menu-item__index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="site-menu-item__label">{link.label}</span>
                        <ArrowUpRight className="site-menu-item__arrow h-5 w-5 stroke-[1.5]" aria-hidden />
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              <motion.div
                className="site-menu-footer"
                variants={menuFooterVariants}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? false : "show"}
              >
                <ul className="site-menu-footer__links">
                  {secondaryLinks.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className={`site-menu-footer__link ${linkActive(link.href) ? "site-menu-footer__link--active" : ""}`}
                        aria-current={linkActive(link.href) ? "page" : undefined}
                        onClick={(e) => handleMenuNavigate(e, link.href)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="site-menu-footer__meta">
                  <div className="site-menu-footer__social">
                    {socialLinks.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        onClick={close}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden />
                      </a>
                    ))}
                  </div>
                  <p className="site-menu-footer__copy">© 2026 OD Studio</p>
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
