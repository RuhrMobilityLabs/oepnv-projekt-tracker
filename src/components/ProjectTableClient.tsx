"use client";

import { useMemo, useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Filter,
  ListFilter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import type { Project } from "@/lib/schemas/projectSchema";
import { PROJECT_TYPE_CONFIG } from "@/config/projectType";
import { PROJECT_STATUSES } from "@/lib/schemas/projectSchema";
import { TRANSPORT_TYPE_CONFIG } from "@/config/transportType";
import { STATUS_CONFIG } from "@/config/status";
import { formatLocalDate } from "@/lib/formatDate";
import { getLatestStatus } from "@/lib/getLatestStatus";

type SortKey = "name" | "projectType" | "transportTypes" | "cities" | "status" | "lastUpdated";
type SortDirection = "asc" | "desc" | undefined;
type FilterColumn = "projectType" | "transportTypes" | "status";

function compareText(left: string, right: string) {
  return left.localeCompare(right, "de", { sensitivity: "base" });
}

function compareDate(left: string | undefined, right: string | undefined) {
  if (!left && !right) return 0;
  if (!left) return 1;
  if (!right) return -1;

  const leftTime = Date.parse(left);
  const rightTime = Date.parse(right);

  if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) return 0;
  if (Number.isNaN(leftTime)) return 1;
  if (Number.isNaN(rightTime)) return -1;

  return leftTime - rightTime;
}

function getProjectTypeLabel(project: Project) {
  return PROJECT_TYPE_CONFIG[project.projectType as keyof typeof PROJECT_TYPE_CONFIG]?.label || project.projectType;
}

function getTransportLabel(project: Project) {
  return project.transportTypes
    .map((transportType) => TRANSPORT_TYPE_CONFIG[transportType as keyof typeof TRANSPORT_TYPE_CONFIG]?.label || transportType)
    .join(" · ");
}

function getCityLabel(project: Project) {
  return (project.cities || []).join(" · ");
}

