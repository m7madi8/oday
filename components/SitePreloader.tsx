"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import brandLogo from "@/imgs/oday-logo.png";
import { clearPreloaderShell, finishPreloaderSession } from "@/lib/preloader";
const MIN_DURATION_MS = 1200;
const MAX_DURATION_MS = 5500;
const EXIT_MS = 720;

const loadEase = [0.22, 1, 0.36, 1] as const;

type PreloaderPhase = "hidden" | "loading" | "exit";

export function SitePreloader() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<PreloaderPhase>("hidden");
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<number[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let finished = false;

    const clearTimers = () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    const complete = () => {
      if (cancelled || finished) return;
      finished = true;
      setProgress(100);
      schedule(() => {
        if (!cancelled) setPhase("exit");
      }, reduceMotion ? 60 : 280);
      schedule(() => {
        if (cancelled) return;
        finishPreloaderSession();
        setPhase("hidden");
      }, (reduceMotion ? 140 : EXIT_MS) + (reduceMotion ? 60 : 280));
    };

    schedule(() => {
      if (!finished) {
        finishPreloaderSession();
        setPhase("hidden");
        finished = true;
      }
    }, MAX_DURATION_MS + EXIT_MS + 600);

    setPhase("loading");
    document.body.classList.add("preloader-active");

    if (reduceMotion) {
      setProgress(100);
      schedule(complete, 400);
      return () => {
        cancelled = true;
        clearTimers();
        clearPreloaderShell();
      };
    }

    const start = performance.now();
    let loadComplete = document.readyState === "complete";

    const onLoad = () => {
      loadComplete = true;
    };
    window.addEventListener("load", onLoad);

    const tick = (now: number) => {
      if (cancelled) return;

      const elapsed = now - start;
      const timeRatio = Math.min(1, elapsed / MIN_DURATION_MS);
      const cap = loadComplete ? 100 : 72;
      const target = Math.min(cap, Math.round(timeRatio * cap));
      setProgress((prev) => (target > prev ? target : prev));

      const canFinish = loadComplete && elapsed >= MIN_DURATION_MS;
      const mustFinish = elapsed >= MAX_DURATION_MS;

      if (canFinish || mustFinish) {
        window.removeEventListener("load", onLoad);
        complete();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      clearTimers();
    };
  }, [reduceMotion]);

  useLayoutEffect(() => {
    setPhase("loading");
    document.documentElement.classList.add("preloader-pending");
    document.body.classList.add("preloader-active");
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className="site-preloader"
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
      aria-label={phase === "loading" ? "Loading OD Studio" : "Entering site"}
    >
      <motion.div
        className="site-preloader__veil"
        animate={
          phase === "exit"
            ? { opacity: 0, scale: 1.02 }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: EXIT_MS / 1000, ease: loadEase }}
      >
        <div className="site-preloader__core">
          <p className="site-preloader__eyebrow label-upper">Architecture · Engineering · Delivery</p>

          <div className="site-preloader__logo-wrap">
            <Image
              src={brandLogo}
              alt="OD Studio"
              width={1152}
              height={288}
              priority
              className="site-preloader__logo"
              sizes="(max-width: 768px) 92vw, 1280px"
            />
          </div>

          <div className="site-preloader__progress-block">
            <div className="site-preloader__progress-meta">
              <span className="site-preloader__status">Loading experience</span>
              <span className="site-preloader__percent" aria-hidden>
                {String(progress).padStart(2, "0")}
                <span className="site-preloader__percent-suffix">%</span>
              </span>
            </div>
            <div className="site-preloader__track" aria-hidden>
              <span
                className="site-preloader__bar"
                style={{ transform: `scaleX(${progress / 100})`, transformOrigin: "left center" }}
              />
            </div>
          </div>
        </div>

        <span className="sr-only">Loading, {progress} percent</span>
      </motion.div>

      {phase === "exit" ? (
        <>
          <motion.div
            className="site-preloader__curtain site-preloader__curtain--top"
            aria-hidden
            initial={{ y: 0 }}
            animate={{ y: "-102%" }}
            transition={{ duration: EXIT_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="site-preloader__curtain site-preloader__curtain--bottom"
            aria-hidden
            initial={{ y: 0 }}
            animate={{ y: "102%" }}
            transition={{ duration: EXIT_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          />
        </>
      ) : null}
    </div>
  );
}
