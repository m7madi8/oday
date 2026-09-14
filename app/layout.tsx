import type { Metadata } from "next";
import { bodoniModa, ibmPlexMono, plusJakartaSans } from "./fonts";
import "./globals.css";
import "./typography.css";
import { DeferredClientShell } from "@/components/DeferredClientShell";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "OD ARCHITECTS",
  description:
    "OD Architects delivers architecture and engineering solutions that elevate asset value, accelerate approvals, and strengthen market positioning.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "any" }],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${plusJakartaSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-bg-primary font-sans text-ink-primary"
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <DeferredClientShell />
        <div aria-hidden className="grain-layer pointer-events-none fixed inset-0 z-[1]" />
        <Navigation />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
