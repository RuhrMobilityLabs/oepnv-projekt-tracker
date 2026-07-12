import type { ComponentType } from "react";

import {
  Hammer,
  RotateCcw,
} from "lucide-react";

import type { ProjectType } from "../lib/schemas/projectSchema";

export interface ProjectTypeConfig {
  label: string;
  color: string;
  textColor: string;
  icon: ComponentType<{ className?: string }>;
}

export const PROJECT_TYPE_CONFIG: Record<
  ProjectType,
  ProjectTypeConfig
> = {
  neubau: {
    label: "Neubau",
    color: "#047857",
    textColor: "#ffffff",
    icon: Hammer,
  },

  reaktivierung: {
    label: "Reaktivierung",
    color: "#0891b2",
    textColor: "#ffffff",
    icon: RotateCcw,
  },
};
