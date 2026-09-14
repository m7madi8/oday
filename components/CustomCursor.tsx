"use client";

import { useGSAP, type GsapLike } from "@/hooks/useGSAP";
import {
  cursorDefaults,
  isDesktopFinePointer,
  magneticDelta,
  prefersReducedMotion,
} from "@/lib/animations";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const INTERACTIVE =
  "a, button, [role='button'], [type='button'], [type='submit'], label, summary, [data-cursor-hover]";

const NATIVE_TEXT =
  "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']):not([type='file']):not([type='color']), textarea, [contenteditable='true']";

const MEDIA =
  "[data-cursor-label], [data-cursor-media], .project-card a, .feat-card a, .feat-hero a, .xgl__stage-link";

const MAGNETIC = "[data-cursor-magnetic]";

const DEFAULT_MEDIA_LABEL = "VIEW";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [media, setMedia] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [native, setNative] = useState(false);
  const [tweened, setTweened] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const gsapRef = useRef<GsapLike | null>(null);

  const hoveringRef = useRef(false);
  const mediaRef = useRef(false);
  const pressedRef = useRef(false);
  const visibleRef = useRef(false);
  const nativeRef = useRef(false);
  const reduceRef = useRef(false);
  const applyMorphRef = useRef<() => void>(() => {});

  useEffect(() => {
    function updateEnabled() {
      setEnabled(isDesktopFinePointer());
    }

    updateEnabled();
    window.addEventListener("resize", updateEnabled);
    return () => {
      window.removeEventListener("resize", updateEnabled);
      document.documentElement.classList.remove("custom-cursor-projects");
    };
  }, []);

  useGSAP(
    ({ gsap }) => {
      gsapRef.current = gsap;
      setTweened(true);
    },
    { once: true, enabled },
  );

  useEffect(() => {
    if (!enabled) return;

    const pointer = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const magnet = { x: 0, y: 0 };
    const magnetTarget = { x: 0, y: 0 };
    let seeded = false;
    let raf = 0;
    let lastPressed = false;

    function place(x: number, y: number) {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }

    function damping() {
      return reduceRef.current ? 1 : cursorDefaults.followDamping;
    }

    function applyMorph() {
      const gsap = gsapRef.current;
      const core = coreRef.current;
      const ring = ringRef.current;
      const label = labelRef.current;
      if (!core || !ring || !label) return;

      const isMedia = mediaRef.current;
      const isHover = hoveringRef.current;
      const isPressed = pressedRef.current;
      const reduce = reduceRef.current;
      const baseScale = isMedia ? 1 : isHover ? cursorDefaults.hoverScale : 1;
      const scale = isPressed ? baseScale * cursorDefaults.clickScale : baseScale;
      const releasing = lastPressed && !isPressed;
      lastPressed = isPressed;
      const duration = reduce
        ? 0
        : isPressed
          ? cursorDefaults.clickDuration
          : releasing
            ? cursorDefaults.clickReleaseDuration
            : cursorDefaults.hoverDuration;
      const ease = isPressed ? "power2.in" : cursorDefaults.hoverEase;

      if (!gsap) {
        core.style.transform = `scale(${scale})`;
        ring.style.opacity = isMedia ? "0.92" : "0";
        ring.style.transform = `translate(-50%, -50%) scale(${isMedia ? 1 : 0.42})`;
        label.style.opacity = isMedia ? "1" : "0";
        label.style.transform = `translate(-50%, -50%) scale(${isMedia ? 1 : 0.82})`;
        return;
      }

      gsap.to(core, {
        scale,
        duration,
        ease,
        transformOrigin: "50% 50%",
        overwrite: "auto",
      });
      gsap.to(ring, {
        opacity: isMedia ? 0.92 : 0,
        scale: isMedia ? 1 : 0.42,
        xPercent: -50,
        yPercent: -50,
        duration: reduce ? 0 : isMedia ? 0.4 : 0.28,
        ease: isMedia ? cursorDefaults.hoverEase : "power2.in",
        overwrite: "auto",
      });
      gsap.to(label, {
        opacity: isMedia ? 1 : 0,
        scale: isMedia ? 1 : 0.82,
        xPercent: -50,
        yPercent: -50,
        duration: reduce ? 0 : isMedia ? 0.38 : 0.2,
        ease: isMedia ? cursorDefaults.hoverEase : "power2.in",
        overwrite: "auto",
      });
    }

    function setLabel(next: string) {
      if (labelRef.current && labelRef.current.textContent !== next) {
        labelRef.current.textContent = next;
      }
    }

    function readMagnetic(el: Element | null, x: number, y: number) {
      if (reduceRef.current) {
        magnetTarget.x = 0;
        magnetTarget.y = 0;
        return;
      }

      const host = el?.closest(MAGNETIC);
      if (!(host instanceof HTMLElement)) {
        magnetTarget.x = 0;
        magnetTarget.y = 0;
        return;
      }

      const rect = host.getBoundingClientRect();
      const pull = magneticDelta(x, y, rect, cursorDefaults.cursorMagnetStrength);
      magnetTarget.x = -pull.x;
      magnetTarget.y = -pull.y;
    }

    function readTarget(el: EventTarget | null, x: number, y: number) {
      let nextHover = false;
      let nextNative = false;
      let nextMedia = false;
      let nextLabel = "";

      if (el instanceof Element) {
        nextNative = !!el.closest(NATIVE_TEXT);
        nextHover = !nextNative && !!(el.closest(INTERACTIVE) || el.closest(MAGNETIC));
        const labeled = nextNative ? null : el.closest("[data-cursor-label]");
        const mediaHost = nextNative ? null : el.closest(MEDIA);
        nextMedia = !!(labeled || mediaHost);
        nextLabel =
          (labeled instanceof HTMLElement && labeled.dataset.cursorLabel) ||
          (nextMedia ? DEFAULT_MEDIA_LABEL : "");
      }

      let morph = false;
      if (nextHover !== hoveringRef.current) {
        hoveringRef.current = nextHover;
        setHovering(nextHover);
        morph = true;
      }
      if (nextMedia !== mediaRef.current) {
        mediaRef.current = nextMedia;
        setMedia(nextMedia);
        morph = true;
      }
      if (nextNative !== nativeRef.current) {
        nativeRef.current = nextNative;
        setNative(nextNative);
        morph = true;
      }

      if (nextMedia) setLabel(nextLabel.toUpperCase());
      readMagnetic(el instanceof Element ? el : null, x, y);
      if (morph) applyMorph();
    }

    applyMorphRef.current = applyMorph;

    function tick() {
      raf = 0;
      const damp = damping();
      magnet.x += (magnetTarget.x - magnet.x) * damp;
      magnet.y += (magnetTarget.y - magnet.y) * damp;

      const tx = pointer.x + magnet.x;
      const ty = pointer.y + magnet.y;
      pos.x += (tx - pos.x) * damp;
      pos.y += (ty - pos.y) * damp;
      place(pos.x, pos.y);

      const still =
        Math.abs(tx - pos.x) < 0.04 &&
        Math.abs(ty - pos.y) < 0.04 &&
        Math.abs(magnetTarget.x - magnet.x) < 0.04 &&
        Math.abs(magnetTarget.y - magnet.y) < 0.04;

      if (!still && visibleRef.current) {
        raf = window.requestAnimationFrame(tick);
      }
    }

    function startLoop() {
      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    function move(e: MouseEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      if (!seeded) {
        pos.x = pointer.x;
        pos.y = pointer.y;
        seeded = true;
        place(pos.x, pos.y);
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      readTarget(e.target, e.clientX, e.clientY);
      startLoop();
    }

    function onLeave() {
      visibleRef.current = false;
      setVisible(false);
      setHovering(false);
      setMedia(false);
      setNative(false);
      setPressed(false);
      hoveringRef.current = false;
      mediaRef.current = false;
      nativeRef.current = false;
      pressedRef.current = false;
      magnetTarget.x = 0;
      magnetTarget.y = 0;
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
      applyMorph();
    }

    function onEnter(e: MouseEvent) {
      visibleRef.current = true;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pos.x = e.clientX;
      pos.y = e.clientY;
      seeded = true;
      place(e.clientX, e.clientY);
      setVisible(true);
      readTarget(e.target, e.clientX, e.clientY);
    }

    function onDown(e: PointerEvent) {
      if (e.pointerType !== "mouse" || nativeRef.current || !visibleRef.current) return;
      pressedRef.current = true;
      setPressed(true);
      applyMorph();
    }

    function onUp() {
      if (!pressedRef.current) return;
      pressedRef.current = false;
      setPressed(false);
      applyMorph();
    }

    function syncMotion() {
      reduceRef.current = prefersReducedMotion();
      applyMorph();
    }

    syncMotion();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", syncMotion);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      motionQuery.removeEventListener("change", syncMotion);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("custom-cursor-projects");
      gsapRef.current?.killTweensOf?.(
        [coreRef.current, ringRef.current, labelRef.current].filter(Boolean),
      );
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !tweened) return;
    const gsap = gsapRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!gsap || !ring || !label) return;
    gsap.set(ring, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.42,
      opacity: 0,
      transformOrigin: "50% 50%",
    });
    gsap.set(label, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.82,
      opacity: 0,
      transformOrigin: "50% 50%",
    });
    applyMorphRef.current();
  }, [enabled, tweened]);

  const hideNativeCursor = enabled && visible && !native && media;

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle("custom-cursor-projects", hideNativeCursor);
    body.style.cursor = hideNativeCursor ? "none" : "";
    return () => {
      root.classList.remove("custom-cursor-projects");
      body.style.cursor = "";
    };
  }, [hideNativeCursor]);

  if (!enabled) return null;

  const show = hideNativeCursor;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className={`custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] ${
        show ? "custom-cursor--on" : ""
      } ${hovering ? "custom-cursor--hover" : ""} ${media ? "custom-cursor--media" : ""} ${
        pressed ? "custom-cursor--pressed" : ""
      } ${tweened ? "custom-cursor--tweened" : ""}`}
    >
      <div className="custom-cursor__stage">
        <div ref={coreRef} className="custom-cursor__core">
          <span ref={ringRef} className="custom-cursor__ring" />
          <span ref={labelRef} className="custom-cursor__label" />
        </div>
      </div>
    </div>
  );
}
