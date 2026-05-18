import projects from "@/../generated/projects.json";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import type { Project } from "@/lib/schemas/projectSchema";
import { Metadata } from "next";

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects.find(async (p) => p.id === (await params).id) as Project | undefined;

  if (!project) {
    return {
      title: "ÖPNV Projekt Tracker",
    };
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "/"}projects/${project.id}`;

  return {
    title: `${project.name} | ÖPNV Projekt Tracker`,
    description: project.description || `${project.name}: Informationen und Status zum ÖPNV-Projekt auf dem ÖPNV Projekt Tracker.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.name} | ÖPNV Projekt Tracker`,
      description: project.description || `${project.name}: Informationen und Status zum ÖPNV-Projekt auf dem ÖPNV Projekt Tracker.`,
      url: url,
      type: "article",
      locale: "de_DE",
      siteName: "ÖPNV Projekt Tracker",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ÖPNV Projekt Tracker`,
      description: project.description || `${project.name}: Informationen und Status zum ÖPNV-Projekt auf dem ÖPNV Projekt Tracker.`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id) as Project | undefined;

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-16 pt-4">
      <ProjectDetail project={project} />
    </main>
  );
}