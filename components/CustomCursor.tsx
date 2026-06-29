"use client";

import { isDesktopFinePointer } from "@/lib/animations";
import { useEffect, useRef, useState } from "react";

const TRAIL_LENGTH = 20;
const IDLE_TIMEOUT = 1000;

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor-hover]";

interface TrailPoint {
  x: number;
  y: number;
}

interface IdleBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

function spawnBubbles(cx: number, cy: number, nextId: number): IdleBubble[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: nextId + i,
    x: cx,
    y: cy,
    size: 8 + Math.random() * 18,
    delay: i * 180,
  }));
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [idle, setIdle] = useState(false);
  const [bubbles, setBubbles] = useState<IdleBubble[]>([]);

  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<(HTMLSpanElement | null)[]>([]);
  const posRef = useRef({ x: -100, y: -100 });
  const trailPosRef = useRef<TrailPoint[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })),
  );
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const bubbleIdRef = useRef(0);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    function updateEnabled() {
      const on =
        isDesktopFinePointer() &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(on);
      document.documentElement.classList.toggle("custom-cursor-active", on);
    }

    updateEnabled();
    window.addEventListener("resize", updateEnabled);
    return () => {
      window.removeEventListener("resize", updateEnabled);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function resetIdle() {
      setIdle(false);
      setBubbles([]);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        const { x, y } = posRef.current;
        const startId = bubbleIdRef.current;
        bubbleIdRef.current += 6;
        setIdle(true);
        setBubbles(spawnBubbles(x, y, startId));
      }, IDLE_TIMEOUT);
    }

    function applyTrail() {
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        const prev = trailPosRef.current[i - 1];
        const curr = trailPosRef.current[i];
        curr.x += (prev.x - curr.x) * 0.35;
        curr.y += (prev.y - curr.y) * 0.35;
      }

      trailPosRef.current[0].x += (posRef.current.x - trailPosRef.current[0].x) * 0.5;
      trailPosRef.current[0].y += (posRef.current.y - trailPosRef.current[0].y) * 0.5;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      trailRef.current.forEach((el, i) => {
        if (!el) return;
        const point = trailPosRef.current[i];
        const progress = 1 - i / TRAIL_LENGTH;
        const size = 3 + progress * (hoveringRef.current ? 9 : 7);
        el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
        el.style.opacity = `${progress * (hoveringRef.current ? 0.72 : 0.58)}`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
      });
    }

    function animate() {
      if (visibleRef.current) applyTrail();
      rafRef.current = requestAnimationFrame(animate);
    }

    function move(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      let nextHover = false;
      if (e.target instanceof Element) {
        nextHover = !!e.target.closest(INTERACTIVE);
      }
      if (nextHover !== hoveringRef.current) {
        hoveringRef.current = nextHover;
        setHovering(nextHover);
      }

      resetIdle();
    }

    function onLeave() {
      visibleRef.current = false;
      setVisible(false);
      setIdle(false);
      setBubbles([]);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    }

    function onEnter() {
      visibleRef.current = true;
      setVisible(true);
      resetIdle();
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden
        className={`custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          className={`custom-cursor__dot block -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,box-shadow] duration-150 ease-out ${
            hovering ? "custom-cursor__dot--hover" : ""
          }`}
        />
      </div>

      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            trailRef.current[i] = el;
          }}
          aria-hidden
          className={`custom-cursor__trail pointer-events-none fixed left-0 top-0 z-[9998] ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {idle
        ? bubbles.map((bubble) => (
            <span
              key={bubble.id}
              aria-hidden
              className="custom-cursor__bubble pointer-events-none fixed z-[9997]"
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                animationDelay: `${bubble.delay}ms`,
              }}
            />
          ))
        : null}
    </>
  );
}
