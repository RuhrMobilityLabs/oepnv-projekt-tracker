"use client";

import dynamic from "next/dynamic";
import type { Coordinates } from "@/lib/schemas/projectSchema";

interface JsonStation {
  name: string;
  coordinates: Coordinates;
  status: string;
}

interface ProjectMapWrapperProps {
  projectName?: string;
  projectCoordinates?: Coordinates;
  stations?: JsonStation[];
}

const ProjectMap = dynamic(() => import("@/components/ProjectMap"), { ssr: false });

export default function ProjectMapWrapper(props: ProjectMapWrapperProps) {
  return <ProjectMap {...props} />;
}
