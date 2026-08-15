"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";
import { projectDetailPath, serviceFilterLabel, type Project } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const cardEase = [0.16, 1, 0.3, 1] as const;

interface ProjectCardProps {
  project: Project;
  index: number;
  batchAnimate: boolean;
}

export function ProjectCard({ project, index, batchAnimate }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const serviceLabel = serviceFilterLabel(project.serviceSlug);
  const shouldAnimate = batchAnimate && !reduceMotion;

  return (
    <motion.article
      id={project.id}
      className="group relative min-w-0 overflow-hidden bg-bg-card"
      initial={shouldAnimate ? { opacity: 0, y: 24 } : false}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      exit={
        reduceMotion
          ? undefined
          : { opacity: 0, scale: 0.97, transition: { duration: 0.3, ease: cardEase } }
      }
      transition={{
        duration: 0.5,
        ease: cardEase,
        delay: shouldAnimate ? index * 0.04 : 0,
      }}
    >
      <Link
        href={projectDetailPath(project)}
        className="block active:scale-[0.98] motion-reduce:active:scale-100"
        aria-label={`View ${project.title} project`}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[4/3] xl:aspect-[3/2]">
          <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
            />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-[400ms] group-hover:bg-black/[0.35]"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 z-[1] p-3.5 sm:p-4 md:p-5">
            <p className="truncate font-ui text-[8px] uppercase tracking-[0.2em] text-gold sm:tracking-[0.24em]">
              {project.tag}
            </p>
            <h2 className="mt-1.5 line-clamp-2 font-display text-[18px] font-light leading-snug text-[#f5f0e8] opacity-70 transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:opacity-100 md:text-[20px]">
              {project.title}
            </h2>
            <span
              aria-hidden
              className="project-card-gold-line mt-2 block h-px w-10 origin-left scale-x-0 bg-gold opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-hover:opacity-100"
            />
            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 sm:gap-x-3">
              <p className="shrink-0 font-ui text-[9px] uppercase tracking-[0.14em] text-ink-secondary/80 sm:tracking-[0.18em]">
                {serviceLabel}
              </p>
              {project.country && (
                <p className="min-w-0 truncate font-ui text-[9px] tracking-wide text-ink-muted">
                  {project.country}
                  {project.year ? ` · ${project.year}` : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
