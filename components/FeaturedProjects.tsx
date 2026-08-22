"use client";

import "@/app/featured-projects.css";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FeaturedHeroProject } from "@/components/FeaturedHeroProject";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader, SectionShell } from "@/components/SectionShell";
import { featuredProjectsSection, getFeaturedProjects } from "@/lib/content/featured-projects";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  const [anchor, ...supporting] = projects;

  if (projects.length === 0) return null;

  return (
    <SectionShell id="gallery" className="featured-projects" snap={false} containOverflow={false}>
      <div className="featured-projects__viewport">
        <div className="featured-projects__head-wrap">
          <ScrollReveal dramatic className="featured-projects__head">
            <div className="section-editorial-head featured-projects__head-editorial">
              <span className="section-editorial-head__index" aria-hidden>
                03
              </span>
              <SectionHeader
                align="start"
                eyebrow={featuredProjectsSection.eyebrow}
                title={
                  <>
                    {featuredProjectsSection.title}
                    <span className="featured-projects__title-accent">
                      {featuredProjectsSection.titleAccent}
                    </span>
                  </>
                }
                description={featuredProjectsSection.description}
                className="featured-projects__section-header"
              />
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal dramatic delay={0.05} className="featured-work__grid-wrap">
          <div className="featured-work__grid" aria-label="Featured projects">
            {anchor ? <FeaturedHeroProject project={anchor} /> : null}
            {supporting.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="featured"
                index={index}
              />
            ))}
          </div>
        </ScrollReveal>

        <div className="featured-projects__foot-wrap">
          <div className="featured-projects__footer">
            <Link
              href={featuredProjectsSection.ctaHref}
              className="btn btn--primary btn--sm featured-projects__cta"
            >
              <span className="featured-projects__cta-label">{featuredProjectsSection.ctaLabel}</span>
              <ArrowUpRight className="btn__icon btn__icon--nudge featured-projects__cta-icon" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
