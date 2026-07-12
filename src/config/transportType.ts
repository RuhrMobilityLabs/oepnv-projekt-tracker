import type { ComponentType } from "react";

import {
  Bus,
  CableCar,
  Ship,
  TramFront,
  Train,
  Magnet,
} from "lucide-react";

import type { TransportType } from "../lib/schemas/projectSchema";

export interface TransportTypeConfig {
  label: string;
  color: string;
  textColor: string;
  icon: ComponentType<{ className?: string }>;
}

export const TRANSPORT_TYPE_CONFIG: Record<
  TransportType,
  TransportTypeConfig
> = {
  eisenbahn: {
    label: "Eisenbahn",
    color: "#334155",
    textColor: "#ffffff",
    icon: Train,
  },
  stadtbahn: {
    label: "Stadtbahn",
    color: "#ea580c",
    textColor: "#ffffff",
    icon: TramFront,
  },
  maglev: {
    label: "Magnetschwebebahn",
    color: "#374151",
    textColor: "#ffffff",
    icon: Magnet,
  },
  bus: {
    label: "Bus",
    color: "#ca8a04",
    textColor: "#000000",
    icon: Bus,
  },
  oberleitungsbus: {
    label: "Oberleitungsbus",
    color: "#4d7c0f",
    textColor: "#ffffff",
    icon: Bus,
  },
  seilbahn: {
    label: "Seilbahn",
    color: "#db2777",
    textColor: "#ffffff",
    icon: CableCar,
  },
  faehre: {
    label: "Fähre",
    color: "#155e75",
    textColor: "#ffffff",
    icon: Ship,
  }
};
