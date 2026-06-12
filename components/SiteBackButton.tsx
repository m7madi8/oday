"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function SiteBackButton() {
  const router = useRouter();

  const handleBack = () => {
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
