"use client";

import {
  getProjectCardDescription,
  getProjectCardPill,
  resolveProjectCardRatio,
  type PortfolioSectionId,
  type ProjectCardRatio,
} from "@/lib/project-card-ratio";
import {
  projectDetailPath,
  resolveProjectGalleryFormat,
  type Project,
} from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, type SyntheticEvent } from "react";

export function PortfolioProjectCard({
  project,
  section,
}: {
  project: Project;
  section: PortfolioSectionId;
}) {
  const format = resolveProjectGalleryFormat(project);
  const initialRatio = resolveProjectCardRatio(project.image, format);
  const [ratio, setRatio] = useState<ProjectCardRatio>(initialRatio);

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (!img.naturalWidth || !img.naturalHeight) return;
      const aspect = img.naturalWidth / img.naturalHeight;
      setRatio(aspect <= 0.92 ? "portrait" : "landscape");
    },
    [],
  );

  const pill = getProjectCardPill(project, section);
  const description = getProjectCardDescription(project);
  const href = projectDetailPath(project);

  if (ratio === "portrait") {
    return (
      <article
        className="project-card"
        data-ratio="portrait"
        data-section={section}
        id={project.id}
      >
        <Link href={href} className="project-card__link project-card__link--portrait">
          <div className="project-card__media project-card__media--portrait">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              className="project-card__img"
              sizes="(max-width: 640px) 85vw, 280px"
              onLoad={onImageLoad}
            />
            <div className="project-card__shade" aria-hidden />
            <div className="project-card__hover-veil" aria-hidden />
            <span className="project-card__hover-cta">
              View project
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="project-card__info project-card__info--overlay">
              <span className="project-card__pill">{pill}</span>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">{description}</p>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className="project-card"
      data-ratio="landscape"
      data-section={section}
      id={project.id}
    >
      <Link href={href} className="project-card__link project-card__link--landscape">
        <div className="project-card__media project-card__media--landscape">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="project-card__img project-card__img--zoom"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            onLoad={onImageLoad}
          />
          <div className="project-card__hover-panel" aria-hidden>
            <span className="project-card__hover-cta project-card__hover-cta--landscape">
              View project
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
        <div className="project-card__info project-card__info--below">
          <span className="project-card__pill">{pill}</span>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__desc">{description}</p>
        </div>
      </Link>
    </article>
  );
}
