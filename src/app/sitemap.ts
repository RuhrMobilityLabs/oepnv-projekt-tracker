import type { MetadataRoute } from 'next'
import projects from '@/../generated/projects.json'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || '/'

  const projectUrls = projects.map((project) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${baseUrl}projects/${project.id}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    }

    if (project.lastUpdated) {
      entry.lastModified = new Date(project.lastUpdated)
    }

    return entry
  })

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}warum-bahnstrecken`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projectUrls,
  ]
}
