export const PRELOADER_DONE_EVENT = "od-preloader-done";

/** @deprecated Legacy key — cleared on each finish so refresh always shows preloader */
const LEGACY_SESSION_KEY = "od-preloader-seen";

/** True after the first preloader finish in this tab (survives client-side route changes). */
let preloaderFinishedThisSession = false;

export function isPreloaderPending(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("preloader-pending");
}

/** Whether the intro preloader has already completed (or is not blocking the page). */
export function hasPreloaderFinished(): boolean {
  if (typeof document === "undefined") return false;
  return preloaderFinishedThisSession || !isPreloaderPending();
}

export function clearPreloaderShell(): void {
  document.documentElement.classList.remove("preloader-pending");
  document.body.classList.remove("preloader-active");
}

export function finishPreloaderSession(): void {
  preloaderFinishedThisSession = true;
  try {
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    /* private mode */
  }
  clearPreloaderShell();
  window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
}
