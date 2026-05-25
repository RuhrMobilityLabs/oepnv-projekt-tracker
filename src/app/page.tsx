import projects from "@/../generated/projects.json";
import Link from "next/link";
import ProjectTableClient from "@/components/ProjectTableClient";
import { HOME_INTRO_BODY, HOME_INTRO_TITLE } from "@/lib/siteCopy";
import { ArrowRight } from "lucide-react";
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
        <div className="space-y-4">
          <p className="max-w-6xl text-sm leading-7 text-muted sm:text-base">
            Der <b>{HOME_INTRO_TITLE}</b> {HOME_INTRO_BODY}
          </p>

          <Link
            href="/warum-bahnstrecken"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <span>Warum neue Bahnstrecken und Reaktivierungen wichtig sind</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <ProjectTableClient projects={typedProjects} />
    </main>
  );
}
