import type { ComponentType, ReactNode } from "react";

import {
  BarChart3,
  ChevronRight,
} from "lucide-react";

import { PROJECT_TYPE_CONFIG } from "@/config/projectType";
import { STATUS_CONFIG } from "@/config/status";
import { TRANSPORT_TYPE_CONFIG } from "@/config/transportType";
import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  TRANSPORT_TYPES,
  type Project,
  type ProjectStatus,
  type ProjectType,
  type TransportType,
} from "@/lib/schemas/projectSchema";

function incrementCount<T extends string>(counts: Partial<Record<T, number>>, key: T) {
  counts[key] = (counts[key] ?? 0) + 1;
}

function getLatestStatus(project: Project): ProjectStatus | "unknown" {
  const latestStatus = project.statusHistory[project.statusHistory.length - 1]?.status as ProjectStatus | undefined;

  return latestStatus ?? "unknown";
}

function StatPill({
  icon: Icon,
  label,
  count,
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  label: string;
  count: number;
  className: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{label}</span>
      <span className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-bold tabular-nums text-foreground">
        {count}
      </span>
    </span>
  );
}

function StatCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface-elevated p-5 shadow-sm shadow-slate-950/5 backdrop-blur dark:shadow-black/10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
        {eyebrow}
      </p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

export default function ProjectOverviewStats({ projects }: { projects: Project[] }) {
  const totalProjects = projects.length;
  const projectTypeCounts: Partial<Record<ProjectType, number>> = {};
  const transportTypeCounts: Partial<Record<TransportType, number>> = {};
  const statusCounts: Partial<Record<ProjectStatus | "unknown", number>> = {};

  for (const project of projects) {
    incrementCount(projectTypeCounts, project.projectType as ProjectType);

    for (const transportType of project.transportTypes) {
      incrementCount(transportTypeCounts, transportType as TransportType);
    }

    incrementCount(statusCounts, getLatestStatus(project));
  }

  const projectTypeItems = PROJECT_TYPES.map((projectType) => {
    const config = PROJECT_TYPE_CONFIG[projectType];

    return {
      key: projectType,
      label: config.label,
      count: projectTypeCounts[projectType] ?? 0,
      icon: config.icon,
      className: config.color,
    };
  }).filter((item) => item.count > 0);

  const transportTypeItems = TRANSPORT_TYPES.map((transportType) => {
    const config = TRANSPORT_TYPE_CONFIG[transportType];

    return {
      key: transportType,
      label: config.label,
      count: transportTypeCounts[transportType] ?? 0,
      icon: config.icon,
      className: config.color,
    };
  })
    .filter((item) => item.count > 0)
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, "de"));

  const statusItems = [...PROJECT_STATUSES, "unknown" as const]
    .map((status) => {
      if (status === "unknown") {
        return {
          key: status,
          label: "Unbekannt",
          count: statusCounts[status] ?? 0,
          icon: undefined,
          className: "bg-slate-500 text-white",
        };
      }

      const config = STATUS_CONFIG[status];

      return {
        key: status,
        label: config.label,
        count: statusCounts[status] ?? 0,
        icon: config.icon,
        className: config.color,
      };
    })
    .filter((item) => item.count > 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-surface-elevated to-surface-elevated p-6 shadow-sm shadow-slate-950/5 backdrop-blur dark:shadow-black/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Überblick
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Gesamtbestand
              </h2>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 p-3 text-primary shadow-sm">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-8 flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              {totalProjects}
            </span>
            <span className="pb-2 text-sm font-medium uppercase tracking-[0.18em] text-muted">
              Projekte
            </span>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
            Der Datensatz verteilt sich auf {projectTypeItems.length} Projektarten, {" "}
            {transportTypeItems.length} Transporttypen und {statusItems.length} aktuelle
            Statuslagen.
          </p>
        </article>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <StatCard
            eyebrow="Projektarten"
            title="Projekte pro Typ"
            description="Wie sich die Vorhaben nach Neubau und Reaktivierung verteilen."
          >
            {projectTypeItems.map((item) => (
              <StatPill
                key={item.key}
                icon={item.icon}
                label={item.label}
                count={item.count}
                className={item.className}
              />
            ))}
          </StatCard>

          <StatCard
            eyebrow="Status"
            title="Aktuelle Lage"
            description="Der jeweils neueste Status je Projekt, sortiert entlang des Projektverlaufs."
          >
            {statusItems.map((item) => (
              <StatPill
                key={item.key}
                icon={item.icon}
                label={item.label}
                count={item.count}
                className={item.className}
              />
            ))}
          </StatCard>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-surface-elevated p-5 shadow-sm shadow-slate-950/5 backdrop-blur dark:shadow-black/10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Transporttypen
            </p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              Projekte pro Verkehrsmittel
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              Nur tatsächlich vorkommende Transporttypen werden gezeigt.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {transportTypeItems.map((item) => (
            <StatPill
              key={item.key}
              icon={item.icon}
              label={item.label}
              count={item.count}
              className={item.className}
            />
          ))}
        </div>
      </div>
    </section>
  );
}