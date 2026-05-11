"use client";

import { useGSAP, type GsapLike } from "@/hooks/useGSAP";
import { isDesktopFinePointer, magneticDefaults } from "@/lib/animations";
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
  ...props
}: MagneticButtonProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<GsapLike | null>(null);
  const [enabled, setEnabled] = useState(false);

  useGSAP(
    ({ gsap }) => {
      gsapRef.current = gsap;
    },
    { once: true },
  );

  useEffect(() => {
    if (!disabledOnTouch) {
      setEnabled(true);
      return;
    }

    const update = () => setEnabled(isDesktopFinePointer());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [disabledOnTouch]);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!enabled || !rootRef.current || !gsapRef.current) {
      return;
    }

    const rect = rootRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    const vars: Record<string, unknown> = {
      x: x * strength,
      y: y * strength,
      duration: magneticDefaults.moveDuration,
      ease: "power2.out",
    };

    if (enableTilt) {
      vars.rotateX = ((event.clientY - rect.top - rect.height / 2) / rect.height) * -maxTilt;
      vars.rotateY = ((event.clientX - rect.left - rect.width / 2) / rect.width) * maxTilt;
      vars.transformPerspective = perspective;
    }

    gsapRef.current.to(rootRef.current, vars);
  };

  const handleLeave = () => {
    if (!rootRef.current || !gsapRef.current) {
      return;
    }

    const vars: Record<string, unknown> = {
      x: 0,
      y: 0,
      duration: magneticDefaults.returnDuration,
      ease: returnEase,
    };

    if (enableTilt) {
      vars.rotateX = 0;
      vars.rotateY = 0;
      vars.transformPerspective = perspective;
    }

    gsapRef.current.to(rootRef.current, vars);
  };

  return (
    <div
      ref={rootRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </div>
  );
}
