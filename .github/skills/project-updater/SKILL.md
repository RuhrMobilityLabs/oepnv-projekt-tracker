# Project Updater

## Purpose
Review all existing project files and update only projects with materially new information from newer, relevant sources.

## Required Inputs
- Optional scope:
  - specific project IDs to update, or
  - full dataset update mode (default)
- Optional search constraints (date range, preferred source domains).

## Output Contract
- Read all project files in:
  - `/home/runner/work/oepnv-projekt-tracker/oepnv-projekt-tracker/projects`
- Build an internal exploration table with:
  - `id`, `name`, latest status, `description`, `lastUpdated`
- Update only changed projects in-place:
  - `/home/runner/work/oepnv-projekt-tracker/oepnv-projekt-tracker/projects/<id>.json`
- Preserve schema compliance with:
  - `/home/runner/work/oepnv-projekt-tracker/oepnv-projekt-tracker/src/lib/schemas/projectSchema.ts`
- Keep IDs/filenames consistent and unchanged unless explicitly required.

## Decision Rules

### 1) Mandatory Exploration Phase
1. Read every JSON file in `projects/`.
2. Build an internal table for each project with:
   - `id`
   - `name`
   - latest status (derived from newest `statusHistory[].date`)
   - `description`
   - `lastUpdated`

### 2) Monitoring/Search Phase
- For each project, search the web using project name plus context from description.
- Prioritize official project owners, authorities, operators, and government publications.
- Gather only sources that are newer and relevant to project facts.

### 3) Update Decision Rules
- Update a project only when a newer source adds new material facts:
  - status progression
  - new date milestone
  - new scope/implementation information
  - source-backed corrections
- Do **not** update when newer sources only restate existing known facts.
- When no material change exists, explicitly mark internally: `checked/no material change`.

### 4) Update Behavior
- Adjust `statusHistory` only when source evidence justifies it.
- Add useful `sources` entries that contribute new facts.
- Update `lastUpdated` only when project content materially changed.
- Preserve existing valid data and avoid speculative additions.
- Enforce enum values exactly as defined in schema:
  - `projectType`: `neubau` | `reaktivierung`
  - `transportTypes`: `eisenbahn` | `stadtbahn` | `maglev` | `bus` | `oberleitungsbus` | `seilbahn` | `faehre`
  - `statusHistory[].status`: `idee` | `antrag` | `geplant` | `im_bau` | `fertiggestellt` | `abgelehnt`
  - `stations[].status`: `existing` | `planned`
- Keep UI-facing `name` and `description` in German.

### 5) Geodata Rule
- Never guess project or station coordinates.
- Add/update `coordinates` or `stations[].coordinates` only with explicit source evidence.

### 6) Failure Behavior
- If evidence is insufficient to make a safe update, do not modify the file and report why.

## Validation Checklist
- [ ] All project files were read before update decisions
- [ ] Internal table created with `id`, `name`, latest status, `description`, `lastUpdated`
- [ ] Only materially changed projects were modified
- [ ] IDs still match filenames in `projects/<id>.json`
- [ ] Schema validation passes against `projectSchema.ts`
- [ ] No duplicate sources by URL or duplicate-content equivalents
- [ ] No guessed coordinates/stations geodata
- [ ] `lastUpdated` changed only for material updates
- [ ] Run local validation flow after modifications:
  - `npm run build:projects`
  - `npm run validate:pr`
