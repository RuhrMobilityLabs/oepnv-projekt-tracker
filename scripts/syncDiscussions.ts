import { graphql } from "@octokit/graphql";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "url";
import { projectSchema, type Project } from "../src/lib/schemas/projectSchema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_DIR = path.join(__dirname, "../projects");
const DISCUSSION_CATEGORY_NAME = "Projects";

const repositorySlug = process.env.GITHUB_REPOSITORY;
if (!repositorySlug) {
  throw new Error("GITHUB_REPOSITORY environment variable is not set");
}
const [owner, repo] = repositorySlug.split("/");
if (!owner || !repo) {
  throw new Error(`Invalid GITHUB_REPOSITORY value: '${repositorySlug}'`);
}
const token = process.env.GITHUB_TOKEN!;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_SITE_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_SITE_URL;
  }

  return `https://${owner}.github.io/${repo}`;
}

function buildDiscussionBody(project: Project): string {
  const lines: string[] = [];

  if (project.description) {
    lines.push(project.description, "");
  }

  const transportLabels: Record<string, string> = {
    eisenbahn: "Eisenbahn",
    stadtbahn: "Stadtbahn",
    maglev: "Magnetschwebebahn",
    bus: "Bus",
    oberleitungsbus: "Oberleitungsbus",
    seilbahn: "Seilbahn",
    faehre: "Fähre",
  };
  const transportTypes = project.transportTypes
    .map((t) => transportLabels[t] ?? t)
    .join(", ");
  lines.push(`**Verkehrsmittel:** ${transportTypes}`, "");

  if (project.cities.length > 0) {
    lines.push(`**Städte:** ${project.cities.join(", ")}`, "");
  }

  if (project.operators && project.operators.length > 0) {
    lines.push(`**Betreiber:** ${project.operators.join(", ")}`, "");
  }

  if (project.sources.length > 0) {
    lines.push("**Quellen:**");
    for (const source of project.sources) {
      lines.push(`- [${source.title}](${source.url})`);
    }
    lines.push("");
  }

  const siteUrl = getSiteUrl();
  lines.push(
    `[Projektseite](${siteUrl}/projects/${project.id})`,
    "",
  );

  lines.push(`<!-- project:${project.id} -->`);

  return lines.join("\n");
}

interface DiscussionCategory {
  id: string;
  name: string;
}

interface RepositoryInfo {
  id: string;
  discussionCategories: {
    nodes: DiscussionCategory[];
  };
}

interface RepositoryQueryResult {
  repository: RepositoryInfo;
}

async function getRepositoryInfo(): Promise<RepositoryInfo> {
  const result: RepositoryQueryResult = await graphqlWithAuth(
    `
      query($owner:String!, $repo:String!) {
        repository(owner:$owner, name:$repo) {
          id
          discussionCategories(first:20) {
            nodes {
              id
              name
            }
          }
        }
      }
    `,
    { owner, repo },
  );

  return result.repository;
}

interface DiscussionsQueryResult {
  repository: {
    discussions: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: {
        body: string;
      }[];
    };
  };
}

async function getExistingDiscussionProjectIds(): Promise<Set<string>> {
  const projectIds = new Set<string>();
  let cursor: string | null = null;

  while (true) {
    const result: DiscussionsQueryResult = await graphqlWithAuth(
      `
        query($owner:String!, $repo:String!, $cursor:String) {
          repository(owner:$owner, name:$repo) {
            discussions(first:100, after:$cursor) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                body
              }
            }
          }
        }
      `,
      { owner, repo, cursor },
    );

    for (const discussion of result.repository.discussions.nodes) {
      const match = discussion.body.match(/<!--\s*project:([^\s]+)\s*-->/);
      if (match) {
        projectIds.add(match[1]);
      }
    }

    if (!result.repository.discussions.pageInfo.hasNextPage) {
      break;
    }
    cursor = result.repository.discussions.pageInfo.endCursor;
  }

  return projectIds;
}

async function createDiscussion(
  repositoryId: string,
  categoryId: string,
  project: Project,
): Promise<void> {
  const title = project.name;
  const body = buildDiscussionBody(project);

  await graphqlWithAuth(
    `
      mutation($repositoryId:ID!, $categoryId:ID!, $title:String!, $body:String!) {
        createDiscussion(input:{
          repositoryId:$repositoryId
          categoryId:$categoryId
          title:$title
          body:$body
        }) {
          discussion {
            url
          }
        }
      }
    `,
    { repositoryId, categoryId, title, body },
  );

  console.log(`Created discussion for ${project.id}`);
}

function loadProjects(): Project[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) =>
    f.endsWith(".json")
  );

  const projects: Project[] = [];

  for (const file of files) {
    const filePath = path.join(PROJECTS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error(`Skipping ${file}: invalid JSON`, err);
      continue;
    }

    const result = projectSchema.safeParse(parsed);

    if (!result.success) {
      console.error(`Skipping ${file}: validation error`, result.error.format());
      continue;
    }

    projects.push(result.data);
  }

  return projects;
}

async function main() {
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  console.log("Loading projects...");
  const projects = loadProjects();
  console.log(`Found ${projects.length} project(s)`);

  console.log("Fetching repository info...");
  const repository = await getRepositoryInfo();

  const category = repository.discussionCategories.nodes.find(
    (c) => c.name === DISCUSSION_CATEGORY_NAME,
  );

  if (!category) {
    throw new Error(
      `Couldn't find discussion category '${DISCUSSION_CATEGORY_NAME}'`,
    );
  }

  console.log("Fetching existing discussions...");
  const existing = await getExistingDiscussionProjectIds();
  console.log(`Found ${existing.size} existing discussion(s)`);

  let created = 0;
  for (const project of projects) {
    if (existing.has(project.id)) {
      console.log(`Skipping ${project.id} (discussion exists)`);
      continue;
    }

    await createDiscussion(repository.id, category.id, project);
    created++;
  }

  console.log(`Done. Created ${created} new discussion(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
