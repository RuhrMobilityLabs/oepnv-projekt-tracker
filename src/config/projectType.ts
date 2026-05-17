import type { ComponentType } from "react";

import {
  Hammer,
  RotateCcw,
} from "lucide-react";

import type { ProjectType } from "../lib/schemas/projectSchema";

export interface ProjectTypeConfig {
  label: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
}

export const PROJECT_TYPE_CONFIG: Record<
  ProjectType,
  ProjectTypeConfig
> = {
  neubau: {
    label: "Neubau",
    color: "bg-emerald-600 text-white",
    icon: Hammer,
  },

  reaktivierung: {
    label: "Reaktivierung",
    color: "bg-cyan-600 text-white",
    icon: RotateCcw,
  },
};