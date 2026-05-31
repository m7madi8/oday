"use client";

import { useEffect, useState } from "react";

function hashTargetsHero(): boolean {
  if (typeof window === "undefined") return true;
  const hash = window.location.hash;
  return !hash || hash === "#top";
}

/** True when the URL hash is empty or #top (hero is the intended first view). */
export function useIsHeroRouteTarget(): boolean {
  const [targetsHero, setTargetsHero] = useState(false);

  useEffect(() => {
    setTargetsHero(hashTargetsHero());
    const onHashChange = () => setTargetsHero(hashTargetsHero());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return targetsHero;
}
