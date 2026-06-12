"use client";

import {
  exteriorTypeLabel,
  projectDetailPath,
  serviceFilterLabel,
  type Project,
} from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FeaturedProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const displayIndex = project.orderLabel ?? String(index + 1).padStart(2, "0");
  const serviceLabel = serviceFilterLabel(project.serviceSlug);
  const categoryLabel =
    project.serviceSlug === "exterior" && project.exteriorType
      ? exteriorTypeLabel(project.exteriorType)
      : project.tag;

  return (
    <article className="feat-card" data-section={project.serviceSlug} id={project.id}>
      <Link
        href={projectDetailPath(project)}
        className="feat-card__link"
        aria-label={`View project ${project.title}`}
      >
        <div className="feat-card__media">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="feat-card__img"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="feat-card__shade" aria-hidden />
          <div className="feat-card__bar">
            <span className="feat-card__num">{displayIndex}</span>
            <div className="feat-card__copy">
              <p className="feat-card__tag">{categoryLabel}</p>
              <h3 className="feat-card__title">{project.title}</h3>
              <p className="feat-card__service">{serviceLabel}</p>
            </div>
            <span className="feat-card__arrow" aria-hidden>
              <ArrowUpRight strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
