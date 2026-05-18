import projects from "@/../generated/projects.json";
import ProjectTableClient from "@/components/ProjectTableClient";
import { HOME_INTRO_BODY, HOME_INTRO_TITLE } from "@/lib/siteCopy";
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
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <p className="max-w-6xl text-sm leading-7 text-muted sm:text-base">
          Der <b>{HOME_INTRO_TITLE}</b> {HOME_INTRO_BODY}
        </p>
      </div>
      <ProjectTableClient projects={typedProjects} />
    </main>
  );
}
