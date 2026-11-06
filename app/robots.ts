import type { MetadataRoute } from 'next';

// TODO: Update robots rule to allow indexing before public production launch
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: 'https://balajidasetti.space/sitemap.xml',
  };
}

