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

  useEffect(() => {
    setLoadDesktopFx(isDesktopFinePointer() && !isMobilePerfMode());
  }, []);

  return (
    <>
      <SmoothHashScroll />
      <HomeScrollRestore />
      {loadDesktopFx ? <OrbitScrollProgress /> : null}
    </>
  );
}
