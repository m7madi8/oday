import dynamic from "next/dynamic";
import "@/app/home-editorial.css";
import { HeroShell } from "@/components/HeroShell";
import { HeroCarouselPrefetch } from "@/components/HeroCarouselPrefetch";

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
      <HeroCarouselPrefetch />
      <CaseStudiesCta />
      <main id="main-content">
        <HeroShell />
        <HomeSectionRule />
        <FeaturedProjects />
        <Services />
        <Contact />
      </main>
    </>
  );
}
