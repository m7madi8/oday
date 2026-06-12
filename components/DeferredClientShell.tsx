"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false },
);

const SmoothHashScroll = dynamic(
  () => import("@/components/SmoothHashScroll").then((m) => ({ default: m.SmoothHashScroll })),
  { ssr: false },
);

export function DeferredClientShell() {
  return (
    <>
      <CustomCursor />
      <SmoothHashScroll />
    </>
  );
}
