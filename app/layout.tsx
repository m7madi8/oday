import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "OD STUDIO",
  description:
    "OD Studio delivers architecture and engineering solutions that elevate asset value, accelerate approvals, and strengthen market positioning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-primary font-sans font-light text-ink-primary">
        <GrainOverlay />
        <CustomCursor />
        <Navigation />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
