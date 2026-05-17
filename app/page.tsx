import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Process />
        <Location />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
