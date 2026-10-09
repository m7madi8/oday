import {
  HERO_DESKTOP_MEDIA,
  HERO_LCP_DESKTOP_SIZES,
  HERO_LCP_QUALITY,
  HERO_MOBILE_MEDIA,
  HERO_MOBILE_SIZES,
  HERO_TABLET_MEDIA,
  HERO_TABLET_SIZES,
  hero,
} from "@/lib/hero-content";
import { getImageProps } from "next/image";

function preloadAttrs(props: { srcSet?: string; src?: string }, sizes: string) {
  const srcSet = props.srcSet || props.src;
  if (!srcSet) return null;
  if (props.srcSet) {
    return { imageSrcSet: srcSet, imageSizes: sizes };
  }
  return { href: props.src };
}

/**
 * Preload the first hero still (optimized AVIF/WebP) per device class for LCP.
 */
export function HeroLcpPreload() {
  const slide = hero.images[0];
  const shared = { alt: "", fill: true, quality: HERO_LCP_QUALITY, priority: true as const };

  const mobile = getImageProps({ ...shared, src: slide.srcMobile, sizes: HERO_MOBILE_SIZES });
  const tablet = getImageProps({ ...shared, src: slide.srcTablet, sizes: HERO_TABLET_SIZES });
  const desktop = getImageProps({
    ...shared,
    src: slide.src,
    sizes: HERO_LCP_DESKTOP_SIZES,
  });

  const mobilePreload = preloadAttrs(mobile.props, HERO_MOBILE_SIZES);
  const tabletPreload = preloadAttrs(tablet.props, HERO_TABLET_SIZES);
  const desktopPreload = preloadAttrs(desktop.props, HERO_LCP_DESKTOP_SIZES);

  return (
    <>
      {mobilePreload ? (
        <link
          key="hero-lcp-mobile"
          rel="preload"
          as="image"
          {...mobilePreload}
          media={HERO_MOBILE_MEDIA}
          fetchPriority="high"
          suppressHydrationWarning
        />
      ) : null}
      {tabletPreload ? (
        <link
          key="hero-lcp-tablet"
          rel="preload"
          as="image"
          {...tabletPreload}
          media={HERO_TABLET_MEDIA}
          fetchPriority="high"
          suppressHydrationWarning
        />
      ) : null}
      {desktopPreload ? (
        <link
          key="hero-lcp-desktop"
          rel="preload"
          as="image"
          {...desktopPreload}
          media={HERO_DESKTOP_MEDIA}
          fetchPriority="high"
          suppressHydrationWarning
        />
      ) : null}
    </>
  );
}
