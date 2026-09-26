import {
  HERO_DESKTOP_MEDIA,
  HERO_DESKTOP_SIZES,
  HERO_MOBILE_MEDIA,
  HERO_MOBILE_SIZES,
  HERO_TABLET_MEDIA,
  HERO_TABLET_SIZES,
  hero,
} from "@/lib/hero-content";
import { getImageProps } from "next/image";

const QUALITY = 100;

function preloadAttrs(props: { srcSet?: string; src?: string }, sizes: string) {
  const srcSet = props.srcSet || props.src;
  if (props.srcSet) {
    return { imageSrcSet: srcSet, imageSizes: sizes };
  }
  return { href: props.src };
}

/**
 * Preload the first hero still for each device class so art-directed
 * <picture> sources still win LCP after dropping next/image's built-in preload.
 */
export function HeroLcpPreload() {
  const slide = hero.images[0];
  const shared = { alt: "", fill: true, quality: QUALITY, unoptimized: true };

  const mobile = getImageProps({ ...shared, src: slide.srcMobile, sizes: HERO_MOBILE_SIZES });
  const tablet = getImageProps({ ...shared, src: slide.srcTablet, sizes: HERO_TABLET_SIZES });
  const desktop = getImageProps({ ...shared, src: slide.src, sizes: HERO_DESKTOP_SIZES });

  return (
    <>
      <link
        rel="preload"
        as="image"
        {...preloadAttrs(mobile.props, HERO_MOBILE_SIZES)}
        media={HERO_MOBILE_MEDIA}
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        {...preloadAttrs(tablet.props, HERO_TABLET_SIZES)}
        media={HERO_TABLET_MEDIA}
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        {...preloadAttrs(desktop.props, HERO_DESKTOP_SIZES)}
        media={HERO_DESKTOP_MEDIA}
        fetchPriority="high"
      />
    </>
  );
}
