import type { MetadataRoute } from 'next'
import { client, urlFor } from '@/lib/sanity'
import { LEGAL } from '@/lib/legal'
export const revalidate = 3600
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofqg.com').replace(/\/$/, '')
/** Every public page. Products are read from Sanity, so new ones appear within the hour. Private pages (cart, account, invoices, API, Studio) are left out on purpose. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const pages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/size-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...Object.keys(LEGAL).map((slug) => ({ url: `${SITE}/legal/${slug}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 })),
  ]
  try {
    const products = await client.fetch(`*[_type=="product" && active!=false && defined(slug.current)]{"slug":slug.current,_updatedAt,"img":images[0]}`)
    return [
      ...pages,
      ...products.map((p: any) => ({ url: `${SITE}/product/${p.slug}`, lastModified: p._updatedAt, changeFrequency: 'weekly' as const, priority: 0.8, ...(p.img ? { images: [urlFor(p.img).width(1200).url()] } : {}) })),
    ]
  } catch { return pages } // if Sanity is unreachable, still serve the static pages
}
