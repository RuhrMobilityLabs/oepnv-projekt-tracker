import { z } from "zod";

export const PROJECT_TYPES = [
  "neubau",
  "reaktivierung",
] as const;

export const TRANSPORT_TYPES = [
  "eisenbahn",
  "stadtbahn",
  "maglev",
  "bus",
  "oberleitungsbus",
  "seilbahn",
  "faehre",
] as const;

export const PROJECT_STATUSES = [
  "idee",
  "antrag",
  "geplant",
  "im_bau",
  "fertiggestellt",
  "abgelehnt",
] as const;

export const STATION_STATUSES = [
  "existing",
  "planned",
] as const;

const StatusEntry = z.object({
  status: z.enum([...PROJECT_STATUSES] as [string, ...string[]]),
  date: z.string(),
  note: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});

const Source = z.object({
  title: z.string(),
  url: z.string().url(),
  date: z.string().optional(),
});

const Coordinates = z.object({
  lat: z.number(),
  lng: z.number(),
});

const Station = z.object({
  name: z.string(),
  coordinates: Coordinates,
  status: z.enum([...STATION_STATUSES] as [string, ...string[]]),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectType: z.enum([...PROJECT_TYPES] as [string, ...string[]]),
  transportTypes: z.array(z.enum([...TRANSPORT_TYPES] as [string, ...string[]])),
  cities: z.array(z.string()),
  states: z.array(z.string()).optional(),
  operators: z.array(z.string()).optional(),
  description: z.string().optional(),
  statusHistory: z.array(StatusEntry),
  sources: z.array(Source),
  stations: z.array(Station).optional(),
  coordinates: Coordinates.optional(),
  lastUpdated: z.string().optional(),
  relatedProjects: z.array(z.string()).optional(),
});

export const projectArraySchema = z.array(projectSchema);

export type Project = z.infer<typeof projectSchema>;
export type ProjectSchema = Project;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type TransportType = (typeof TRANSPORT_TYPES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type StationStatus = (typeof STATION_STATUSES)[number];

export type StatusEntry = z.infer<typeof StatusEntry>;
export type Source = z.infer<typeof Source>;
export type Coordinates = z.infer<typeof Coordinates>;
export type Station = z.infer<typeof Station>;

export default projectSchema;
