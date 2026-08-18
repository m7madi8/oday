"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseHoverIntentOptions = {
  /** Delay before a first panel opens — absorbs pointer travel across the header. */
  openDelay?: number;
  /** Grace period before closing — lets the pointer cross the gap into the panel. */
  closeDelay?: number;
  /** Delay when moving between two panels; 0 keeps switching instant. */
  switchDelay?: number;
  enabled?: boolean;
};

/**
 * Intentional hover for a set of mutually exclusive panels. Holds which panel is
 * open rather than a boolean, so switching between siblings can skip the open delay.
 */
export function useHoverIntent<T>({
  openDelay = 90,
  closeDelay = 240,
  switchDelay = 0,
  enabled = true,
}: UseHoverIntentOptions = {}) {
  const [value, setValue] = useState<T | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const openNow = useCallback(
    (next: T) => {
      if (!enabled) return;
      clearTimers();
      setValue(next);
    },
    [clearTimers, enabled],
  );

  const closeNow = useCallback(() => {
    clearTimers();
    setValue(null);
  }, [clearTimers]);

  const scheduleOpen = useCallback(
    (next: T) => {
      if (!enabled) return;
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      if (value === next) return;

      if (value !== null) {
        clearTimers();
        if (switchDelay <= 0) {
          setValue(next);
          return;
        }
        openTimer.current = window.setTimeout(() => setValue(next), switchDelay);
        return;
      }

      openTimer.current = window.setTimeout(() => setValue(next), openDelay);
    },
    [clearTimers, enabled, openDelay, switchDelay, value],
  );

  const scheduleClose = useCallback(() => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = window.setTimeout(() => setValue(null), closeDelay);
  }, [closeDelay]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (!enabled && value !== null) {
      clearTimers();
      setValue(null);
    }
  }, [clearTimers, enabled, value]);

  return { value, scheduleOpen, scheduleClose, openNow, closeNow, clearTimers };
}
