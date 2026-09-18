const HOME_SCROLL_KEY = "oday:home-scroll";

export function rememberHomeScroll(y: number) {
  try {
    sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.max(0, Math.round(y))));
  } catch {
    /* ignore */
  }
}

export function readHomeScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(HOME_SCROLL_KEY);
    if (!raw) return null;
    const y = Number(raw);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

export function clearHomeScroll() {
  try {
    sessionStorage.removeItem(HOME_SCROLL_KEY);
  } catch {
    /* ignore */
  }
}

export function scrollHomeToSaved(): boolean {
  const y = readHomeScroll();
  if (y == null) return false;
  window.scrollTo({ top: y, behavior: "auto" });
  return true;
}
