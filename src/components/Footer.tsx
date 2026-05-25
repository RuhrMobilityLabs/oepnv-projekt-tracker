import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  const buildDate = process.env.BUILD_DATE ? new Date(process.env.BUILD_DATE).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : null;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          {buildDate && (
            <div className="text-sm underline text-gray-600 dark:text-gray-400">
              Zuletzt aktualisiert am {buildDate}
            </div>
          )}
          <Link
            href="/warum-bahnstrecken"
            className="text-sm underline text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Warum Bahnstrecken?
          </Link>
        </div>
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 underline dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ExternalLink size={18} />
            <span>View on GitHub</span>
          </a>
        )}
      </div>
    </footer>
  );
}
