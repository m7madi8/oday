"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseHoverIntentOptions = {
  openDelay?: number;
  closeDelay?: number;
  enabled?: boolean;
};

/**
 * Intentional hover: short open delay, graceful close delay,
 * seamless transfer between trigger and panel.
 */
export function useHoverIntent({
  openDelay = 140,
  closeDelay = 200,
  enabled = true,
}: UseHoverIntentOptions = {}) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const scheduleOpen = useCallback(() => {
    if (!enabled) return;
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (open) return;
    openTimer.current = window.setTimeout(() => setOpen(true), openDelay);
  }, [enabled, open, openDelay]);

  const scheduleClose = useCallback(() => {
    if (!enabled) return;
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay);
  }, [enabled, closeDelay]);

  const openNow = useCallback(() => {
    clearTimers();
    if (enabled) setOpen(true);
  }, [clearTimers, enabled]);

  const closeNow = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (!enabled && open) setOpen(false);
  }, [enabled, open]);

  return {
    open,
    setOpen,
    scheduleOpen,
    scheduleClose,
    openNow,
    closeNow,
    clearTimers,
  };
}
