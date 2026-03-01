import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  path?: string
}

const BASE_TITLE = 'Transmute'
const SITE_URL = 'https://transmute-app.github.io'

/**
 * Updates document title, meta description, canonical, and OG tags on route change.
 * Falls back to the static values in index.html when the component unmounts.
 */
export function useSEO({ title, description, path }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = `${title} — ${BASE_TITLE}`

    // Meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.name = 'description'
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = description

      // OG description
      const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null
      if (ogDesc) ogDesc.content = description
      const twDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null
      if (twDesc) twDesc.content = description
    }

    // OG title
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null
    if (ogTitle) ogTitle.content = `${title} — ${BASE_TITLE}`
    const twTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null
    if (twTitle) twTitle.content = `${title} — ${BASE_TITLE}`

    // Canonical + OG URL
    if (path !== undefined) {
      const url = `${SITE_URL}${path}`
      const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (canonical) canonical.href = url
      const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null
      if (ogUrl) ogUrl.content = url
      const twUrl = document.querySelector('meta[name="twitter:url"]') as HTMLMetaElement | null
      if (twUrl) twUrl.content = url
    }
  }, [title, description, path])
}
