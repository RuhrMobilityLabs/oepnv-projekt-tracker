import type { NextConfig } from "next";

// Check if we're running in GitHub Actions for GitHub Pages deployment
const isGithubActions = process.env.GITHUB_ACTIONS && !process.env.PLAYWRIGHT_TEST;
let owner = "";
let repo = "oepnv-projekt-tracker";
if (process.env.GITHUB_REPOSITORY) {
  [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
}

const basePath = isGithubActions ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath ? `${basePath}/` : "/",
    NEXT_PUBLIC_SITE_URL: isGithubActions ? `https://${owner}.github.io${basePath}/` : "http://localhost:3000/",
    NEXT_PUBLIC_GITHUB_URL: process.env.GITHUB_REPOSITORY ? `https://github.com/${owner}/${repo}` : "",
  }
};

export default nextConfig;
