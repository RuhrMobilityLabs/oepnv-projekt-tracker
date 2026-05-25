import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HOME_INTRO_TEXT } from "../src/lib/siteCopy";

type Project = {
  id: string;
  name: string;
  description?: string;
  [key: string]: unknown;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsPath = path.join(__dirname, "../generated/projects.json");
const outputPath = path.join(__dirname, "../public/llms.txt");

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `${process.env.NEXT_PUBLIC_SITE_URL}/`;
  }

  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    return `https://${owner}.github.io/${repo}/`;
  }

  return "/";
}

function buildLlmsContent(projects: Project[]): string {
  const siteUrl = getSiteUrl();
  const lines: string[] = [
    "# ÖPNV Projekt Tracker",
    "",
    HOME_INTRO_TEXT,
    "",
    `Stand: ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
    "",
    "## Warum Bahnstrecken gebaut und reaktiviert werden sollten",
    `${siteUrl}warum-bahnstrecken`,
    "Warum neue Bahnstrecken gebaut und ehemalige Strecken reaktiviert werden sollten: Eine Einordnung zu Klima, Mobilität, Kosten und regionaler Entwicklung.",
    "",
  ];

  for (const project of projects) {
    lines.push(`## ${project.name}`);
    lines.push(`${siteUrl}projects/${project.id}`);
    if (project.description) {
      lines.push(`Beschreibung: ${project.description}`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function buildLlms() {
  try {
    const rawContent = fs.readFileSync(projectsPath, "utf-8");
    const projects = JSON.parse(rawContent) as Project[];

    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buildLlmsContent(projects));

    console.log(`Successfully built llms.txt with ${projects.length} project(s)`);
  } catch (error) {
    console.error("Error building llms.txt:", error);
    process.exit(1);
  }
}

buildLlms();