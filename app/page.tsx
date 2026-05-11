import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Process />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
