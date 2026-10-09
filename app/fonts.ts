import {
  Bodoni_Moda,
  IBM_Plex_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";

/** Editorial display — section headlines, project titles */
export const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni-moda",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

/** Hero statement — matches reference “We Design For A Better Life” */
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

/** Primary sans — body, navigation, buttons, UI */
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600"],
});

/** Technical accent — project numbers, years, locations (use sparingly) */
export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  adjustFontFallback: true,
});
