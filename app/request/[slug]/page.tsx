import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { getServiceBySlug, isValidServiceSlug } from "@/lib/data";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return { title: "Service request | OD STUDIO" };
  }
  return {
    title: `Request ${service.title} | OD STUDIO`,
    description: service.description,
  };
}

export default function ServiceRequestPage({ params }: Props) {
  if (!isValidServiceSlug(params.slug)) {
    notFound();
  }
  const service = getServiceBySlug(params.slug);
  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <main
      id="main-content"
      className="relative isolate min-h-[100svh] overflow-hidden bg-bg-primary pb-24 pt-[calc(var(--hero-nav-stack)+1.25rem)] md:pb-32 md:pt-[calc(var(--hero-nav-stack)+2rem)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px,48px_48px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-1/4 h-72 w-72 rounded-full bg-gold/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-5 md:px-10">
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 font-outfit text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
          <Link href="/#top" className="transition-colors hover:text-gold">
            Home
          </Link>
          <span aria-hidden className="text-ink-muted/50">
            /
          </span>
          <Link href="/#services" className="transition-colors hover:text-gold">
            Services
          </Link>
          <span aria-hidden className="text-ink-muted/50">
            /
          </span>
          <span className="text-ink-secondary">Request</span>
        </nav>

        <header className="mt-8 rounded-2xl border border-gold/20 bg-bg-card/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <span className="label-upper shrink-0 rounded-full border border-gold/35 bg-gold/10 px-3 py-1.5 text-gold/90">
                {service.orderLabel}
              </span>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-bg-primary/90 text-gold">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="label-upper text-gold/85">Service request</p>
                <h1 className="mt-2 font-display text-[clamp(1.85rem,4.5vw,2.75rem)] italic leading-[1.05] text-ink-primary">
                  {service.title}
                </h1>
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-[1.7] text-ink-secondary md:text-[0.9375rem]">
            {service.description}
          </p>
          <div className="mt-6 h-px w-full max-w-[5rem] bg-gradient-to-r from-gold/50 to-transparent" aria-hidden />
        </header>

        <div className="mt-8 rounded-2xl border border-white/[0.1] bg-[rgba(22,22,22,0.75)] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-[12px] md:p-9">
          <ServiceRequestForm serviceTitle={service.title} serviceSlug={service.slug} />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <Link
            href={`/projects?service=${encodeURIComponent(service.slug)}`}
            className="label-upper inline-flex items-center justify-center rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-center text-ink-primary transition-colors hover:border-gold/55 hover:bg-gold/18"
          >
            View gallery — {service.title}
          </Link>
          <Link
            href="/#services"
            className="label-upper inline-flex items-center justify-center rounded-full border border-white/[0.12] px-6 py-3 text-center text-ink-secondary transition-colors hover:border-gold/35 hover:text-ink-primary"
          >
            All services
          </Link>
        </div>
      </div>
    </main>
  );
}
