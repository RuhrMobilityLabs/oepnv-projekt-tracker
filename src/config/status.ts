import type { ComponentType } from "react";

import {
  CheckCircle,
  Construction,
  FileText,
  Lightbulb,
  Map,
  X,
} from "lucide-react";

import type { ProjectStatus } from "../lib/schemas/projectSchema";

export interface StatusConfig {
  label: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
}

export const STATUS_CONFIG: Record<
  ProjectStatus,
  StatusConfig
> = {
  idee: {
    label: "Idee",
    color: "bg-zinc-500 text-white",
    icon: Lightbulb,
  },

  antrag: {
    label: "Antrag",
    color: "bg-blue-500 text-white",
    icon: FileText,
  },

  geplant: {
    label: "Geplant",
    color: "bg-yellow-500 text-black",
    icon: Map,
  },

  im_bau: {
    label: "Im Bau",
    color: "bg-orange-500 text-white",
    icon: Construction,
  },

  fertiggestellt: {
    label: "Fertiggestellt",
    color: "bg-green-600 text-white",
    icon: CheckCircle,
  },

  abgelehnt: {
    label: "Abgelehnt",
    color: "bg-red-600 text-white",
    icon: X,
  },
};