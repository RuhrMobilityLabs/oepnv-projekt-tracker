import projects from "@/../generated/projects.json";
import { projectArraySchema } from "@/lib/schemas/projectSchema";
import type { Project } from "@/lib/schemas/projectSchema";
import OverviewMapWrapper from "@/components/OverviewMapWrapper";

export const metadata = {
  title: "Kartenübersicht | ÖPNV Projekt Tracker",
  description:
    "Interaktive Kartenübersicht aller ÖPNV-Projekte in Deutschland mit Standorten und Statusinformationen.",
};

export default function MapPage() {
  let typedProjects: Project[] = [];
  try {
    typedProjects = projectArraySchema.parse(projects) as Project[];
  } catch (err) {
    typedProjects = projects as Project[];
    console.error("projects.json validation error:", err);
  }

  const projectsWithCoordinates = typedProjects.filter((p) => {
    if (p.coordinates) return true;
    if (p.stations?.some((s) => s.coordinates)) return true;
    return false;
  });

  return (
    <main className="flex flex-col flex-1 min-h-0">
      <div className="relative flex-1 min-h-0">
        <OverviewMapWrapper projects={projectsWithCoordinates} />
      </div>
    </main>
  );
}
