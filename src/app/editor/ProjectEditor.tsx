"use client";

import { useState, useMemo } from "react";
import type { Project } from "@/lib/schemas/projectSchema";
import { projectSchema } from "@/lib/schemas/projectSchema";
import {
  PROJECT_TYPES,
  TRANSPORT_TYPES,
  PROJECT_STATUSES,
  STATION_STATUSES,
} from "@/lib/schemas/projectSchema";
import { PROJECT_TYPE_CONFIG } from "@/config/projectType";
import { TRANSPORT_TYPE_CONFIG } from "@/config/transportType";
import { STATUS_CONFIG } from "@/config/status";
import {
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const emptyProject = {
  id: "",
  name: "",
  projectType: "neubau" as const,
  transportTypes: [] as string[],
  cities: [] as string[],
  states: [] as string[],
  operators: [] as string[],
  description: "",
  statusHistory: [] as {
    status: string;
    date: string;
    note: string;
    sourceUrl: string;
  }[],
  sources: [] as { title: string; url: string; date: string }[],
  stations: [] as {
    name: string;
    coordinates: { lat: number; lng: number };
    status: string;
  }[],
  coordinates: { lat: 0, lng: 0 },
  lastUpdated: new Date().toISOString().split("T")[0],
  relatedProjects: [] as string[],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00e4\u00f6\u00fc\u00df]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDateInput(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toISOString().split("T")[0];
}

function isValidDate(value: string): boolean {
  if (!value) return true;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    if (m < 1 || m > 12 || d < 1 || d > 31) return false;
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }
  return !isNaN(new Date(value).getTime());
}

type ValidationEntry = {
  field: string;
  message: string;
};

function FieldError({
  field,
  errors,
}: {
  field: string;
  errors: ValidationEntry[];
}) {
  const err = errors.find((e) => e.field === field)?.message;
  return err ? <p className="mt-1 text-xs text-red-500">{err}</p> : null;
}

