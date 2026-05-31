import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Navigation } from "@/components/Navigation";
import { SitePreloader } from "@/components/SitePreloader";
import { SmoothHashScroll } from "@/components/SmoothHashScroll";

export const metadata: Metadata = {
  title: "OD STUDIO",
  description:
    "OD Studio delivers architecture and engineering solutions that elevate asset value, accelerate approvals, and strengthen market positioning.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Philosopher:ital,wght@0,400;1,400&family=Jost:wght@200;300;400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{function lock(){document.documentElement.classList.add("preloader-pending");if(document.body)document.body.classList.add("preloader-active");}lock();if(!document.body)document.addEventListener("DOMContentLoaded",lock,{once:true});}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-bg-primary font-sans font-light text-ink-primary"
        suppressHydrationWarning
      >
        <SitePreloader />
        <GrainOverlay />
        <CustomCursor />
        <SmoothHashScroll />
        <Navigation />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
