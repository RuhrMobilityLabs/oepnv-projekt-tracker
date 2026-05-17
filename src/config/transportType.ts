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
  icon: ComponentType<{ className?: string }>;
}

export const TRANSPORT_TYPE_CONFIG: Record<
  TransportType,
  TransportTypeConfig
> = {
  eisenbahn: {
    label: "Eisenbahn",
    color: "bg-slate-700 text-white",
    icon: Train,
  },
  stadtbahn: {
    label: "Stadtbahn",
    color: "bg-orange-600 text-white",
    icon: TramFront,
  },
  maglev: {
    label: "Magnetschwebebahn",
    color: "bg-gray-700 text-white",
    icon: Magnet,
  },
  bus: {
    label: "Bus",
    color: "bg-yellow-600 text-black",
    icon: Bus,
  },
  oberleitungsbus: {
    label: "Oberleitungsbus",
    color: "bg-lime-700 text-white",
    icon: Bus,
  },
  seilbahn: {
    label: "Seilbahn",
    color: "bg-pink-600 text-white",
    icon: CableCar,
  },
  faehre: {
    label: "Fähre",
    color: "bg-cyan-700 text-white",
    icon: Ship,
  }
};