export default function ProjectEditor({
  projects,
}: {
  projects: Project[];
}) {
  const [selectedId, setSelectedId] = useState<string>("__new__");
  const [project, setProject] = useState<Record<string, unknown>>({ ...emptyProject });
  const [validationErrors, setValidationErrors] = useState<ValidationEntry[]>([]);
  const [zodErrors, setZodErrors] = useState<string[]>([]);

  const allProjectIds = useMemo(() => new Set(projects.map((p) => p.id)), [projects]);

  function loadProject(id: string) {
    if (id === "__new__") {
      setProject({ ...emptyProject, lastUpdated: new Date().toISOString().split("T")[0] });
    } else {
      const found = projects.find((p) => p.id === id);
      if (found) {
        setProject(JSON.parse(JSON.stringify(found)) as Record<string, unknown>);
      }
    }
    setValidationErrors([]);
    setZodErrors([]);
  }

  function updateField(key: string, value: unknown) {
    setProject((prev) => ({ ...prev, [key]: value }));
  }

  function addArrayItem(key: string) {
    setProject((prev) => {
      const arr = (prev[key] as unknown[]) || [];
      return { ...prev, [key]: [...arr, ""] };
    });
  }

  function removeArrayItem(key: string, index: number) {
    setProject((prev) => {
      const arr = (prev[key] as unknown[]) || [];
      return { ...prev, [key]: arr.filter((_, i) => i !== index) };
    });
  }

  function updateArrayItem(key: string, index: number, value: string) {
    setProject((prev) => {
      const arr = [...((prev[key] as string[]) || [])];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  }

  function addStatusEntry() {
    setProject((prev) => ({
      ...prev,
      statusHistory: [
        ...((prev.statusHistory as unknown[]) || []),
        { status: "idee", date: "", note: "", sourceUrl: "" },
      ],
    }));
  }

  function updateStatusEntry(index: number, field: string, value: string) {
    setProject((prev) => {
      const arr = [...((prev.statusHistory as Record<string, unknown>[]) || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, statusHistory: arr };
    });
  }

  function removeStatusEntry(index: number) {
    setProject((prev) => {
      const arr = (prev.statusHistory as Record<string, unknown>[]) || [];
      return { ...prev, statusHistory: arr.filter((_, i) => i !== index) };
    });
  }

  function addSource() {
    setProject((prev) => ({
      ...prev,
      sources: [...((prev.sources as unknown[]) || []), { title: "", url: "", date: "" }],
    }));
  }

  function updateSource(index: number, field: string, value: string) {
    setProject((prev) => {
      const arr = [...((prev.sources as Record<string, unknown>[]) || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, sources: arr };
    });
  }

  function removeSource(index: number) {
    setProject((prev) => {
      const arr = (prev.sources as Record<string, unknown>[]) || [];
      return { ...prev, sources: arr.filter((_, i) => i !== index) };
    });
  }

  function addStation() {
    setProject((prev) => ({
      ...prev,
      stations: [
        ...((prev.stations as unknown[]) || []),
        { name: "", coordinates: { lat: 0, lng: 0 }, status: "planned" },
      ],
    }));
  }

  function updateStation(index: number, field: string, value: unknown) {
    setProject((prev) => {
      const arr = [...((prev.stations as Record<string, unknown>[]) || [])];
      if (field === "lat" || field === "lng") {
        const coords = { ...((arr[index].coordinates as Record<string, unknown>) || {}), [field]: value };
        arr[index] = { ...arr[index], coordinates: coords };
      } else {
        arr[index] = { ...arr[index], [field]: value };
      }
      return { ...prev, stations: arr };
    });
  }

  function removeStation(index: number) {
    setProject((prev) => {
      const arr = (prev.stations as Record<string, unknown>[]) || [];
      return { ...prev, stations: arr.filter((_, i) => i !== index) };
    });
  }

  function addRelated() {
    setProject((prev) => {
      const arr = (prev.relatedProjects as string[]) || [];
      return { ...prev, relatedProjects: [...arr, ""] };
    });
  }

  function updateRelated(index: number, value: string) {
    setProject((prev) => {
      const arr = [...((prev.relatedProjects as string[]) || [])];
      arr[index] = value;
      return { ...prev, relatedProjects: arr };
    });
  }

  function removeRelated(index: number) {
    setProject((prev) => {
      const arr = (prev.relatedProjects as string[]) || [];
      return { ...prev, relatedProjects: arr.filter((_, i) => i !== index) };
    });
  }

  function validateNow(): boolean {
    const errors: ValidationEntry[] = [];

    if (!project.name) {
      errors.push({ field: "name", message: "Name ist erforderlich" });
    }

    if (!project.id) {
      errors.push({ field: "id", message: "ID ist erforderlich" });
    } else if (!/^[a-z0-9-]+$/.test(project.id as string)) {
      errors.push({ field: "id", message: "ID darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten" });
    }

    const transportTypes = project.transportTypes as string[];
    if (!transportTypes || transportTypes.length === 0) {
      errors.push({ field: "transportTypes", message: "Mindestens ein Verkehrsmittel erforderlich" });
    }

    const cities = project.cities as string[];
    if (!cities || cities.length === 0) {
      errors.push({ field: "cities", message: "Mindestens eine Stadt erforderlich" });
    }

    const statusHistory = project.statusHistory as { status: string; date: string }[];
    if (!statusHistory || statusHistory.length === 0) {
      errors.push({ field: "statusHistory", message: "Mindestens ein Status-Eintrag erforderlich" });
    } else {
      statusHistory.forEach((entry, i) => {
        if (!entry.date) {
          errors.push({ field: `statusHistory[${i}].date`, message: "Datum erforderlich" });
        } else if (!isValidDate(entry.date)) {
          errors.push({ field: `statusHistory[${i}].date`, message: `Ungültiges Datum: ${entry.date}` });
        }
      });
    }

    const sources = project.sources as { title: string; url: string }[];
    if (!sources || sources.length === 0) {
      errors.push({ field: "sources", message: "Mindestens eine Quelle erforderlich" });
    } else {
      sources.forEach((entry, i) => {
        if (!entry.title) errors.push({ field: `sources[${i}].title`, message: "Titel erforderlich" });
        if (!entry.url) errors.push({ field: `sources[${i}].url`, message: "URL erforderlich" });
      });
    }

    const stations = project.stations as { name: string }[];
    if (stations) {
      stations.forEach((entry, i) => {
        if (!entry.name) errors.push({ field: `stations[${i}].name`, message: "Name erforderlich" });
      });
    }

    if (project.lastUpdated && !isValidDate(project.lastUpdated as string)) {
      errors.push({ field: "lastUpdated", message: `Ungültiges Datum: ${project.lastUpdated}` });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }

  function handleSave() {
    const cleaned = JSON.parse(JSON.stringify(project));

    if (cleaned.cities) cleaned.cities = cleaned.cities.filter(Boolean);
    if (cleaned.states) {
      cleaned.states = cleaned.states.filter(Boolean);
      if (cleaned.states.length === 0) delete cleaned.states;
    }
    if (cleaned.operators) {
      cleaned.operators = cleaned.operators.filter(Boolean);
      if (cleaned.operators.length === 0) delete cleaned.operators;
    }
    if (cleaned.relatedProjects) {
      cleaned.relatedProjects = cleaned.relatedProjects.filter(Boolean);
      if (cleaned.relatedProjects.length === 0) delete cleaned.relatedProjects;
    }
    if (cleaned.stations && cleaned.stations.length === 0) delete cleaned.stations;
    if (!cleaned.description) delete cleaned.description;
    if (!cleaned.lastUpdated) delete cleaned.lastUpdated;
    if (cleaned.coordinates && cleaned.coordinates.lat === 0 && cleaned.coordinates.lng === 0) {
      delete cleaned.coordinates;
    }

    if (cleaned.stations) {
      cleaned.stations = cleaned.stations.filter((s: { name: string }) => s.name);
    }

    const result = projectSchema.safeParse(cleaned);
    if (!result.success) {
      const zodMessages = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      setZodErrors(zodMessages);
      return;
    }
    setZodErrors([]);

    const ok = validateNow();
    if (!ok) return;

    const jsonStr = JSON.stringify(result.data, null, 2);
    const filename = `${cleaned.id}.json`;
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const projectType = (project.projectType as string) || "neubau";
  const transportTypes = (project.transportTypes as string[]) || [];
  const cities = (project.cities as string[]) || [];
  const states = (project.states as string[]) || [];
  const operators = (project.operators as string[]) || [];
  const statusHistory = (project.statusHistory as Record<string, unknown>[]) || [];
  const sources = (project.sources as Record<string, unknown>[]) || [];
  const stations = (project.stations as Record<string, unknown>[]) || [];
  const relatedProjects = (project.relatedProjects as string[]) || [];

  return (
    <div className="space-y-8">
      <div>
        Der Projekt Editor ermöglicht das Erstellen und Bearbeiten von Projekten.
        Alle Änderungen werden lokal im Browser vorgenommen und können über den
        &quot;JSON erstellen &amp; herunterladen&quot; Button als JSON-Datei exportiert werden,
        um sie später per Merge Request in das Repository zu laden.
      </div>
      {/* Project Selector */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <label className="text-sm font-semibold text-foreground">Projekt auswählen</label>
        <p className="mb-2 mt-1 text-sm text-muted">
          Bereits existierende Projekte können hier geladen und bearbeitet werden.
          Um ein neues Projekt zu erstellen, wähle &quot;Neues Projekt&quot; aus.
        </p>
        <select
          className="mt-2 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            loadProject(e.target.value);
          }}
        >
          <option value="__new__">— Neues Projekt —</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </section>

      {/* Basic Info */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Basisdaten</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Name *</label>
            <input
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              value={project.name as string}
              onChange={(e) => {
                const name = e.target.value;
                updateField("name", name);
                if (selectedId === "__new__") {
                  updateField("id", slugify(name));
                }
              }}
            />
            <FieldError field="name" errors={validationErrors} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">ID *</label>
            <input
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              value={project.id as string}
              onChange={(e) => updateField("id", e.target.value)}
            />
            <FieldError field="id" errors={validationErrors} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Projekttyp *</label>
            <select
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              value={projectType}
              onChange={(e) => updateField("projectType", e.target.value)}
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PROJECT_TYPE_CONFIG[t]?.label || t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Zuletzt aktualisiert</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              value={formatDateInput(project.lastUpdated as string)}
              onChange={(e) => updateField("lastUpdated", e.target.value)}
            />
            <FieldError field="lastUpdated" errors={validationErrors} />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-foreground">Beschreibung</label>
          <textarea
            className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
            value={project.description as string}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>
      </section>

      {/* Transport Types */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Verkehrsmittel *</h2>
        <FieldError field="transportTypes" errors={validationErrors} />
        <div className="flex flex-wrap gap-3">
          {TRANSPORT_TYPES.map((t) => {
            const config = TRANSPORT_TYPE_CONFIG[t];
            const selected = transportTypes.includes(t);
            return (
              <label
                key={t}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selected}
                  onChange={() => {
                    const next = selected
                      ? transportTypes.filter((x) => x !== t)
                      : [...transportTypes, t];
                    updateField("transportTypes", next);
                  }}
                />
                {config?.label || t}
              </label>
            );
          })}
        </div>
      </section>

      {/* Cities */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Städte *</h2>
          <button
            type="button"
            onClick={() => addArrayItem("cities")}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Hinzufügen
          </button>
        </div>
        <FieldError field="cities" errors={validationErrors} />
        <div className="mt-3 space-y-2">
          {cities.map((city, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                value={city}
                onChange={(e) => updateArrayItem("cities", i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeArrayItem("cities", i)}
                className="rounded-full p-1.5 text-muted transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* States (optional) */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Bundesländer</h2>
          <button
            type="button"
            onClick={() => addArrayItem("states")}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Hinzufügen
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {states.map((state, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                value={state}
                onChange={(e) => updateArrayItem("states", i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeArrayItem("states", i)}
                className="rounded-full p-1.5 text-muted transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Operators (optional) */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Betreiber</h2>
          <button
            type="button"
            onClick={() => addArrayItem("operators")}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Hinzufügen
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {operators.map((op, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                value={op}
                onChange={(e) => updateArrayItem("operators", i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeArrayItem("operators", i)}
                className="rounded-full p-1.5 text-muted transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Coordinates (optional) */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Koordinaten (optional)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Breitengrad</label>
            <input
              type="number"
              step="any"
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              value={(project.coordinates as { lat: number })?.lat ?? ""}
              onChange={(e) => {
                const coords = (project.coordinates as { lat: number; lng: number }) || { lat: 0, lng: 0 };
                updateField("coordinates", { ...coords, lat: parseFloat(e.target.value) || 0 });
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Längengrad</label>
            <input
              type="number"
              step="any"
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              value={(project.coordinates as { lng: number })?.lng ?? ""}
              onChange={(e) => {
                const coords = (project.coordinates as { lat: number; lng: number }) || { lat: 0, lng: 0 };
                updateField("coordinates", { ...coords, lng: parseFloat(e.target.value) || 0 });
              }}
            />
          </div>
        </div>
      </section>

      {/* Status History */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Statusverlauf *</h2>
          <button
            type="button"
            onClick={addStatusEntry}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Eintrag hinzufügen
          </button>
        </div>
        <FieldError field="statusHistory" errors={validationErrors} />
        <div className="mt-3 space-y-4">
          {statusHistory.map((entry, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-background/50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Eintrag {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeStatusEntry(i)}
                  className="rounded-full p-1 text-muted transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-foreground">Status</label>
                  <select
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={entry.status as string}
                    onChange={(e) => updateStatusEntry(i, "status", e.target.value)}
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_CONFIG[s]?.label || s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Datum *</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formatDateInput(entry.date as string)}
                    onChange={(e) => updateStatusEntry(i, "date", e.target.value)}
                  />
                  <FieldError field={`statusHistory[${i}].date`} errors={validationErrors} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-foreground">Notiz</label>
                  <input
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={entry.note as string}
                    onChange={(e) => updateStatusEntry(i, "note", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-foreground">Quellen-URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={entry.sourceUrl as string}
                    onChange={(e) => updateStatusEntry(i, "sourceUrl", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Quellen *</h2>
          <button
            type="button"
            onClick={addSource}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Quelle hinzufügen
          </button>
        </div>
        <FieldError field="sources" errors={validationErrors} />
        <div className="mt-3 space-y-4">
          {sources.map((source, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-background/50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Quelle {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeSource(i)}
                  className="rounded-full p-1 text-muted transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-foreground">Titel *</label>
                  <input
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={source.title as string}
                    onChange={(e) => updateSource(i, "title", e.target.value)}
                  />
                  <FieldError field={`sources[${i}].title`} errors={validationErrors} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">URL *</label>
                  <input
                    type="url"
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={source.url as string}
                    onChange={(e) => updateSource(i, "url", e.target.value)}
                  />
                  <FieldError field={`sources[${i}].url`} errors={validationErrors} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Datum</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formatDateInput(source.date as string)}
                    onChange={(e) => updateSource(i, "date", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stations (optional) */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Stationen (optional)</h2>
          <button
            type="button"
            onClick={addStation}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Station hinzufügen
          </button>
        </div>
        <div className="mt-3 space-y-4">
          {stations.map((station, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-background/50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Station {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeStation(i)}
                  className="rounded-full p-1 text-muted transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-foreground">Name *</label>
                  <input
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={station.name as string}
                    onChange={(e) => updateStation(i, "name", e.target.value)}
                  />
                  <FieldError field={`stations[${i}].name`} errors={validationErrors} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Status</label>
                  <select
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={station.status as string}
                    onChange={(e) => updateStation(i, "status", e.target.value)}
                  >
                    {STATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s === "existing" ? "Bestehend" : "Geplant"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Breitengrad</label>
                  <input
                    type="number"
                    step="any"
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={(station.coordinates as { lat: number })?.lat ?? 0}
                    onChange={(e) => updateStation(i, "lat", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Längengrad</label>
                  <input
                    type="number"
                    step="any"
                    className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    value={(station.coordinates as { lng: number })?.lng ?? 0}
                    onChange={(e) => updateStation(i, "lng", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Projects */}
      <section className="rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Verwandte Projekte</h2>
          <button
            type="button"
            onClick={addRelated}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" /> Hinzufügen
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {relatedProjects.map((rel, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                value={rel}
                onChange={(e) => updateRelated(i, e.target.value)}
              >
                <option value="">— Auswählen —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeRelated(i)}
                className="rounded-full p-1.5 text-muted transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Zod Errors */}
      {zodErrors.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <strong>Validierungsfehler:</strong>
            <ul className="ml-4 mt-1 list-disc">
              {zodErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Validation errors summary */}
      {validationErrors.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <strong>Bitte korrigieren Sie folgende Fehler:</strong>
            <ul className="ml-4 mt-1 list-disc">
              {validationErrors.map((err, i) => (
                <li key={i}>{err.field}: {err.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          {selectedId === "__new__" ? "JSON erstellen & herunterladen" : "JSON speichern & herunterladen"}
        </button>
      </div>
    </div>
  );
}
