"use client";

import type { NavPanelConfig, NavVisualItem } from "@/lib/content/site-navigation";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
const soft = [0.33, 1, 0.68, 1] as const;

type NavMegaPanelProps = {
  /** Owned by the header so triggers can point `aria-controls` at this panel. */
  id: string;
  panel: NavPanelConfig;
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function externalProps(href: string) {
  return href.startsWith("http")
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
}

function NavMegaClip({
  item,
  reduceMotion,
}: {
  item: NavVisualItem;
  reduceMotion: boolean | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startAt = item.videoStartAt ?? 0;
  const duration = item.videoDuration ?? 5;
  const useVideo = Boolean(item.videoSrc) && !reduceMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !useVideo) return;

    let cancelled = false;

    const syncWindow = () => {
      if (cancelled) return;
      if (video.currentTime < startAt || video.currentTime >= startAt + duration) {
        video.currentTime = startAt;
      }
    };

    const playClip = async () => {
      try {
        video.currentTime = startAt;
        await video.play();
      } catch {
        // Autoplay may be blocked; poster image remains visible.
      }
    };

    const onLoaded = () => {
      syncWindow();
      void playClip();
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", syncWindow);
    if (video.readyState >= 1) onLoaded();

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", syncWindow);
      video.pause();
    };
  }, [useVideo, item.videoSrc, startAt, duration]);

  return (
    <div className={`nav-mega__media${item.objectFit === "contain" ? " nav-mega__media--contain" : ""}`}>
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        className={`nav-mega__media-img ${
          item.objectFit === "contain" ? "object-contain nav-mega__media-img--contain" : "object-cover"
        } ${useVideo ? "nav-mega__media-img--under-video" : ""}`}
        sizes="(max-width: 1024px) 100vw, 52vw"
        style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
        priority={false}
      />
      {useVideo && item.videoSrc ? (
        <video
          ref={videoRef}
          className="nav-mega__video"
          src={item.videoSrc}
          muted
          playsInline
          preload="metadata"
          aria-label={item.imageAlt}
        />
      ) : null}
    </div>
  );
}

function MegaRail({
  items,
  label,
  activeId,
  setActiveId,
  onNavigate,
  onClose,
  reduceMotion,
  lockStageVisual,
}: {
  items: NavVisualItem[];
  label: string;
  activeId: string;
  setActiveId: (id: string) => void;
  onNavigate: () => void;
  onClose: () => void;
  reduceMotion: boolean | null;
  lockStageVisual?: boolean;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const active = items.find((item) => item.id === activeId) ?? items[0];

  /** Up/Down walk the rail; Escape is handled once, by the header. */
  const onRailKeyDown = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;

    const links = Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (links.length === 0 || current === -1) return;

    e.preventDefault();
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? links.length - 1
          : (current + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
    links[next].focus();
  };

  if (!active) return null;

  return (
    <div className="nav-mega__inner">
      <div className="nav-mega__rail">
        <p className="nav-mega__eyebrow">{label}</p>
        <ul className="nav-mega__list" role="list" ref={listRef} onKeyDown={onRailKeyDown}>
          {items.map((item, index) => {
            const isActive = item.id === active.id;
            return (
              <motion.li
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.38,
                  delay: reduceMotion ? 0 : 0.04 + index * 0.035,
                  ease: soft,
                }}
              >
                <Link
                  href={item.href}
                  className={`nav-mega__link ${isActive ? "nav-mega__link--active" : ""}`}
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  onClick={() => {
                    onNavigate();
                    onClose();
                  }}
                  {...externalProps(item.href)}
                >
                  <span className="nav-mega__thumb" aria-hidden>
                    <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
                  </span>
                  <span className="nav-mega__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="nav-mega__label">{item.label}</span>
                  <ArrowUpRight
                    className="nav-mega__arrow"
                    strokeWidth={1.4}
                    aria-hidden
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <div className="nav-mega__stage">
        <div className="nav-mega__visual">
          <NavMegaClip
            item={lockStageVisual ? items[0] : active}
            reduceMotion={reduceMotion}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              className="nav-mega__caption"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease }}
            >
              {active.eyebrow ? (
                <p className="nav-mega__caption-eyebrow">{active.eyebrow}</p>
              ) : null}
              <p className="nav-mega__caption-title">{active.label}</p>
              <p className="nav-mega__caption-copy">{active.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PortraitRail({
  panel,
  onNavigate,
  onClose,
  reduceMotion,
}: {
  panel: NavPanelConfig;
  onNavigate: () => void;
  onClose: () => void;
  reduceMotion: boolean | null;
}) {
  const portrait = panel.portrait;
  if (!portrait) return null;

  return (
    <div className="nav-mega__inner nav-mega__inner--portrait">
      <motion.div
        className="nav-mega__portrait-media"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
      >
        <Image
          src={portrait.image}
          alt={portrait.imageAlt}
          fill
          className="nav-mega__portrait-img"
          sizes="(max-width: 1024px) 100vw, 38vw"
          priority
        />
      </motion.div>

      <motion.div
        className="nav-mega__portrait-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.1, ease: soft }}
      >
        <p className="nav-mega__eyebrow">About</p>
        <h3 className="nav-mega__portrait-name">{portrait.name}</h3>
        <p className="nav-mega__portrait-role">{portrait.role}</p>
        <p className="nav-mega__portrait-body">{portrait.description}</p>
        <Link
          href={panel.href}
          className="nav-mega__portrait-cta"
          onClick={() => {
            onNavigate();
            onClose();
          }}
        >
          <span>{portrait.ctaLabel}</span>
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} aria-hidden />
        </Link>
      </motion.div>
    </div>
  );
}

export function NavMegaPanel({
  id,
  panel,
  open,
  onClose,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: NavMegaPanelProps) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(panel.items[0]?.id ?? "");

  useEffect(() => {
    if (open && panel.items[0]) setActiveId(panel.items[0].id);
  }, [open, panel.id, panel.items]);

  if (panel.variant === "none") return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="nav-mega-shell"
          id={id}
          role="region"
          aria-label={`${panel.label} menu`}
          className={`nav-mega ${panel.variant === "portrait" ? "nav-mega--portrait" : ""}${
            panel.id === "contact" ? " nav-mega--contact" : ""
          }`}
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={panel.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.36, ease: soft }}
            >
              {panel.variant === "portrait" ? (
                <PortraitRail
                  panel={panel}
                  onNavigate={onNavigate}
                  onClose={onClose}
                  reduceMotion={reduceMotion}
                />
              ) : (
                <MegaRail
                  items={panel.items}
                  label={panel.label}
                  activeId={activeId}
                  setActiveId={setActiveId}
                  onNavigate={onNavigate}
                  onClose={onClose}
                  reduceMotion={reduceMotion}
                  lockStageVisual={panel.lockStageVisual}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
