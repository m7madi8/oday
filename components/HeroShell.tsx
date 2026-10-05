import { Hero } from "@/components/Hero";
import { HeroLcpBackground } from "@/components/HeroLcpBackground";
import { SectionShell } from "@/components/SectionShell";

export function HeroShell() {
  return (
    <SectionShell id="top" variant="hero" className="hero--ready hero--modern">
      <Hero lcpFallback={<HeroLcpBackground />} />
    </SectionShell>
  );
}
