import { galleryHashToExteriorType } from "@/lib/gallery-anchors";
import { projects, type Project } from "@/lib/data";

const FOCUS_KEY = "oday:gallery-focus";

export function galleryReturnHref(project: Project): string {
  const path =
    project.serviceSlug === "exterior" && project.exteriorType
      ? `/projects?service=exterior&type=${encodeURIComponent(project.exteriorType)}`
      : `/projects?service=${encodeURIComponent(project.serviceSlug)}`;
  return `${path}#${encodeURIComponent(project.id)}`;
}

export function rememberGalleryFocus(projectId: string) {
  try {
    sessionStorage.setItem(FOCUS_KEY, projectId);
  } catch {
    /* ignore */
  }
}

export function clearGalleryFocus() {
  try {
    sessionStorage.removeItem(FOCUS_KEY);
  } catch {
    /* ignore */
  }
}

export function readGalleryFocusId(): string | null {
  if (typeof window === "undefined") return null;

  const raw = window.location.hash.replace(/^#/, "");
  let fromHash = "";
  try {
    fromHash = decodeURIComponent(raw);
  } catch {
    fromHash = raw;
  }

  if (fromHash && isGalleryProjectId(fromHash)) return fromHash;

  try {
    const stored = sessionStorage.getItem(FOCUS_KEY);
    return stored && isGalleryProjectId(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function isGalleryProjectId(id: string): boolean {
  return !galleryHashToExteriorType(id) && projects.some((project) => project.id === id);
}
