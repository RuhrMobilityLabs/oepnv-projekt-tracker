# Project Creator

## Purpose
Create one new project file in `/home/runner/work/oepnv-projekt-tracker/oepnv-projekt-tracker/projects` from a provided source list, using only evidence-backed data and full schema compliance.

## Required Inputs
- `sources`: List of initial source URLs or source documents.
- Optional hints:
  - `projectType` (`neubau` or `reaktivierung`)
  - `city` / `cities`
  - `operator` / `operators`

## Output Contract
- Exactly one new JSON file: `/home/runner/work/oepnv-projekt-tracker/oepnv-projekt-tracker/projects/<id>.json`
- `id` must exactly match filename without `.json`
- `id` prefix must be:
  - `neubau-` when `projectType` is `neubau`
  - `reaktivierung-` when `projectType` is `reaktivierung`
- JSON must validate against:
  - `/home/runner/work/oepnv-projekt-tracker/oepnv-projekt-tracker/src/lib/schemas/projectSchema.ts`
- `name` and `description` must be written in German and fit existing dataset style.
- Must include at least:
  - `id`, `name`, `projectType`, `transportTypes`, `cities`, `statusHistory`, `sources`
- Must include source-backed `statusHistory` notes and a meaningful `lastUpdated`.

## Decision Rules

### 1) Research Order
1. Read all provided input sources first.
2. Perform focused web search for corroboration and newer official updates.
3. Prefer primary sources (operators, municipalities, agencies, official project pages).

### 2) Relevance Filtering
- Keep sources that add material facts (status, date, scope, route/station details, operator responsibility).
- Reject:
  - Duplicate URLs
  - Mirrors of already captured content
  - Commentary-only or non-informative repetitions
- If multiple sources contain the same fact, keep the strongest/most official one.

### 3) Data Synthesis
- Derive `name`, `description`, and `statusHistory` only from evidence.
- Populate enums only with allowed schema values:
  - `projectType`: `neubau` | `reaktivierung`
  - `transportTypes`: `eisenbahn` | `stadtbahn` | `maglev` | `bus` | `oberleitungsbus` | `seilbahn` | `faehre`
  - `statusHistory[].status`: `idee` | `antrag` | `geplant` | `im_bau` | `fertiggestellt` | `abgelehnt`
  - `stations[].status`: `existing` | `planned`
- Include `coordinates` and `stations` only when explicit coordinate evidence exists in sources.
- Never infer coordinates from vague references, map screenshots, or assumptions.

### 4) Failure Behavior
- If evidence is insufficient for required fields or status/source traceability, stop and fail with a clear reason.

## Validation Checklist
- [ ] File path is `/home/runner/work/oepnv-projekt-tracker/oepnv-projekt-tracker/projects/<id>.json`
- [ ] `id` equals filename (without `.json`)
- [ ] Prefix matches project type (`neubau-` / `reaktivierung-`)
- [ ] JSON conforms to `projectSchema.ts`
- [ ] `name` and `description` are in German
- [ ] No duplicate sources by URL or duplicate-content equivalents
- [ ] `statusHistory` entries are source-backed
- [ ] `coordinates`/`stations` included only with explicit evidence
- [ ] `lastUpdated` reflects latest material change date
- [ ] Run local validation flow before finalizing:
  - `npm run build:projects`
  - `npm run validate:pr`
