"use client";

import { isMobilePerfMode } from "@/lib/animations";
import { useEffect, useState } from "react";

/** True on touch phones and narrow viewports — lighter motion and fewer scroll listeners. */
export function useMobilePerfMode(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const update = () => setMobile(isMobilePerfMode());

    update();
    window.addEventListener("resize", update, { passive: true });

    const coarse = window.matchMedia("(pointer: coarse)");
    const onCoarseChange = () => update();
    coarse.addEventListener("change", onCoarseChange);

    return () => {
      window.removeEventListener("resize", update);
      coarse.removeEventListener("change", onCoarseChange);
    };
  }, []);

  return mobile;
}
