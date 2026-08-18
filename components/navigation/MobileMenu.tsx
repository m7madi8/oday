"use client";

import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { NavPanelConfig, NavPanelId } from "@/lib/content/site-navigation";
import { ChevronDown, Facebook, Instagram, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const loadEase = [0.22, 1, 0.36, 1] as const;
const softOut = [0.33, 1, 0.68, 1] as const;

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
] as const;

const menuListContainer = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};

const menuListItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: softOut } },
};

const menuFooterVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: loadEase, delay: 0.22 } },
};

const menuPanelVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.28, ease: loadEase } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: loadEase } },
};

type MobileMenuProps = {
  open: boolean;
  panels: NavPanelConfig[];
  expanded: NavPanelId | null;
  onToggleExpand: (id: NavPanelId) => void;
  onNavigate: () => void;
  onClose: () => void;
  onOpenSearch: () => void;
};

export function MobileMenu({
  open,
  panels,
  expanded,
  onToggleExpand,
  onNavigate,
  onClose,
  onOpenSearch,
}: MobileMenuProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLElement | null>(null);
  useFocusTrap(panelRef, open);

  const layerOpen = reduceMotion ? { duration: 0 } : { duration: 0.32, ease: loadEase };
  const layerClose = reduceMotion ? { duration: 0 } : { duration: 0.22, ease: loadEase };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu-layer"
          id="site-menu-overlay"
          className="site-menu-overlay nav-menu-layer pointer-events-auto fixed inset-0 z-[530] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: layerOpen }}
          exit={{ opacity: 0, transition: layerClose }}
        >
          <motion.nav
            ref={panelRef}
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

            {/* Search is a primary path, so it has to exist without a hover-capable pointer. */}
            <button
              type="button"
              data-no-glow
              className="site-menu-search"
              onClick={onOpenSearch}
              aria-label="Search"
            >
              <Search className="site-menu-search__icon" strokeWidth={1.5} aria-hidden />
              <span className="site-menu-search__label">Search</span>
            </button>

            <motion.ul
              className="site-menu-list"
              variants={reduceMotion ? undefined : menuListContainer}
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? false : "show"}
            >
              {panels.map((panel, index) => {
                const hasPanel = panel.variant !== "none";
                const isExpanded = expanded === panel.id;
                const indexLabel = String(index + 1).padStart(2, "0");

                if (!hasPanel) {
                  return (
                    <motion.li key={panel.id} variants={menuListItem}>
                      <Link
                        href={panel.href}
                        className="site-menu-item group w-full text-left"
                        onClick={onNavigate}
                      >
                        <span className="site-menu-item__index">{indexLabel}</span>
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
                      className={`site-menu-item group w-full text-left ${
                        isExpanded ? "site-menu-item--active" : ""
                      }`}
                      aria-expanded={isExpanded}
                      onClick={() => onToggleExpand(panel.id)}
                    >
                      <span className="site-menu-item__index">{indexLabel}</span>
                      <span className="site-menu-item__label">{panel.label}</span>
                      <ChevronDown
                        className={`site-menu-item__arrow h-5 w-5 stroke-[1.5] transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        aria-hidden
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.38, ease: loadEase }}
                          className="overflow-hidden"
                        >
                          {panel.variant === "portrait" && panel.portrait ? (
                            <Link href={panel.href} className="site-menu-portrait" onClick={onNavigate}>
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
                                <span className="site-menu-portrait__name">{panel.portrait.name}</span>
                                <span className="site-menu-portrait__role">{panel.portrait.role}</span>
                                <span className="site-menu-portrait__body">
                                  {panel.portrait.description}
                                </span>
                              </span>
                            </Link>
                          ) : (
                            <ul className="site-menu-sublist">
                              <li>
                                <Link href={panel.href} className="site-menu-subitem" onClick={onNavigate}>
                                  Overview
                                </Link>
                              </li>
                              {panel.items.map((item) => (
                                <li key={item.id}>
                                  <Link
                                    href={item.href}
                                    className="site-menu-subitem"
                                    onClick={onNavigate}
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
                      onClick={onClose}
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
  );
}
