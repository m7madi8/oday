"use client";

import {
  PRELOADER_DONE_EVENT,
  clearPreloaderShell,
  hasPreloaderFinished,
} from "@/lib/preloader";
import { useEffect, useLayoutEffect, useState } from "react";

const SAFETY_MS = 10_000;

export function usePreloaderDone(): boolean {
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    if (hasPreloaderFinished()) {
      setDone(true);
    }
  }, []);

  useEffect(() => {
    if (done) return;

    const onDone = () => setDone(true);
    window.addEventListener(PRELOADER_DONE_EVENT, onDone);

    const safety = window.setTimeout(() => {
      clearPreloaderShell();
      setDone(true);
    }, SAFETY_MS);

    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
      window.clearTimeout(safety);
    };
  }, [done]);

  return done;
}
