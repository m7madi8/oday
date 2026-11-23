import {
  HERO_CAROUSEL_QUALITY,
  HERO_DESKTOP_MEDIA,
  HERO_DESKTOP_SIZES,
  HERO_LCP_DESKTOP_SIZES,
  HERO_LCP_QUALITY,
  HERO_LCP_UNOPTIMIZED,
  HERO_MOBILE_MEDIA,
  HERO_MOBILE_SIZES,
  HERO_TABLET_MEDIA,
  HERO_TABLET_SIZES,
  hero,
} from "@/lib/hero-content";
import { getImageProps } from "next/image";

export type HeroSlide = (typeof hero.images)[number];

function heroSrcSet(props: { srcSet?: string; src?: string }) {
  return props.srcSet || props.src || "";
}

function HeroPublicStill({
  slide,
  priority,
  loading,
  onLoad,
}: {
  slide: HeroSlide;
  priority: boolean;
  loading: "eager" | "lazy";
  onLoad?: () => void;
}) {
  const fetchPriority = (priority ? "high" : "auto") as "high" | "auto";

  return (
    <picture className="hero-modern__picture hero-modern__picture--source">
      <img
        src={slide.publicSrc}
        className="hero-modern__img hero-modern__img--full-frame"
        width={slide.intrinsicWidth}
        height={slide.intrinsicHeight}
        alt=""
        draggable={false}
        loading={loading}
        decoding={priority ? "sync" : "async"}
        fetchPriority={fetchPriority}
        onLoad={onLoad}
      />
    </picture>
  );
}

export function HeroSlidePicture({
  slide,
  priority,
  loading,
  onLoad,
}: {
  slide: HeroSlide;
  priority: boolean;
  loading: "eager" | "lazy";
  onLoad?: () => void;
}) {
  if (HERO_LCP_UNOPTIMIZED && slide.publicSrc) {
    return (
      <HeroPublicStill slide={slide} priority={priority} loading={loading} onLoad={onLoad} />
    );
  }

  const fetchPriority = (priority ? "high" : "auto") as "high" | "auto";
  const quality = priority ? HERO_LCP_QUALITY : HERO_CAROUSEL_QUALITY;
  const desktopSizes = priority ? HERO_LCP_DESKTOP_SIZES : HERO_DESKTOP_SIZES;
  const frameSizes = priority ? HERO_LCP_DESKTOP_SIZES : undefined;
  const sharedFill = {
    alt: "",
    fill: true,
    quality,
    priority,
    fetchPriority,
    unoptimized: priority && HERO_LCP_UNOPTIMIZED,
  };

  const { props: mobileProps } = getImageProps({
    ...sharedFill,
    src: slide.srcMobile,
    sizes: frameSizes ?? HERO_MOBILE_SIZES,
  });

  const { props: tabletProps } = getImageProps({
    ...sharedFill,
    src: slide.srcTablet,
    sizes: frameSizes ?? HERO_TABLET_SIZES,
  });

  const { props: imgProps } = getImageProps({
    ...sharedFill,
    className: "hero-modern__img",
    src: slide.src,
    sizes: desktopSizes,
  });

  return (
    <picture className="hero-modern__picture">
      <source media={HERO_MOBILE_MEDIA} srcSet={heroSrcSet(mobileProps)} sizes={frameSizes ?? HERO_MOBILE_SIZES} />
      <source media={HERO_TABLET_MEDIA} srcSet={heroSrcSet(tabletProps)} sizes={frameSizes ?? HERO_TABLET_SIZES} />
      <source media={HERO_DESKTOP_MEDIA} srcSet={heroSrcSet(imgProps)} sizes={desktopSizes} />
      <img
        {...imgProps}
        alt=""
        draggable={false}
        loading={loading}
        decoding={priority ? "sync" : "async"}
        onLoad={onLoad}
        className={`${imgProps.className ?? ""} hero-modern__img--full-frame`.trim()}
        style={{
          ...imgProps.style,
          position: undefined,
          inset: undefined,
          width: undefined,
          height: undefined,
        }}
      />
    </picture>
  );
}