import { galleryHashToExteriorType } from "@/lib/gallery-anchors";
import { projects, type Project } from "@/lib/data";

const FOCUS_KEY = "oday:gallery-focus";

export const GALLERY_FOCUS_EVENT = "oday:gallery-focus";

type GalleryFocus = {
  id: string;
  href?: string;
};

export function galleryReturnHref(project: Project): string {
  const path =
    project.serviceSlug === "exterior" && project.exteriorType
      ? `/projects?service=exterior&type=${encodeURIComponent(project.exteriorType)}`
      : `/projects?service=${encodeURIComponent(project.serviceSlug)}`;
  return `${path}#${encodeURIComponent(project.id)}`;
}

export function resolveGalleryReturnHref(project: Project): string {
  return readGalleryFocus()?.href || galleryReturnHref(project);
}

export function rememberGalleryFocus(projectId: string, href?: string) {
  try {
    const prev = readStoredFocus();
    const payload: GalleryFocus = {
      id: projectId,
      href: href || prev?.href,
    };
    sessionStorage.setItem(FOCUS_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

/** Remember the current gallery URL so Back lands on this project, not mid-page. */
export function captureGalleryNavigation(projectId: string) {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (path !== "/projects" && path !== "/gallery") return;
  rememberGalleryFocus(
    projectId,
    `${path}${window.location.search}#${encodeURIComponent(projectId)}`,
  );
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}

export function clearGalleryFocus() {
  try {
    sessionStorage.removeItem(FOCUS_KEY);
  } catch {
    /* ignore */
  }
}

export function readGalleryFocus(): GalleryFocus | null {
  if (typeof window === "undefined") return null;

  const fromHash = readHashProjectId();
  const stored = readStoredFocus();

  if (fromHash) {
    return { id: fromHash, href: stored?.href };
  }
  return stored;
}

export function readGalleryFocusId(): string | null {
  return readGalleryFocus()?.id ?? null;
}

export function notifyGalleryFocus(id: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(GALLERY_FOCUS_EVENT, { detail: { id } }));
}

/** Pin the card just below the sticky nav + filter dock, not the viewport center. */
export function galleryScrollOffset(): number {
  const nav = document.querySelector(".site-nav");
  const dock = document.querySelector(".gallery-page__filter-dock");
  const navBottom = nav instanceof HTMLElement ? nav.getBoundingClientRect().bottom : 0;
  const dockHeight = dock instanceof HTMLElement ? dock.getBoundingClientRect().height : 0;
  return Math.max(navBottom, 0) + dockHeight + 12;
}

export function scrollGalleryProjectIntoView(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - galleryScrollOffset());
  window.scrollTo({ top, behavior: "auto" });
  return true;
}

export function isGalleryProjectId(id: string): boolean {
  return !galleryHashToExteriorType(id) && projects.some((project) => project.id === id);
}

function readHashProjectId(): string | null {
  const raw = window.location.hash.replace(/^#/, "");
  let fromHash = "";
  try {
    fromHash = decodeURIComponent(raw);
  } catch {
    fromHash = raw;
  }
  return fromHash && isGalleryProjectId(fromHash) ? fromHash : null;
}

function readStoredFocus(): GalleryFocus | null {
  try {
    const raw = sessionStorage.getItem(FOCUS_KEY);
    if (!raw) return null;
    if (raw.startsWith("{")) {
      const data = JSON.parse(raw) as GalleryFocus;
      return data?.id && isGalleryProjectId(data.id) ? data : null;
    }
    return isGalleryProjectId(raw) ? { id: raw } : null;
  } catch {
    return null;
  }
}
