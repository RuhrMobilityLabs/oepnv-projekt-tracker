"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/lib/schemas/projectSchema";

const OverviewMap = dynamic(() => import("@/components/OverviewMap"), { ssr: false });

export default function OverviewMapWrapper(props: { projects: Project[] }) {
  return <OverviewMap {...props} />;
}
