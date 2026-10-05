import {
  HERO_CAROUSEL_QUALITY,
  HERO_DESKTOP_MEDIA,
  HERO_DESKTOP_SIZES,
  HERO_LCP_DESKTOP_SIZES,
  HERO_LCP_QUALITY,
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
  const fetchPriority = (priority ? "high" : "auto") as "high" | "auto";
  const quality = priority ? HERO_LCP_QUALITY : HERO_CAROUSEL_QUALITY;
  const desktopSizes = priority ? HERO_LCP_DESKTOP_SIZES : HERO_DESKTOP_SIZES;
  const sharedFill = {
    alt: "",
    fill: true,
    quality,
    priority,
    fetchPriority,
  };

  const { props: mobileProps } = getImageProps({
    ...sharedFill,
    src: slide.srcMobile,
    sizes: HERO_MOBILE_SIZES,
  });

  const { props: tabletProps } = getImageProps({
    ...sharedFill,
    src: slide.srcTablet,
    sizes: HERO_TABLET_SIZES,
  });

  const { props: imgProps } = getImageProps({
    ...sharedFill,
    className: "hero-modern__img",
    src: slide.src,
    sizes: desktopSizes,
  });

  return (
    <picture className="hero-modern__picture">
      <source media={HERO_MOBILE_MEDIA} srcSet={heroSrcSet(mobileProps)} sizes={HERO_MOBILE_SIZES} />
      <source media={HERO_TABLET_MEDIA} srcSet={heroSrcSet(tabletProps)} sizes={HERO_TABLET_SIZES} />
      <source media={HERO_DESKTOP_MEDIA} srcSet={heroSrcSet(imgProps)} sizes={desktopSizes} />
      <img
        {...imgProps}
        alt=""
        draggable={false}
        loading={loading}
        decoding={priority ? "sync" : "async"}
        onLoad={onLoad}
        style={{
          ...imgProps.style,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: slide.objectPosition,
        }}
      />
    </picture>
  );
}
