import projects from "@/../generated/projects.json";
import type { Project } from "@/lib/schemas/projectSchema";
import ProjectEditor from "./ProjectEditor";

export default function EditorPage() {
  const typedProjects = projects as Project[];

  return (
    <main className="min-h-screen pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Projekt Editor</h1>
        <ProjectEditor projects={typedProjects} />
      </div>
    </main>
  );
}
