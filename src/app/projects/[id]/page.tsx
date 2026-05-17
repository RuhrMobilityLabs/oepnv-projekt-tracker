import projects from "@/../generated/projects.json";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import type { Project } from "@/lib/schemas/projectSchema";

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
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