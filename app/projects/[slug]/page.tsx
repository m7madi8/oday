import { ProjectDetailView } from "@/components/ProjectDetailView";
import {
  getProjectBySlug,
  getProjectGallery,
  getProjectSummary,
  projects,
} from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    return { title: "Project | OD ARCHITECTS" };
  }
  return {
    title: `${project.title} | OD ARCHITECTS`,
    description: getProjectSummary(project),
  };
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  const gallery = getProjectGallery(project);

  return <ProjectDetailView project={project} gallery={gallery} />;
}
