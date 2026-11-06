import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://balajidasetti.space';

  // Real projects listed in sitemap
  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: new Date('2026-11-03'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-11-03'),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    ...projectUrls,
  ];
}

