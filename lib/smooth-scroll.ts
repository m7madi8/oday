const MIN_DURATION_MS = 1_100;
const MAX_DURATION_MS = 2_400;

export const SECTION_SCROLL_START = "od-section-scroll-start";
export const SECTION_SCROLL_END = "od-section-scroll-end";

/** Matches site cinematic easing — soft deceleration at the end */
const easeCinematic = createCubicBezier(0.16, 1, 0.3, 1);

let activeFrame: number | null = null;
let scrolling = false;
let activeTargetId: string | null = null;

function createCubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (progress: number): number => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;

    let t = progress;
    for (let i = 0; i < 10; i++) {
      const x = sampleX(t) - progress;
      if (Math.abs(x) < 1e-7) break;
      const d = sampleDerivX(t);
      if (Math.abs(d) < 1e-7) break;
      t -= x / d;
    }
    return sampleY(t);
  };
}

function getScrollOffset(): number {
  const paddingTop = getComputedStyle(document.documentElement).scrollPaddingTop;
  const parsed = Number.parseFloat(paddingTop);
  return Number.isFinite(parsed) ? parsed : 0;
}

function durationForDistance(distance: number): number {
  const scaled = Math.sqrt(Math.abs(distance)) * 42;
  return Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, scaled));
}

function clearScrollTargetMarkers(): void {
  document.querySelectorAll(".is-scroll-target").forEach((el) => {
    el.classList.remove("is-scroll-target");
  });
}

function markScrollTarget(target: HTMLElement): void {
  clearScrollTargetMarkers();
  target.classList.add("is-scroll-target");
  activeTargetId = target.id || null;
}

function setScrollShellActive(active: boolean): void {
  const html = document.documentElement;
  if (active) {
    html.classList.add("section-scroll-active");
  } else {
    html.classList.remove("section-scroll-active");
  }
}

function dispatchScrollEvent(name: string, detail?: { id: string | null }): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function isSmoothScrolling(): boolean {
  return scrolling;
}

export function smoothScrollToElement(
  target: HTMLElement,
  options?: { reduceMotion?: boolean; duration?: number; delay?: number },
): void {
  const { reduceMotion = false, delay = 0 } = options ?? {};

  const run = () => {
    const offset = getScrollOffset();
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

    if (activeFrame !== null) {
      cancelAnimationFrame(activeFrame);
      activeFrame = null;
    }

    if (reduceMotion) {
      clearScrollTargetMarkers();
      markScrollTarget(target);
      window.scrollTo({ top, behavior: "auto" });
      setScrollShellActive(false);
      scrolling = false;
      dispatchScrollEvent(SECTION_SCROLL_END, { id: activeTargetId });
      return;
    }

    const startY = window.scrollY;
    const distance = top - startY;
    if (Math.abs(distance) < 2) {
      markScrollTarget(target);
      return;
    }

    const duration = options?.duration ?? durationForDistance(distance);

    markScrollTarget(target);
    setScrollShellActive(true);
    scrolling = true;
    dispatchScrollEvent(SECTION_SCROLL_START, { id: activeTargetId });

    const startTime = performance.now();

    function finish() {
      activeFrame = null;
      scrolling = false;
      setScrollShellActive(false);
      dispatchScrollEvent(SECTION_SCROLL_END, { id: activeTargetId });
    }

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeCinematic(progress));

      if (progress < 1) {
        activeFrame = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, top);
        finish();
      }
    }

    activeFrame = requestAnimationFrame(step);
  };

  if (delay > 0) {
    window.setTimeout(run, delay);
  } else {
    run();
  }
}

export function smoothScrollToId(
  id: string,
  options?: { reduceMotion?: boolean; duration?: number; delay?: number },
): boolean {
  const target = document.getElementById(id);
  if (!target) return false;
  smoothScrollToElement(target, options);
  return true;
}
