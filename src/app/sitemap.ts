import type { MetadataRoute } from "next"

const SITE_URL = "https://kizento.com"
const STORE_URL = "https://store.kizento.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Homepage
  const pages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]

  // Fetch blog URLs from storefront sitemap
  try {
    const res = await fetch(`${STORE_URL}/sitemap.xml`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const xml = await res.text()
      // Parse <loc> entries from the storefront sitemap
      const locRegex = /<loc>([^<]+)<\/loc>/g
      let match: RegExpExecArray | null
      while ((match = locRegex.exec(xml)) !== null) {
        const url = match[1]
        if (url.includes("/blog")) {
          pages.push({
            url,
            changeFrequency: "weekly",
            priority: 0.7,
          })
        }
      }
    }
  } catch {
    // Silently fail — homepage sitemap still works
  }

  return pages
}
