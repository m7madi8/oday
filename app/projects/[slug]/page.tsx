import { ProjectDetailView } from "@/components/ProjectDetailView";
import { getProjectBySlug, getProjectSiblings, getProjectSummary, projects } from "@/lib/data";
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

  const rawSiblings = getProjectSiblings(project);
  const siblings = rawSiblings
    ? {
        previous: {
          id: rawSiblings.previous.id,
          title: rawSiblings.previous.title,
          country: rawSiblings.previous.country,
        },
        next: {
          id: rawSiblings.next.id,
          title: rawSiblings.next.title,
          country: rawSiblings.next.country,
        },
        position: rawSiblings.position,
        total: rawSiblings.total,
      }
    : null;

  return <ProjectDetailView project={project} siblings={siblings} />;
}
