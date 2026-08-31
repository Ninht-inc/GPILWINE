import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default function robots(): MetadataRoute.Robots {
  const headersList = headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || ''
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  const siteUrl = host ? `${protocol}://${host}` : (process.env.NEXTAUTH_URL || 'https://gpilwines.co.za')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
