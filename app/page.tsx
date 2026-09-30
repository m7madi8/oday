import dynamic from "next/dynamic";
import "@/app/home-editorial.css";
import { Hero } from "@/components/Hero";
import { HeroLcpPreload } from "@/components/HeroLcpPreload";

const CaseStudiesCta = dynamic(
  () => import("@/components/CaseStudiesCta").then((m) => ({ default: m.CaseStudiesCta })),
  { ssr: true },
);

function HomeSectionRule() {
  return <div className="home-section-rule" aria-hidden />;
}

const Services = dynamic(() => import("@/components/Services").then((m) => ({ default: m.Services })), {
  loading: () => null,
});
const FeaturedProjects = dynamic(
  () => import("@/components/FeaturedProjects").then((m) => ({ default: m.FeaturedProjects })),
  { loading: () => null },
);
const Contact = dynamic(() => import("@/components/Contact").then((m) => ({ default: m.Contact })), {
  loading: () => null,
});

export default function Home() {
  return (
    <>
      <HeroLcpPreload />
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
