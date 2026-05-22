"use client";

import type { CSSProperties } from "react";
import { useEffect } from "react";

/** Root-level fallback: no Tailwind/CSS imports so this always renders if the bundle fails. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const shell: CSSProperties = {
    margin: 0,
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#f2efe8",
    fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    fontWeight: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    textAlign: "center",
  };

  const gold = "#f5c518";
  const muted = "#c9c2b6";

  const btn: CSSProperties = {
    marginTop: 28,
    cursor: "pointer",
    borderRadius: 9999,
    border: `1px solid rgba(245, 197, 24, 0.45)`,
    backgroundColor: "#1e1e1e",
    color: "#f2efe8",
    padding: "12px 22px",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };

  return (
    <html lang="en">
      <body style={shell}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: gold }}>Error</p>
        <h1 style={{ marginTop: 12, fontSize: "1.25rem", fontWeight: 500 }}>Something went wrong</h1>
        <p style={{ marginTop: 16, maxWidth: 360, fontSize: 14, lineHeight: 1.5, color: muted }}>
          A critical error occurred. Try reloading the page.
        </p>
        <button type="button" style={btn} onClick={reset}>
          Try again
        </button>
      </body>
    </html>
  );
}
