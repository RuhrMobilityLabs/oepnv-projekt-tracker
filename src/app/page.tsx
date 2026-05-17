import projects from "@/../generated/projects.json";
import ProjectTableClient from "@/components/ProjectTableClient";
import type { Project } from "@/lib/schemas/projectSchema";
import { projectArraySchema } from "@/lib/schemas/projectSchema";

export default function Home() {
  let typedProjects: Project[] = [];
  try {
    typedProjects = projectArraySchema.parse(projects) as Project[];
  } catch (err) {
    typedProjects = projects as Project[]; // Fallback to untyped data to avoid breaking the app
    console.error("projects.json validation error:", err);
  }

  return (
    <main className="min-h-screen pb-16">
      <ProjectTableClient projects={typedProjects} />
    </main>
  );
}
