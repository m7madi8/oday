import { hero } from "@/lib/hero-content";
import { HeroSlidePicture } from "@/components/HeroSlidePicture";

/** Server-rendered first hero still — visible before client carousel hydrates. */
export function HeroLcpBackground() {
  const slide = hero.images[0];
  if (!slide) return null;

  return (
    <div
      className="hero-modern__layer hero-modern__layer--lcp is-active hero-modern__layer--lead-zoom"
      aria-hidden
    >
      <div className="hero-modern__layer-inner">
        <HeroSlidePicture slide={slide} priority loading="eager" />
      </div>
    </div>
  );
}
