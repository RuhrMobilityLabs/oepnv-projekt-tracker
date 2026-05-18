import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HOME_INTRO_TEXT } from "../src/lib/siteCopy";

type Project = {
  id: string;
  name: string;
  [key: string]: unknown;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsPath = path.join(__dirname, "../generated/projects.json");
const outputPath = path.join(__dirname, "../public/llms.txt");

function buildLlmsContent(projects: Project[]): string {
  const lines: string[] = [
    "# ÖPNV Projekt Tracker",
    "",
    HOME_INTRO_TEXT,
    "",
    `Stand: ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`,
    "",
  ];

  for (const project of projects) {
    lines.push(`## ${project.name}`);
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(project, null, 2));
    lines.push("```");
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