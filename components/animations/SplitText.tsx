"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { animationEasing } from "@/lib/animations";
import { type RefObject, useRef } from "react";

type SplitTargetMode = "chars" | "words";
type SplitTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

type SplitResult = {
  chars?: HTMLElement[];
  words?: HTMLElement[];
  revert?: () => void;
};

type SplitConstructor = new (
  target: Element | string,
  options?: { types?: string },
) => SplitResult;

async function loadSplitType(): Promise<SplitConstructor | null> {
  try {
    const dynamicImport = new Function(
      "moduleName",
      "return import(moduleName)",
    ) as (moduleName: string) => Promise<unknown>;
    const pkg = await dynamicImport("split-type");
    const ctor = (
      pkg as { default?: SplitConstructor; SplitType?: SplitConstructor }
    ).default ?? (pkg as { SplitType?: SplitConstructor }).SplitType;

    return ctor ?? null;
  } catch {
    return null;
  }
}

type Killable = { kill?: () => void };

function killIfPossible(target: unknown) {
  if (target && typeof target === "object" && "kill" in target) {
    (target as Killable).kill?.();
  }
}

export interface SplitTextProps {
  text: string;
  as?: SplitTag;
  className?: string;
  mode?: SplitTargetMode;
  fromY?: number;
  fromOpacity?: number;
  stagger?: number;
  duration?: number;
  triggerStart?: string;
  triggerOnView?: boolean;
  toColor?: string;
  colorTransitionDuration?: number;
}

export function SplitText({
  text,
  as = "h1",
  className,
  mode = "chars",
  fromY = -120,
  fromOpacity = 0,
  stagger = 0.04,
  duration = 0.8,
  triggerStart = "top 85%",
  triggerOnView = false,
  toColor,
  colorTransitionDuration = 0.4,
}: SplitTextProps) {
  const scopeRef = useRef<HTMLElement | null>(null);

  useGSAP(
    ({ gsap, addCleanup, scopeElement }) => {
      if (!scopeElement) {
        return;
      }

      let splitResult: SplitResult | undefined;

      const run = async () => {
        const SplitTypeCtor = await loadSplitType();

        if (SplitTypeCtor) {
          splitResult = new SplitTypeCtor(scopeElement, {
            types: mode,
          });
        }

        const targets =
          mode === "words"
            ? splitResult?.words ?? [scopeElement]
            : splitResult?.chars ?? [scopeElement];

        const tween = gsap.from(targets, {
          y: fromY,
          opacity: fromOpacity,
          stagger,
          duration,
          ease: animationEasing.smoothOut,
          ...(triggerOnView
            ? {
                scrollTrigger: {
                  trigger: scopeElement,
                  start: triggerStart,
                  once: true,
                },
              }
            : {}),
        });

        addCleanup(() => killIfPossible(tween));

        if (toColor) {
          const colorTween = gsap.to(scopeElement, {
            color: toColor,
            duration: colorTransitionDuration,
          });
          addCleanup(() => killIfPossible(colorTween));
        }
      };

      void run();

      return () => {
        splitResult?.revert?.();
      };
    },
    {
      scope: scopeRef as RefObject<HTMLElement | null>,
      deps: [
        text,
        mode,
        fromY,
        fromOpacity,
        stagger,
        duration,
        triggerStart,
        triggerOnView,
        toColor,
        colorTransitionDuration,
      ],
    },
  );

  const commonProps = {
    className,
    "data-split-mode": mode,
    children: text,
  };

  if (as === "h1") {
    return (
      <h1
        ref={scopeRef as unknown as RefObject<HTMLHeadingElement>}
        {...commonProps}
      />
    );
  }
  if (as === "h2") {
    return (
      <h2
        ref={scopeRef as unknown as RefObject<HTMLHeadingElement>}
        {...commonProps}
      />
    );
  }
  if (as === "h3") {
    return (
      <h3
        ref={scopeRef as unknown as RefObject<HTMLHeadingElement>}
        {...commonProps}
      />
    );
  }
  if (as === "p") {
    return (
      <p ref={scopeRef as unknown as RefObject<HTMLParagraphElement>} {...commonProps} />
    );
  }
  if (as === "div") {
    return (
      <div ref={scopeRef as unknown as RefObject<HTMLDivElement>} {...commonProps} />
    );
  }
  if (as === "span") {
    return (
      <span
        ref={scopeRef as unknown as RefObject<HTMLSpanElement>}
        {...commonProps}
      />
    );
  }

  return (
    <h1
      ref={scopeRef as unknown as RefObject<HTMLHeadingElement>}
      {...commonProps}
    />
  );
}
