"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "@/components/ClientMotion";
import { isDesktopFinePointer } from "@/lib/animations";
import { useCallback, useEffect, useRef, useState } from "react";

const IDLE_MS = 3000;
const MOVE_FADE_MS = 320;

const TRAIL_LAYERS = [
  { stiffness: 210, damping: 30, mass: 0.4, size: 20, opacity: 0.4, soft: false },
  { stiffness: 165, damping: 32, mass: 0.46, size: 17, opacity: 0.32, soft: false },
  { stiffness: 120, damping: 34, mass: 0.52, size: 14, opacity: 0.24, soft: false },
  { stiffness: 88, damping: 36, mass: 0.58, size: 11, opacity: 0.17, soft: true },
  { stiffness: 62, damping: 38, mass: 0.64, size: 9, opacity: 0.11, soft: true },
  { stiffness: 42, damping: 40, mass: 0.7, size: 7, opacity: 0.07, soft: true },
] as const;

const TRAIL_GLOW_SPRING = { stiffness: 55, damping: 36, mass: 0.9 };

function TrailDot({
  x,
  y,
  config,
  visible,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  config: (typeof TRAIL_LAYERS)[number];
  visible: boolean;
}) {
  const sx = useSpring(x, {
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
  });
  const sy = useSpring(y, {
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
  });

  return (
    <motion.span
      aria-hidden
      className={`custom-cursor__trail absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full ${
        config.soft ? "custom-cursor__trail--soft bg-gold/45" : "custom-cursor__trail--solid bg-gold/75"
      }`}
      style={{
        x: sx,
        y: sy,
        width: config.size,
        height: config.size,
      }}
      animate={{
        opacity: visible ? config.opacity : 0,
        scale: visible ? 1 : 0.5,
      }}
      transition={{ duration: visible ? 0.28 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

function TrailGlow({
  x,
  y,
  visible,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
}) {
  const sx = useSpring(x, TRAIL_GLOW_SPRING);
  const sy = useSpring(y, TRAIL_GLOW_SPRING);

  return (
    <motion.span
      aria-hidden
      className="custom-cursor__trail-glow absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 block h-11 w-11 rounded-full"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 0.28 : 0, scale: visible ? 1 : 0.75 }}
      transition={{ duration: visible ? 0.25 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.38 });
  const sy = useSpring(y, { stiffness: 380, damping: 30, mass: 0.38 });

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const scheduleIdle = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => setIsIdle(true), IDLE_MS);
  }, [clearIdleTimer]);

  const bumpActivity = useCallback(() => {
    setIsIdle(false);
    setIsMoving(true);
    scheduleIdle();

    if (moveFadeRef.current) clearTimeout(moveFadeRef.current);
    moveFadeRef.current = setTimeout(() => setIsMoving(false), MOVE_FADE_MS);
  }, [scheduleIdle]);

  useEffect(() => {
    function updateEnabled() {
      const on = isDesktopFinePointer() && !reduceMotion;
      setEnabled(on);
      document.documentElement.classList.toggle("custom-cursor-active", on);
    }

    updateEnabled();
    window.addEventListener("resize", updateEnabled);
    return () => {
      window.removeEventListener("resize", updateEnabled);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;

    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      bumpActivity();
    }

    function onScroll() {
      bumpActivity();
    }

    function onDown() {
      bumpActivity();
    }

    function onKey() {
      bumpActivity();
    }

    function onTouch() {
      bumpActivity();
    }

    function onLeave() {
      setVisible(false);
      setIsIdle(false);
      clearIdleTimer();
    }

    function onEnter() {
      setVisible(true);
      scheduleIdle();
    }

    function onOver(e: MouseEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor-hover]",
      );
      setIsHovering(!!interactive);
    }

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouch, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);

    scheduleIdle();

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouch);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      clearIdleTimer();
      if (moveFadeRef.current) clearTimeout(moveFadeRef.current);
    };
  }, [
    enabled,
    x,
    y,
    visible,
    bumpActivity,
    scheduleIdle,
    clearIdleTimer,
  ]);

  if (!enabled) return null;

  const showTrail = isMoving && !isIdle;

  return (
    <div
      aria-hidden
      className={`custom-cursor pointer-events-none fixed inset-0 z-[700] ${visible ? "" : "opacity-0"}`}
    >
      <TrailGlow x={x} y={y} visible={showTrail} />
      {TRAIL_LAYERS.map((layer, i) => (
        <TrailDot key={i} x={x} y={y} config={layer} visible={showTrail} />
      ))}

      {/* Motion halo while moving */}
      <motion.div
        className="custom-cursor__move-halo absolute left-0 top-0"
        style={{ x: sx, y: sy }}
        animate={{
          opacity: showTrail ? 0.38 : 0,
          scale: showTrail ? [1, 1.1, 1] : 0.9,
        }}
        transition={
          showTrail
            ? { opacity: { duration: 0.25 }, scale: { duration: 1.4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] } }
            : { duration: 0.45 }
        }
      >
        <span className="block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20 bg-gold/8 shadow-[0_0_18px_rgba(245, 197, 24,0.18)]" />
      </motion.div>

      {/* Idle aura — soft orbit + breathe */}
      <motion.div
        className="custom-cursor__idle-ring absolute left-0 top-0"
        style={{ x: sx, y: sy }}
        animate={
          isIdle
            ? {
                opacity: 1,
                scale: [1, 1.12, 1],
                rotate: [0, 180, 360],
              }
            : { opacity: 0, scale: 0.85, rotate: 0 }
        }
        transition={
          isIdle
            ? {
                opacity: { duration: 0.5 },
                scale: { duration: 3.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] },
                rotate: { duration: 14, repeat: Infinity, ease: "linear" },
              }
            : { duration: 0.4 }
        }
      >
        <span className="custom-cursor__ring-outer block h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25" />
      </motion.div>

      <motion.div
        className="custom-cursor__idle-glow absolute left-0 top-0"
        style={{ x: sx, y: sy }}
        animate={
          isIdle
            ? {
                opacity: [0.35, 0.65, 0.35],
                scale: [1.4, 1.85, 1.4],
              }
            : { opacity: 0, scale: 1 }
        }
        transition={
          isIdle
            ? { duration: 2.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
            : { duration: 0.35 }
        }
      >
        <span className="block h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245, 197, 24,0.35)_0%,transparent_70%)] blur-md" />
      </motion.div>

      {/* Orbit specks when idle */}
      <motion.div
        className="custom-cursor__orbit absolute left-0 top-0"
        style={{ x: sx, y: sy }}
        animate={isIdle ? { opacity: 1, rotate: 360 } : { opacity: 0, rotate: 0 }}
        transition={
          isIdle
            ? {
                opacity: { duration: 0.45 },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              }
            : { duration: 0.35 }
        }
      >
        {[0, 120, 240].map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 block h-1 w-1 rounded-full bg-gold/75 shadow-[0_0_6px_rgba(245, 197, 24,0.6)]"
            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(22px)` }}
          />
        ))}
      </motion.div>

      {/* Main pointer */}
      <motion.div
        className="custom-cursor__core absolute left-0 top-0"
        style={{ x: sx, y: sy }}
        animate={{
          scale: isHovering ? 1.55 : isIdle ? [1, 1.1, 1] : isMoving ? 1.08 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={
          isIdle && !isHovering
            ? {
                scale: { duration: 2.4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] },
                opacity: { duration: 0.2 },
              }
            : { type: "spring", stiffness: 380, damping: 28 }
        }
      >
        <span
          className={`custom-cursor__dot block -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 bg-gold/90 shadow-[0_0_18px_rgba(245, 197, 24,0.45)] ${
            isHovering ? "h-3.5 w-3.5" : "h-3 w-3"
          }`}
        />
        {isMoving && !isIdle ? (
          <motion.span
            key="ripple"
            className="custom-cursor__ripple absolute left-1/2 top-1/2 block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25 bg-gold/5"
            initial={{ opacity: 0.45, scale: 0.75 }}
            animate={{ opacity: 0, scale: 1.75 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
