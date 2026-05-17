import type { MetadataRoute } from 'next'
import projects from '@/../generated/projects.json'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || '/'

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}projects/${project.id}`,
    lastModified: new Date(project.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...projectUrls,
  ]
}
