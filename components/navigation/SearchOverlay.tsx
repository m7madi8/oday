"use client";

import {
  buildSearchIndex,
  filterSearchIndex,
  searchExploreTerms,
  type SearchEntry,
} from "@/lib/content/site-navigation";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const GROUPS: SearchEntry["group"][] = ["Projects", "Services", "Sections"];

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [query, setQuery] = useState("");
  const index = useMemo(() => buildSearchIndex(), []);
  const results = useMemo(() => filterSearchIndex(query, index), [query, index]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const grouped = GROUPS.map((group) => ({
    group,
    items: results.filter((r) => r.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="nav-search"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease }}
        >
          <button
            type="button"
            className="nav-search__backdrop"
            aria-label="Close search"
            onClick={onClose}
          />

          <motion.div
            className="nav-search__panel"
            initial={reduceMotion ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
          >
            <div className="nav-search__bar">
              <Search className="nav-search__icon" strokeWidth={1.4} aria-hidden />
              <label htmlFor="site-nav-search" className="sr-only" id={titleId}>
                Search projects, services, and sections
              </label>
              <input
                ref={inputRef}
                id="site-nav-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, services, sections…"
                className="nav-search__input"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                data-no-glow
                className="nav-search__close btn-plain"
                aria-label="Close search"
                onClick={onClose}
              >
                <X className="h-5 w-5" strokeWidth={1.4} aria-hidden />
              </button>
            </div>

            <div className="nav-search__body">
              {!query.trim() ? (
                <div className="nav-search__explore">
                  <p className="nav-search__section-label">Explore</p>
                  <div className="nav-search__chips">
                    {searchExploreTerms.map((term) => (
                      <Link
                        key={term.label}
                        href={term.href}
                        className="nav-search__chip"
                        onClick={onClose}
                      >
                        {term.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : grouped.length === 0 ? (
                <p className="nav-search__empty">No matches for “{query.trim()}”.</p>
              ) : (
                <div className="nav-search__groups">
                  {grouped.map(({ group, items }) => (
                    <section key={group} className="nav-search__group" aria-label={group}>
                      <p className="nav-search__section-label">{group}</p>
                      <ul className="nav-search__results">
                        {items.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className="nav-search__result"
                              onClick={onClose}
                            >
                              <span className="nav-search__result-title">{item.title}</span>
                              {item.subtitle ? (
                                <span className="nav-search__result-sub">{item.subtitle}</span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
