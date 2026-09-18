import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { RevealFade } from "@/components/animations/RevealFade";
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[60svh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center"
    >
      <RevealFade as="p" className="text-xs uppercase tracking-[0.2em] text-gold" timing="enter">
        404
      </RevealFade>
      <AnimatedHeading
        as="h1"
        text="Page not found"
        className="mt-3 font-ui text-xl font-medium text-ink-primary"
        timing="enter"
        delay={0.08}
        splitByWords={false}
      />
      <p className="mt-4 text-base leading-relaxed text-ink-secondary">
        The page you requested does not exist or was moved.
      </p>
      <Link
        href="/"
        className="btn btn--primary mt-8"
      >
        Back to home
      </Link>
    </main>
  );
}
