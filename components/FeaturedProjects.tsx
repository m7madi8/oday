"use client";

import "@/app/featured-projects.css";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FeaturedProjectCard } from "@/components/FeaturedProjectCard";
import { SectionHeader, SectionInner, SectionShell } from "@/components/SectionShell";
import {
  featuredProjectsSection,
  getFeaturedProjects,
} from "@/lib/content/featured-projects";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <SectionShell id="gallery" className="featured-projects" containOverflow={false}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <SectionInner className="featured-projects__inner">
        <ScrollReveal dramatic className="featured-projects__head">
          <SectionHeader
            eyebrow={featuredProjectsSection.eyebrow}
            title={
              <>
                {featuredProjectsSection.title}
                <span className="mt-1 block text-gold/90">{featuredProjectsSection.titleAccent}</span>
              </>
            }
            description={featuredProjectsSection.description}
          />
        </ScrollReveal>

        <div className="featured-projects__grid" aria-label="Featured projects">
          {projects.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="featured-projects__footer">
          <Link
            href={featuredProjectsSection.ctaHref}
            className="label-upper featured-projects__cta inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-7 py-3 text-ink-primary transition-[background-color,border-color,transform] hover:border-gold/65 hover:bg-gold/25 active:scale-[0.99]"
          >
            {featuredProjectsSection.ctaLabel}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </SectionInner>
    </SectionShell>
  );
}
