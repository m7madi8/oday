"use client";

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
    <div className="mx-auto flex min-h-[60svh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Error</p>
      <h1 className="mt-3 font-outfit text-2xl font-medium text-ink-primary">
        Something went wrong
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
        The page hit an unexpected error. You can try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full border border-gold/40 bg-bg-card px-6 py-3 text-xs uppercase tracking-[0.12em] text-ink-primary transition-colors hover:border-gold hover:bg-bg-secondary"
      >
        Try again
      </button>
    </div>
  );
}
