import type { Transition, Variants } from "framer-motion";

export const animationEasing = {
  cinematic: [0.16, 1, 0.3, 1] as const,
  smoothOut: [0.22, 1, 0.36, 1] as const,
  softInOut: [0.4, 0, 0.2, 1] as const,
};

export const sectionViewport = {
  once: true,
  margin: "-100px",
} as const;

export const scrollTriggerDefaults = {
  once: true,
  start: "top 80%",
} as const;

export const heroCinematic = {
  intro: {
    imageScaleFrom: 1.2,
    imageDuration: 1.8,
    title1Start: 0.8,
    title2Start: 1.2,
    descStart: 1.6,
    buttonsStart: 1.9,
    scrollIndicatorStart: 2.1,
  },
  split: {
    charStagger: 0.04,
    duration: 0.8,
  },
  blur: {
    from: 8,
    duration: 0.7,
  },
  buttons: {
    stagger: 0.15,
    duration: 0.6,
  },
} as const;

export const parallaxDefaults = {
  yPercent: -30,
  start: "top bottom",
  end: "bottom top",
  scrub: 1.5,
} as const;

export const sectionNumberParallaxDefaults = {
  yPercent: 20,
  scrub: 2,
} as const;

export const magneticDefaults = {
  strength: 0.35,
  moveDuration: 0.6,
  returnDuration: 0.8,
  returnEase: "elastic.out(1, 0.4)",
} as const;

export const cardTiltDefaults = {
  maxRotate: 12,
  perspective: 800,
  duration: 0.4,
} as const;

export const counterDefaults = {
  duration: 2.35,
  start: "top 82%",
  ease: "expo.out",
} as const;

export const drawLineDefaults = {
  strokeWidth: 1,
  strokeDasharray: "6 4",
  duration: 1.8,
  start: "top 60%",
  circleStagger: 0.3,
  circleDelay: 1.2,
} as const;

export function createFadeUpVariants(distance = 26): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: animationEasing.smoothOut,
      },
    },
  };
}

export function createMaskRevealTransition(
  duration = 0.9,
  delay = 0,
): Transition {
  return {
    duration,
    delay,
    ease: animationEasing.cinematic,
  };
}

export function isDesktopFinePointer(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return (
    window.matchMedia("(min-width: 768px)").matches &&
    window.matchMedia("(pointer: fine)").matches
  );
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export const animationLayerGuide = {
  hero: [
    "Wrap hero titles with SplitText or RevealText.",
    "Wrap hero image with ParallaxImage for cinematic drift.",
    "Use CounterNumber for hero metrics.",
  ],
  projects: [
    "Wrap card actions with MagneticButton.",
    "Wrap project images with ParallaxImage.",
  ],
  process: [
    "Use DrawLine for dashed connector animation.",
    "Mark circles with '.process-circle' for stagger reveals.",
  ],
} as const;

type GSAPTarget = string | Element | Element[] | NodeListOf<Element>;

export type HeroCinematicSelectors = {
  heroImage: GSAPTarget;
  titlePrimaryChars: GSAPTarget;
  titleAccentChars: GSAPTarget;
  description: GSAPTarget;
  buttonItems: GSAPTarget;
  scrollIndicator: GSAPTarget;
  titleAccentContainer?: GSAPTarget;
};

type TimelineLike = {
  from: (target: GSAPTarget, vars: Record<string, unknown>, position?: number | string) => TimelineLike;
  to: (target: GSAPTarget, vars: Record<string, unknown>, position?: number | string) => TimelineLike;
};

export type GsapCinematicRuntime = {
  timeline: (vars?: Record<string, unknown>) => TimelineLike;
  to: (target: GSAPTarget, vars: Record<string, unknown>) => unknown;
};

export function runHeroCinematicTimeline(
  gsap: GsapCinematicRuntime,
  selectors: HeroCinematicSelectors,
  accentColor = "#C9A84C",
): TimelineLike {
  return gsap
    .timeline()
    .from(
      selectors.heroImage,
      {
        scale: heroCinematic.intro.imageScaleFrom,
        duration: heroCinematic.intro.imageDuration,
        ease: "power2.out",
      },
      0.3,
    )
    .from(
      selectors.titlePrimaryChars,
      {
        y: -120,
        opacity: 0,
        stagger: heroCinematic.split.charStagger,
        duration: heroCinematic.split.duration,
        ease: "power3.out",
      },
      heroCinematic.intro.title1Start,
    )
    .from(
      selectors.titleAccentChars,
      {
        y: 80,
        opacity: 0,
        stagger: heroCinematic.split.charStagger,
        duration: heroCinematic.split.duration,
        ease: "power3.out",
      },
      heroCinematic.intro.title2Start,
    )
    .to(
      selectors.titleAccentContainer ?? selectors.titleAccentChars,
      {
        color: accentColor,
        duration: 0.4,
        ease: "power1.out",
      },
      heroCinematic.intro.title2Start + 0.25,
    )
    .from(
      selectors.description,
      {
        opacity: 0,
        filter: `blur(${heroCinematic.blur.from}px)`,
        y: 20,
        duration: heroCinematic.blur.duration,
        ease: "power2.out",
      },
      heroCinematic.intro.descStart,
    )
    .from(
      selectors.buttonItems,
      {
        opacity: 0,
        y: 30,
        stagger: heroCinematic.buttons.stagger,
        duration: heroCinematic.buttons.duration,
        ease: "power2.out",
      },
      heroCinematic.intro.buttonsStart,
    )
    .from(
      selectors.scrollIndicator,
      {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power2.out",
      },
      heroCinematic.intro.scrollIndicatorStart,
    );
}
