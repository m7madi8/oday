"use client";

import { isDesktopFinePointer, isMobilePerfMode } from "@/lib/animations";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false },
);

const SmoothHashScroll = dynamic(
  () => import("@/components/SmoothHashScroll").then((m) => ({ default: m.SmoothHashScroll })),
  { ssr: false },
);

const OrbitScrollProgress = dynamic(
  () =>
    import("@/components/OrbitScrollProgress").then((m) => ({ default: m.OrbitScrollProgress })),
  { ssr: false },
);

export function DeferredClientShell() {
  const [loadDesktopFx, setLoadDesktopFx] = useState(false);

  useEffect(() => {
    setLoadDesktopFx(isDesktopFinePointer() && !isMobilePerfMode());
  }, []);

  return (
    <>
      {loadDesktopFx ? <CustomCursor /> : null}
      <SmoothHashScroll />
      {loadDesktopFx ? <OrbitScrollProgress /> : null}
    </>
  );
}
