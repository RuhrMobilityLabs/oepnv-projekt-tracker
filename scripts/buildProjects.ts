import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { projectSchema } from "../src/lib/schemas/projectSchema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, "../projects");
const outputPath = path.join(__dirname, "../generated/projects.json");

async function buildProjects() {
  try {
    const files = fs.readdirSync(projectsDir).filter((file) =>
      file.endsWith(".json")
    );

    const validatedProjects = [];
    const errors: { file: string; error: unknown }[] = [];

    for (const file of files) {
      const filePath = path.join(projectsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (err) {
        errors.push({ file, error: err });
        continue;
      }

      const result = projectSchema.safeParse(parsed);
      if (!result.success) {
        errors.push({ file, error: result.error.format() });
        continue;
      }

      validatedProjects.push(result.data);
    }

    if (errors.length > 0) {
      console.error("Validation errors while building projects.json:");
      for (const e of errors) {
        console.error(`- ${e.file}:`, JSON.stringify(e.error, null, 2));
      }
      process.exit(1);
    }

    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(validatedProjects, null, 2));

    console.log(
      `Successfully built projects.json with ${validatedProjects.length} project(s)`
    );
  } catch (error) {
    console.error("Error building projects.json:", error);
    process.exit(1);
  }
}

buildProjects();