function ToggleBadge({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-foreground hover:border-primary hover:text-primary"}`}
    >
      <span>{label}</span>
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${active ? "bg-primary-foreground/20 text-inherit" : "bg-background text-foreground"}`}>
        {count}
      </span>
    </button>
  );
}

function SortButton({
  active,
  direction,
}: {
  active: boolean;
  direction?: SortDirection;
}) {
  if (!active || !direction) {
    return <ListFilter className="h-3.5 w-3.5 text-muted" />;
  }

  return direction === "asc" ? <SortAsc className="h-3.5 w-3.5 text-primary" /> : <SortDesc className="h-3.5 w-3.5 text-primary" />;
}

function ColumnFilterDropdown({
  label,
  column,
  items,
  selectedValues,
  onToggleValue,
  onClear,
}: {
  label: string;
  column: FilterColumn;
  items: Array<{ value: string; label: string; count: number }>;
  selectedValues: string[];
  onToggleValue: (column: FilterColumn, value: string) => void;
  onClear: (column: FilterColumn) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 0 });

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node | null;
      const insideButton = buttonRef.current?.contains(target) ?? false;
      const insideDropdown = dropdownRef.current?.contains(target) ?? false;
      if (!insideButton && !insideDropdown) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [open]);

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const left = Math.max(8, rect.left + window.scrollX);
    const top = rect.bottom + window.scrollY + 8;
    setPos({ left, top, width: rect.width });
  }, [open]);

  const summaryClass = `inline-flex list-none items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition [&::-webkit-details-marker]:hidden ${
    selectedValues.length > 0 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-muted hover:border-primary hover:text-primary"
  }`;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={summaryClass}
      >
        <Filter className="h-3.5 w-3.5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            role="dialog"
            aria-label={`${label}-Filter`}
            style={{ left: pos.left, top: pos.top, position: "absolute", zIndex: 9999, minWidth: Math.max(240, pos.width) }}
            className="rounded-2xl border border-border bg-surface-elevated p-3 shadow-xl shadow-slate-950/10 backdrop-blur dark:shadow-black/30"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Filter</p>
                <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClear(column);
                  setOpen(false);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-[11px] font-semibold text-muted transition hover:border-primary hover:text-primary"
              >
                <X className="h-3 w-3" />
                Zurücksetzen
              </button>
            </div>

            <div className="max-h-56 overflow-auto pr-1">
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <ToggleBadge
                    key={item.value}
                    label={item.label}
                    count={item.count}
                    active={selectedValues.includes(item.value)}
                    onClick={() => onToggleValue(column, item.value)}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default function ProjectTableClient({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [selectedTransportTypes, setSelectedTransportTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const hay = [p.id, p.name, p.description || "", ...(p.cities || []), ...(p.operators || [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [projects, query]);

  const projectTypeItems = useMemo(() => {
    const counts = new Map<string, number>();

    for (const project of searched) {
      counts.set(project.projectType, (counts.get(project.projectType) || 0) + 1);
    }

    return Object.entries(PROJECT_TYPE_CONFIG)
      .map(([value, config]) => ({ value, label: config.label, count: counts.get(value) || 0 }))
      .filter((item) => item.count > 0);
  }, [searched]);

  const transportTypeItems = useMemo(() => {
    const counts = new Map<string, number>();

    for (const project of searched) {
      for (const transportType of project.transportTypes) {
        counts.set(transportType, (counts.get(transportType) || 0) + 1);
      }
    }

    return Object.entries(TRANSPORT_TYPE_CONFIG)
      .map(([value, config]) => ({ value, label: config.label, count: counts.get(value) || 0 }))
      .filter((item) => item.count > 0)
      .sort((left, right) => right.count - left.count || compareText(left.label, right.label));
  }, [searched]);

  const statusItems = useMemo(() => {
    const counts = new Map<string, number>();

    for (const project of searched) {
      counts.set(getLatestStatus(project), (counts.get(getLatestStatus(project)) || 0) + 1);
    }

    return [...PROJECT_STATUSES, "unknown"]
      .map((value) => ({
        value,
        label: value === "unknown" ? "Unbekannt" : STATUS_CONFIG[value as keyof typeof STATUS_CONFIG]?.label || value,
        count: counts.get(value) || 0,
      }))
      .filter((item) => item.count > 0);
  }, [searched]);

  const toggleSelection = (setter: Dispatch<SetStateAction<string[]>>, value: string) => {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const clearSelection = (setter: Dispatch<SetStateAction<string[]>>) => {
    setter([]);
  };

  const visible = useMemo(() => {
    const categoryFiltered = searched.filter((project) => {
      const typeMatch = selectedProjectTypes.length === 0 || selectedProjectTypes.includes(project.projectType);
      const transportMatch =
        selectedTransportTypes.length === 0 ||
        project.transportTypes.some((transportType) => selectedTransportTypes.includes(transportType));
      const statusMatch =
        selectedStatuses.length === 0 || selectedStatuses.includes(getLatestStatus(project));

      return typeMatch && transportMatch && statusMatch;
    });

    if (!sortDirection) return categoryFiltered;

    const sorted = [...categoryFiltered].sort((left, right) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      switch (sortKey) {
        case "name":
          return compareText(left.name, right.name) * direction;
        case "projectType":
          return compareText(getProjectTypeLabel(left), getProjectTypeLabel(right)) * direction;
        case "transportTypes":
          return compareText(getTransportLabel(left), getTransportLabel(right)) * direction;
        case "cities":
          return compareText(getCityLabel(left), getCityLabel(right)) * direction;
        case "status":
          return (
            compareText(
              STATUS_CONFIG[getLatestStatus(left) as keyof typeof STATUS_CONFIG]?.label || getLatestStatus(left),
              STATUS_CONFIG[getLatestStatus(right) as keyof typeof STATUS_CONFIG]?.label || getLatestStatus(right)
            ) * direction
          );
        case "lastUpdated":
          return compareDate(left.lastUpdated, right.lastUpdated) * direction;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searched, selectedProjectTypes, selectedStatuses, selectedTransportTypes, sortDirection, sortKey]);

  const activeFilters = selectedProjectTypes.length + selectedTransportTypes.length + selectedStatuses.length;

  const handleSort = (key: SortKey) => {
    setSortKey((currentKey) => {
      if (currentKey === key) {
        setSortDirection((currentDirection) => {
          if (!currentDirection) return "asc";
          if (currentDirection === "asc") return "desc";
          return undefined;
        });
        return currentKey;
      }

      setSortDirection(key === "lastUpdated" ? "desc" : "asc");
      return key;
    });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 rounded-3xl border border-border bg-surface-elevated p-3.5 shadow-sm shadow-slate-950/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:shadow-black/10">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <input
            aria-label="Projekte durchsuchen"
            placeholder="Nach Name, Ort, Betreiber oder ID suchen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-ring sm:max-w-xl"
          />
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground sm:self-center">
            {visible.length} Ergebnisse
          </div>
          <div className="ml-2 flex flex-wrap items-center gap-2">
            {selectedProjectTypes.map((val) => (
              <span key={val} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                {PROJECT_TYPE_CONFIG[val as keyof typeof PROJECT_TYPE_CONFIG]?.label || val}
              </span>
            ))}
            {selectedTransportTypes.map((val) => (
              <span key={val} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                {TRANSPORT_TYPE_CONFIG[val as keyof typeof TRANSPORT_TYPE_CONFIG]?.label || val}
              </span>
            ))}
            {selectedStatuses.map((val) => (
              <span key={val} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                {val === "unknown" ? "Unbekannt" : STATUS_CONFIG[val as keyof typeof STATUS_CONFIG]?.label || val}
              </span>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted">
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={() => {
                clearSelection(setSelectedProjectTypes);
                clearSelection(setSelectedTransportTypes);
                clearSelection(setSelectedStatuses);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-primary hover:text-primary"
            >
              <X className="h-3.5 w-3.5" />
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      <div className="overflow-visible rounded-3xl border border-border bg-surface-elevated shadow-[0_18px_60px_-36px_rgba(15,23,42,0.45)] dark:shadow-black/30">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background/40 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              <tr>
                <th className="px-3 py-3.5 sm:px-4">
                    <button type="button" onClick={() => handleSort("name")} className="inline-flex items-center gap-1.5 transition hover:text-primary">
                      Name
                      <SortButton active={sortKey === "name" && sortDirection != null} direction={sortKey === "name" ? sortDirection : undefined} />
                    </button>
                </th>
                <th className="px-3 py-3.5 sm:px-4">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleSort("projectType")} className="inline-flex items-center gap-1.5 transition hover:text-primary">
                      Typ
                      <SortButton active={sortKey === "projectType" && sortDirection != null} direction={sortKey === "projectType" ? sortDirection : undefined} />
                    </button>
                    <ColumnFilterDropdown
                      label="Typ"
                      column="projectType"
                      items={projectTypeItems}
                      selectedValues={selectedProjectTypes}
                      onToggleValue={(column, value) =>
                        column === "projectType" && toggleSelection(setSelectedProjectTypes, value)
                      }
                      onClear={() => clearSelection(setSelectedProjectTypes)}
                    />
                  </div>
                </th>
                <th className="px-3 py-3.5 sm:px-4">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleSort("transportTypes")} className="inline-flex items-center gap-1.5 transition hover:text-primary">
                      Verkehrsmittel
                      <SortButton active={sortKey === "transportTypes" && sortDirection != null} direction={sortKey === "transportTypes" ? sortDirection : undefined} />
                    </button>
                    <ColumnFilterDropdown
                      label="Verkehrsmittel"
                      column="transportTypes"
                      items={transportTypeItems}
                      selectedValues={selectedTransportTypes}
                      onToggleValue={(column, value) =>
                        column === "transportTypes" && toggleSelection(setSelectedTransportTypes, value)
                      }
                      onClear={() => clearSelection(setSelectedTransportTypes)}
                    />
                  </div>
                </th>
                <th className="px-3 py-3.5 sm:px-4">
                  <button type="button" onClick={() => handleSort("cities")} className="inline-flex items-center gap-1.5 transition hover:text-primary">
                    Städte
                    <SortButton active={sortKey === "cities" && sortDirection != null} direction={sortKey === "cities" ? sortDirection : undefined} />
                  </button>
                </th>
                <th className="px-3 py-3.5 sm:px-4">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleSort("status")} className="inline-flex items-center gap-1.5 transition hover:text-primary">
                      Status
                      <SortButton active={sortKey === "status" && sortDirection != null} direction={sortKey === "status" ? sortDirection : undefined} />
                    </button>
                    <ColumnFilterDropdown
                      label="Status"
                      column="status"
                      items={statusItems}
                      selectedValues={selectedStatuses}
                      onToggleValue={(column, value) =>
                        column === "status" && toggleSelection(setSelectedStatuses, value)
                      }
                      onClear={() => clearSelection(setSelectedStatuses)}
                    />
                  </div>
                </th>
                <th className="px-3 py-3.5 sm:px-4">
                  <button type="button" onClick={() => handleSort("lastUpdated")} className="inline-flex items-center gap-1.5 transition hover:text-primary">
                    Zuletzt aktualisiert
                    <SortButton active={sortKey === "lastUpdated" && sortDirection != null} direction={sortKey === "lastUpdated" ? sortDirection : undefined} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80 text-sm">
              {visible.map((p) => {
                const lastStatus = getLatestStatus(p);

                return (
                  <tr key={p.id} className="transition-colors hover:bg-background/60">
                    <td className="px-3 py-4 align-top sm:px-4">
                      <Link href={`/projects/${p.id}`} className="font-semibold text-foreground transition hover:text-primary">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-3 py-4 align-top sm:px-4">
                      {(() => {
                        const config = PROJECT_TYPE_CONFIG[p.projectType as keyof typeof PROJECT_TYPE_CONFIG];
                        const Icon = config?.icon;
                        return (
                          <span style={{ backgroundColor: config?.color, color: config?.textColor }} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
                            {Icon && <Icon className="h-3.5 w-3.5" />}
                            {config?.label || p.projectType}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-3 py-4 align-top sm:px-4">
                      <div className="flex flex-wrap gap-2">
                        {(p.transportTypes || []).map((transport: string) => {
                          const config = TRANSPORT_TYPE_CONFIG[transport as keyof typeof TRANSPORT_TYPE_CONFIG];
                          const Icon = config?.icon;
                          return (
                            <span key={transport} style={{ backgroundColor: config?.color, color: config?.textColor }} className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium">
                              {Icon && <Icon className="h-3 w-3" />}
                              {config?.label || transport}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-4 align-top sm:px-4">
                      <div className="flex flex-wrap gap-2">
                        {(p.cities || []).map((city: string) => (
                          <span key={city} className="inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted">
                            {city}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4 align-top sm:px-4">
                      {(() => {
                        const config = STATUS_CONFIG[lastStatus as keyof typeof STATUS_CONFIG];
                        const Icon = config?.icon;
                        return (
                          <span style={{ backgroundColor: config?.color, color: config?.textColor }} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
                            {Icon && <Icon className="h-3.5 w-3.5" />}
                            {config?.label || lastStatus}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-3 py-4 align-top text-sm text-muted sm:px-4">{formatLocalDate(p.lastUpdated)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
