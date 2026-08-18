"use client";

import { useFocusTrap } from "@/hooks/useFocusTrap";
import { searchExploreTerms, type SearchEntry } from "@/lib/content/site-navigation";
import { buildSearchIndex, filterSearchIndex } from "@/lib/content/search-index";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ease = [0.22, 1, 0.36, 1] as const;

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const GROUPS: SearchEntry["group"][] = ["Projects", "Services", "Sections"];

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const index = useMemo(() => buildSearchIndex(), []);
  const results = useMemo(() => filterSearchIndex(query, index), [query, index]);

  // Focus stays in the dialog; Escape is owned by Navigation so there is one handler.
  useFocusTrap(panelRef, open, { autoFocus: false });

  useEffect(() => {
    if (!open) {
      setQuery("");
      setCursor(0);
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  const grouped = useMemo(
    () =>
      GROUPS.map((group) => ({
        group,
        items: results.filter((r) => r.group === group),
      })).filter((g) => g.items.length > 0),
    [results],
  );

  /** Flat order matches render order, so Up/Down feel like one list across groups. */
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);
  const activeId = flat[cursor]?.id;

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (flat.length === 0) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const step = e.key === "ArrowDown" ? 1 : -1;
        setCursor((c) => (c + step + flat.length) % flat.length);
        return;
      }
      if (e.key === "Enter") {
        const target = flat[cursor];
        if (!target) return;
        e.preventDefault();
        onClose();
        if (target.href.startsWith("http")) window.open(target.href, "_blank", "noopener");
        else router.push(target.href);
      }
    },
    [cursor, flat, onClose, router],
  );

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
            ref={panelRef}
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
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-controls={listId}
                aria-activedescendant={activeId ? `search-result-${activeId}` : undefined}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
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

            <div className="nav-search__body" id={listId}>
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
                  <p className="sr-only" role="status">
                    {flat.length} {flat.length === 1 ? "result" : "results"}
                  </p>
                  {grouped.map(({ group, items }) => (
                    <section key={group} className="nav-search__group" aria-label={group}>
                      <p className="nav-search__section-label">{group}</p>
                      <ul className="nav-search__results">
                        {items.map((item) => (
                          <li key={item.id}>
                            <Link
                              id={`search-result-${item.id}`}
                              href={item.href}
                              className={`nav-search__result ${
                                item.id === activeId ? "nav-search__result--cursor" : ""
                              }`}
                              onMouseEnter={() =>
                                setCursor(flat.findIndex((f) => f.id === item.id))
                              }
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
