import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { CaseStudiesCta } from "@/components/CaseStudiesCta";

const About = dynamic(() => import("@/components/About").then((m) => ({ default: m.About })));
const Services = dynamic(() => import("@/components/Services").then((m) => ({ default: m.Services })));
const Location = dynamic(() => import("@/components/Location").then((m) => ({ default: m.Location })));
const FAQ = dynamic(() => import("@/components/FAQ").then((m) => ({ default: m.FAQ })));
const Contact = dynamic(() => import("@/components/Contact").then((m) => ({ default: m.Contact })));

export default function Home() {
  return (
    <>
      <CaseStudiesCta />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Location />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
