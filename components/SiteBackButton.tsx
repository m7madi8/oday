"use client";

import { galleryReturnHref, readGalleryFocus } from "@/lib/gallery-return";
import { getProjectBySlug } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function SiteBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const projectSlug = pathname.match(/^\/projects\/([^/]+)$/)?.[1];

  const handleBack = () => {
    if (projectSlug) {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        return;
      }
      const stored = readGalleryFocus();
      const project = getProjectBySlug(projectSlug);
      const target = stored?.href ?? (project ? galleryReturnHref(project) : "/projects");
      router.push(target, { scroll: false });
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <button
      type="button"
      data-no-glow
      className="site-back-btn site-back-btn--nav"
      onClick={handleBack}
      aria-label="Go back"
    >
      <ArrowLeft className="site-back-btn__icon" aria-hidden />
      <span className="site-back-btn__label">Back</span>
    </button>
  );
}
