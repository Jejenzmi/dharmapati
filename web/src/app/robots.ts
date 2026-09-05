import type { MetadataRoute } from 'next'
import { ASAL_SITUS } from '@/lib/api'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] },
    ],
    sitemap: `${ASAL_SITUS}/sitemap.xml`,
    host: ASAL_SITUS,
  }
}
