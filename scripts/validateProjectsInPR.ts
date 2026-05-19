import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { 
  projectSchema,
  PROJECT_TYPES,
  TRANSPORT_TYPES,
} from "../src/lib/schemas/projectSchema";
import { ZodError } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationResult {
  file: string;
  valid: boolean;
  error?: string;
  zodError?: ZodError;
  parsedData?: Record<string, unknown>;
}

interface FormattedError {
  path: string;
  message: string;
}

function getValueAtPath(obj: unknown, path: PropertyKey[]): unknown {
  let current = obj;
  for (const key of path) {
    if (typeof current === "object" && current !== null) {
      current = (current as Record<PropertyKey, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

function formatZodErrors(
  filePath: string,
  zodError: ZodError,
  parsedData?: Record<string, unknown>
): string {
  const formattedErrors: FormattedError[] = [];

  // Map of field paths to their valid options
  const validOptionsMap: Record<string, string[]> = {
    projectType: PROJECT_TYPES as unknown as string[],
    transportTypes: TRANSPORT_TYPES as unknown as string[],
  };

  for (const issue of zodError.issues) {
    const pathStr = issue.path.join(".");
    let message = "";

    if (issue.code === "invalid_value" && issue.message.includes("Invalid option")) {
      // Extract received value from parsed data
      let received: unknown = undefined;
      if (parsedData && issue.path.length > 0) {
        received = getValueAtPath(parsedData, issue.path);
      }

      // Determine valid options based on the path
      let validOptions: string[] = [];
      const firstPathSegment = issue.path[0];
      
      if (firstPathSegment === "projectType") {
        validOptions = validOptionsMap.projectType;
      } else if (firstPathSegment === "transportTypes") {
        validOptions = validOptionsMap.transportTypes;
      } else {
        // Try to parse from message as fallback
        const match = issue.message.match(/expected one of (.+)/);
        if (match) {
          validOptions = match[1].split("|").map((opt) => opt.trim().replace(/"/g, ""));
        }
      }

      if (received !== undefined) {
        message = `Received an invalid option "${received}". Valid options are ${validOptions.map((opt: string) => `"${opt}"`).join("|")}.`;
      } else {
        message = issue.message;
      }
    } else if (issue.code === "invalid_type") {
      if (issue.expected === "array") {
        message = `Field is missing or not an array. Received: ${JSON.stringify(getValueAtPath(parsedData, issue.path)) || "nothing"}`;
      } else {
        message = issue.message;
      }
    } else {
      message = issue.message;
    }

    formattedErrors.push({
      path: pathStr,
      message,
    });
  }

  let output = `The following errors were found while validating "${filePath}". Please fix them!\n`;
  for (const error of formattedErrors) {
    output += `- ${error.path}: ${error.message}\n`;
  }

  return output;
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
      file.endsWith(".json")
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
        error: `Validation error`,
        zodError: result.error,
        parsedData: parsed,
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
  const prId = process.env.GITHUB_REF ? process.env.GITHUB_REF.split("/").pop() : "unknown";
  console.log(`Validating projects in PR #${prId}...`);

  // Get changed files
  const changedFiles = await getChangedFiles();
  console.log(`Found ${changedFiles.length} changed file(s).\n`);

  // Filter for project files
  const changedProjectFiles = filterProjectFiles(changedFiles);

  if (changedProjectFiles.length === 0) {
    console.log("No project files were changed in this PR.");
    process.exit(0);
  }

  // Validate each file
  const results: ValidationResult[] = [];
  for (const file of changedProjectFiles) {
    const result = await validateProjectFile(file);
    results.push(result);
    if (!result.valid) {
      console.log(`## ✗ ${result.file}\n`);
      if (result.zodError) {
        console.log(formatZodErrors(file, result.zodError, result.parsedData));
      } else if (result.error) {
        console.log(`  ${result.error}`);
      }
    }
  }

  // Summary
  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.filter((r) => !r.valid).length;

  console.log(`\n## Validation Summary:\n`);
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
