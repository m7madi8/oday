"use client";

import { isDesktopFinePointer, isMobilePerfMode } from "@/lib/animations";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SmoothHashScroll = dynamic(
  () => import("@/components/SmoothHashScroll").then((m) => ({ default: m.SmoothHashScroll })),
  { ssr: false },
);

const OrbitScrollProgress = dynamic(
  () =>
    import("@/components/OrbitScrollProgress").then((m) => ({ default: m.OrbitScrollProgress })),
  { ssr: false },
);

const HomeScrollRestore = dynamic(
  () => import("@/components/HomeScrollRestore").then((m) => ({ default: m.HomeScrollRestore })),
  { ssr: false },
);

export function DeferredClientShell() {
  const [loadDesktopFx, setLoadDesktopFx] = useState(false);
  const [loadScrollHelpers, setLoadScrollHelpers] = useState(false);

  useEffect(() => {
    setLoadDesktopFx(isDesktopFinePointer() && !isMobilePerfMode());

    const mountHelpers = () => setLoadScrollHelpers(true);
    if (isMobilePerfMode()) {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(mountHelpers, { timeout: 3500 });
        return () => window.cancelIdleCallback(id);
      }
      const t = window.setTimeout(mountHelpers, 1200);
      return () => window.clearTimeout(t);
    }
    mountHelpers();
  }, []);

  return (
    <>
      {loadScrollHelpers ? (
        <>
          <SmoothHashScroll />
          <HomeScrollRestore />
        </>
      ) : null}
      {loadDesktopFx ? <OrbitScrollProgress /> : null}
    </>
  );
}
