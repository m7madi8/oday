import dynamic from "next/dynamic";
import "@/app/home-editorial.css";
import { Hero } from "@/components/Hero";
import { CaseStudiesCta } from "@/components/CaseStudiesCta";

function HomeSectionRule() {
  return <div className="home-section-rule" aria-hidden />;
}

const Services = dynamic(() => import("@/components/Services").then((m) => ({ default: m.Services })));
const FeaturedProjects = dynamic(() =>
  import("@/components/FeaturedProjects").then((m) => ({ default: m.FeaturedProjects })),
);
const Contact = dynamic(() => import("@/components/Contact").then((m) => ({ default: m.Contact })));

export default function Home() {
  return (
    <>
      <CaseStudiesCta />
      <main id="main-content">
        <Hero />
        <HomeSectionRule />
        <Services />
        <FeaturedProjects />
        <Contact />
      </main>
    </>
  );
}
