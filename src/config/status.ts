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
  textColor: string;
  icon: ComponentType<{ className?: string }>;
}

export const STATUS_CONFIG: Record<
  ProjectStatus,
  StatusConfig
> = {
  idee: {
    label: "Idee",
    color: "#71717a",
    textColor: "#ffffff",
    icon: Lightbulb,
  },

  antrag: {
    label: "Antrag",
    color: "#3b82f6",
    textColor: "#ffffff",
    icon: FileText,
  },

  geplant: {
    label: "Geplant",
    color: "#eab308",
    textColor: "#000000",
    icon: Map,
  },

  im_bau: {
    label: "Im Bau",
    color: "#f97316",
    textColor: "#ffffff",
    icon: Construction,
  },

  fertiggestellt: {
    label: "Fertiggestellt",
    color: "#16a34a",
    textColor: "#ffffff",
    icon: CheckCircle,
  },

  abgelehnt: {
    label: "Abgelehnt",
    color: "#dc2626",
    textColor: "#ffffff",
    icon: X,
  },
};
