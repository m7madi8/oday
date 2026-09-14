"use client";

import { useGSAP, type GsapLike } from "@/hooks/useGSAP";
import {
  isDesktopFinePointer,
  magneticDefaults,
  magneticDelta,
  prefersReducedMotion,
} from "@/lib/animations";
import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

export interface MagneticButtonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strength?: number;
  disabledOnTouch?: boolean;
  returnEase?: string;
  enableTilt?: boolean;
  maxTilt?: number;
  perspective?: number;
}

export function MagneticButton({
  children,
  className,
  strength = magneticDefaults.strength,
  disabledOnTouch = true,
  returnEase = magneticDefaults.returnEase,
  enableTilt = false,
  maxTilt = 12,
  perspective = 800,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<GsapLike | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => {
      const fine = !disabledOnTouch || isDesktopFinePointer();
      setEnabled(fine && !prefersReducedMotion());
    };

    update();
    window.addEventListener("resize", update);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      motionQuery.removeEventListener("change", update);
    };
  }, [disabledOnTouch]);

  useGSAP(
    ({ gsap }) => {
      gsapRef.current = gsap;
    },
    { once: true, enabled },
  );

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(event);
    if (!enabled || !rootRef.current || !gsapRef.current) {
      return;
    }

    const rect = rootRef.current.getBoundingClientRect();
    const { x, y } = magneticDelta(event.clientX, event.clientY, rect, strength);

    const vars: Record<string, unknown> = {
      x,
      y,
      duration: magneticDefaults.moveDuration,
      ease: "power2.out",
      overwrite: "auto",
    };

    if (enableTilt) {
      vars.rotateX = ((event.clientY - rect.top - rect.height / 2) / rect.height) * -maxTilt;
      vars.rotateY = ((event.clientX - rect.left - rect.width / 2) / rect.width) * maxTilt;
      vars.transformPerspective = perspective;
    }

    gsapRef.current.to(rootRef.current, vars);
  };

  const handleLeave = (event: MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(event);
    if (!rootRef.current || !gsapRef.current) {
      return;
    }

    const vars: Record<string, unknown> = {
      x: 0,
      y: 0,
      duration: magneticDefaults.returnDuration,
      ease: returnEase,
      overwrite: "auto",
    };

    if (enableTilt) {
      vars.rotateX = 0;
      vars.rotateY = 0;
      vars.transformPerspective = perspective;
    }

    gsapRef.current.to(rootRef.current, vars);
  };

  useEffect(() => {
    if (enabled || !rootRef.current || !gsapRef.current) return;
    gsapRef.current.set(rootRef.current, { x: 0, y: 0, rotateX: 0, rotateY: 0 });
  }, [enabled]);

  return (
    <div
      ref={rootRef}
      className={className}
      {...props}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
