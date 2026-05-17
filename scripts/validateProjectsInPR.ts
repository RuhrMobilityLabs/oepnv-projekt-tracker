import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { projectSchema } from "../src/lib/schemas/projectSchema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationResult {
  file: string;
  valid: boolean;
  error?: string;
}

async function getChangedFiles(): Promise<string[]> {
  try {
    // In GitHub Actions, we can use the base and head refs
    const baseRef = process.env.GITHUB_BASE_REF || "origin/main";
    const headRef = process.env.GITHUB_HEAD_REF || "HEAD";

    const output = execSync(
      `git diff --name-only ${baseRef}...${headRef}`,
      {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "ignore"], // Ignore stderr
      }
    );

    return output.trim().split("\n").filter((line) => line.length > 0);
  } catch (error) {
    // return all changed files if git command fails (e.g., not a git repo, or no changes)
    console.warn("Could not get changed files from git. Falling back to validating all project files.");
    const allFiles = fs.readdirSync(path.join(__dirname, "..", "projects"));
    return allFiles.map((file) => `projects/${file}`);
  }
}

function filterProjectFiles(files: string[]): string[] {
  return files.filter(
    (file) =>
      file.startsWith("projects/") &&
      file.endsWith(".json") &&
      !file.includes(".")
  );
}

async function validateProjectFile(filePath: string): Promise<ValidationResult> {
  const fullPath = path.join(__dirname, "..", filePath);
  const fileName = path.basename(filePath);

  try {
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return {
        file: fileName,
        valid: false,
        error: "File does not exist or was deleted",
      };
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return {
        file: fileName,
        valid: false,
        error: `JSON parse error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }

    const result = projectSchema.safeParse(parsed);

    if (!result.success) {
      return {
        file: fileName,
        valid: false,
        error: `Validation error: ${JSON.stringify(result.error.format())}`,
      };
    }

    return {
      file: fileName,
      valid: true,
    };
  } catch (error) {
    return {
      file: fileName,
      valid: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function main() {
  console.log("Validating projects in PR...\n");

  // Get changed files
  const changedFiles = await getChangedFiles();
  console.log(`Found ${changedFiles.length} changed files`);

  // Filter for project files
  const changedProjectFiles = filterProjectFiles(changedFiles);

  if (changedProjectFiles.length === 0) {
    console.log("No project files were changed in this PR.");
    process.exit(0);
  }

  console.log(`\nValidating ${changedProjectFiles.length} project file(s):\n`);

  // Validate each file
  const results: ValidationResult[] = [];
  for (const file of changedProjectFiles) {
    const result = await validateProjectFile(file);
    results.push(result);
    console.log(
      `${result.valid ? "✓" : "✗"} ${result.file}${result.error ? ` - ${result.error}` : ""}`
    );
  }

  // Summary
  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.filter((r) => !r.valid).length;

  console.log(`\nValidation Summary:`);
  console.log(`✓ Valid: ${validCount}`);
  console.log(`✗ Invalid: ${invalidCount}`);

  if (invalidCount > 0) {
    console.error("\nValidation failed!");
    process.exit(1);
  }

  console.log("\nAll projects validated successfully!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
