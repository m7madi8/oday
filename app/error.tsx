"use client";

import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { RevealFade } from "@/components/animations/RevealFade";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[60svh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center"
    >
      <RevealFade as="p" className="text-xs uppercase tracking-[0.2em] text-gold" timing="enter">
        Error
      </RevealFade>
      <AnimatedHeading
        as="h1"
        text="Something went wrong"
        className="mt-3 font-ui text-xl font-medium text-ink-primary"
        timing="enter"
        delay={0.08}
      />
      <p className="mt-4 text-base leading-relaxed text-ink-secondary">
        The page hit an unexpected error. You can try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn btn--primary mt-8"
      >
        Try again
      </button>
    </main>
  );
}
