import Link from "next/link";
import type { Project } from "@/lib/schemas/projectSchema";
import { PROJECT_TYPE_CONFIG } from "@/config/projectType";
import { TRANSPORT_TYPE_CONFIG } from "@/config/transportType";
import { STATUS_CONFIG } from "@/config/status";
import { formatLocalDate } from "@/lib/formatDate";
import { getLatestStatus } from "@/lib/getLatestStatus";
import { Undo2 } from "lucide-react";
import ProjectMapWrapper from "@/components/ProjectMapWrapper";

export default function ProjectDetail({ project, projects }: { project: Project; projects?: Project[] }) {
  const lastStatus = getLatestStatus(project);

  // Get related projects
  const relatedProjects = project.relatedProjects
    ? project.relatedProjects
        .map((id) => projects?.find((p) => p.id === id))
        .filter((p) => p !== undefined) as Project[]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/" className="inline-flex items-center rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary gap-2">
          <Undo2 />
          Zur Projektübersicht
        </Link>
        {(() => {
          const config = STATUS_CONFIG[lastStatus as keyof typeof STATUS_CONFIG];
          const Icon = config?.icon;
          return (
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config?.color || "bg-primary/10 text-primary"}`}>
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {config?.label || lastStatus}
            </span>
          );
        })()}
      </div>

      <article className="overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] dark:shadow-black/30">
        <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent-foreground">
              Projektdetails
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{project.name}</h1>
            {project.description && <p className="text-sm leading-6 text-foreground/90 sm:text-base">{project.description}</p>}
          </div>
        </div>

        <div className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="space-y-3 rounded-2xl border border-border bg-background/50 p-3">
            <h2 className="text-sm font-semibold text-foreground">Projektdaten</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Typ</dt>
                <dd className="mt-2">
                  {(() => {
                    const config = PROJECT_TYPE_CONFIG[project.projectType as keyof typeof PROJECT_TYPE_CONFIG];
                    const Icon = config?.icon;
                    return (
                      <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${config?.color || "bg-accent text-accent-foreground"}`}>
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                        {config?.label || project.projectType}
                      </span>
                    );
                  })()}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Zuletzt aktualisiert</dt>
                <dd className="mt-1 text-xs font-medium text-foreground">{formatLocalDate(project.lastUpdated)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Verkehrsmittel</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {(project.transportTypes || []).map((transport) => {
                    const config = TRANSPORT_TYPE_CONFIG[transport as keyof typeof TRANSPORT_TYPE_CONFIG];
                    const Icon = config?.icon;
                    return (
                      <span key={transport} className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${config?.color || "bg-surface text-foreground"}`}>
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                        {config?.label || transport}
                      </span>
                    );
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Städte</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {(project.cities || []).map((city) => (
                    <span key={city} className="inline-flex rounded-full border border-border bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                      {city}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background/50 p-5">
              <h2 className="text-sm font-semibold text-foreground">Statusverlauf</h2>
                <ul className="mt-3 space-y-2">
                  {project.statusHistory.map((statusEntry, index) => {
                  const config = STATUS_CONFIG[statusEntry.status as keyof typeof STATUS_CONFIG];
                  const Icon = config?.icon;
                  return (
                      <li key={index} className="rounded-2xl border border-border bg-surface px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-3.5 w-3.5 text-foreground/60" />}
                            <strong className="text-xs font-semibold text-foreground">{config?.label || statusEntry.status}</strong>
                          </div>
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{formatLocalDate(statusEntry.date)}</span>
                        </div>
                        {statusEntry.note && <p className="mt-1 text-sm leading-5 text-muted">{statusEntry.note}</p>}
                        {statusEntry.sourceUrl && (
                          <a href={statusEntry.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-primary transition hover:underline">
                            Quelle
                          </a>
                        )}
                      </li>
                  );
                })}
              </ul>
            </section>

            {project.sources && project.sources.length > 0 && (
              <section className="rounded-2xl border border-border bg-background/50 p-3">
                <h2 className="text-sm font-semibold text-foreground">Quellen</h2>
                <ul className="mt-3 space-y-2">
                  {project.sources.map((source, index) => (
                    <li key={index} className="rounded-2xl border border-border bg-surface px-3 py-2">
                      <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary transition hover:underline">
                        {source.title}
                      </a>
                      {source.date && <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted">{formatLocalDate(source.date)}</div>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {relatedProjects.length > 0 && (
              <section className="rounded-2xl border border-border bg-background/50 p-3">
                <h2 className="text-sm font-semibold text-foreground">Verwandte Projekte</h2>
                <ul className="mt-3 space-y-2">
                  {relatedProjects.map((relatedProject) => (
                    <li key={relatedProject.id} className="rounded-2xl border border-border bg-surface px-3 py-2 transition hover:border-primary/50">
                      <Link href={`/projects/${relatedProject.id}`} className="block text-sm font-semibold text-primary transition hover:underline">
                        {relatedProject.name}
                      </Link>
                      {relatedProject.description && (
                        <p className="mt-1 text-xs leading-4 text-muted line-clamp-2">{relatedProject.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {(project.coordinates || (project.stations && project.stations.length > 0)) && (
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            <ProjectMapWrapper
              projectName={project.name}
              projectCoordinates={project.coordinates}
              stations={project.stations}
            />
          </div>
        )}
      </article>
    </div>
  );
}
