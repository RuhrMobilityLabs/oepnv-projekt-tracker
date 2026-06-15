<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ÖPNV Projekt Tracker

Next.js project tracking German public transport (ÖPNV) infrastructure projects.
Source code and commits are in English; the web app UI is in German.

## Folder Structure

- `projects/` — Contains all project JSON files (one per project)
  - Prefix convention: `neubau-` for new-build, `reaktivierung-` for reactivation
- `src/` — Application source
  - `src/app/` — Next.js App Router pages
  - `src/app/projects/[id]/` — Dynamic project detail pages
  - `src/app/editor/` — Visual editor page for creating/editing project JSON files (client component with `"use client"`)
  - `src/app/robots.ts` — robots.txt (generated at build time)
  - `src/app/sitemap.ts` — sitemap.xml (generated at build time)
  - `src/config/` — Config for project types, statuses, transport types
  - `src/lib/schemas/` — Zod schemas (see `projectSchema.ts`)
- `scripts/` — Build and validation scripts
  - `scripts/buildProjects.ts` — Validates & aggregates all project JSONs into `generated/projects.json`
  - `scripts/buildLlms.ts` — Generates `public/llms.txt` from the aggregated data
  - `scripts/validateProjectsInPR.ts` — CI validation for PRs

## Generated Files (not in repo, in .gitignore)

These are produced by `npm run build` and should not be edited manually:

- `public/llms.txt` — LLM-friendly project index
- `public/projects.json` — Aggregated, validated project list (copied from `generated/projects.json`)
- `generated/projects.json` — Intermediate build artifact
- Project pages (dynamic `[id]` routes) including `sitemap.xml`, `robots.txt`, and metadata — all built from the generated project data

## Build Pipeline

- `npm run build:projects` → validates all `projects/*.json` against the Zod schema → writes `generated/projects.json`
- `npm run build:llms` → reads `generated/projects.json` → writes `public/llms.txt`
- `npm run build` → runs both, copies `generated/projects.json` to `public/projects.json`, then runs `next build`

## Project JSON Schema

All project JSON files in `projects/` **must** conform to the Zod schema defined in `src/lib/schemas/projectSchema.ts`.

Key fields:
- `id` — Unique slug
- `projectType` — One of: `neubau`, `reaktivierung`
- `transportTypes` — Array of: `eisenbahn`, `stadtbahn`, `maglev`, `bus`, `oberleitungsbus`, `seilbahn`, `faehre`
- `cities` — Array of city names
- `states` — Optional array of state names
- `operators` — Optional array of operator names
- `description` — Optional description string
- `statusHistory` — Array of entries with `status` (one of: `idee`, `antrag`, `geplant`, `im_bau`, `fertiggestellt`, `abgelehnt`), `date`, optional `note`, optional `sourceUrl`
- `sources` — Array with `title`, `url`, optional `date`
- `stations` — Optional array with `name`, `coordinates` (`lat`, `lng`), `status` (`existing`, `planned`)
- `coordinates` — Optional `lat`, `lng`
- `lastUpdated` — Optional date string
- `relatedProjects` — Optional array of project IDs

See `src/lib/schemas/projectSchema.ts` for the full schema.
When you make changes to the projectSchema or observe changes, update this AGENTS.md as well.

## Map

- **Leaflet** is used for map display on project detail pages
- `ProjectMap` (`src/components/ProjectMap.tsx`) is a client component dynamically imported with `ssr: false`
- The map shows project coordinates and stations with popups (name + status)
- Users must consent before OpenStreetMap tiles are loaded
- Leaflet CSS is imported in `globals.css`

## Style

- Use Tailwind CSS for all styling
- New elements should match the styling patterns of existing elements

## CI

- `npm run validate:pr` — validates project files changed in a PR using the Zod schema
- `npm run lint` — ESLint
