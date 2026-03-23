import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import fm from 'front-matter'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import {
  CONVERSIONS_METADATA,
  DOCS_METADATA,
  formatPageTitle,
  HOME_METADATA,
  toAbsoluteUrl,
  type RouteMetadata,
} from './src/seo.ts'

interface DocFrontMatter {
  title: string
  description?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function replaceSeoTextTag(html: string, marker: string, tagName: string, value: string) {
  const pattern = new RegExp(`<${tagName}([^>]*)data-seo="${marker}"([^>]*)>[\\s\\S]*?<\\/${tagName}>`)
  return html.replace(pattern, `<${tagName}$1data-seo="${marker}"$2>${escapeHtml(value)}</${tagName}>`)
}

function replaceSeoAttrTag(html: string, marker: string, attrName: 'content' | 'href', value: string) {
  const escapedValue = escapeHtml(value)
  const markerPattern = `data-seo="${marker}"`
  const attrBeforeMarker = new RegExp(`(<(?:meta|link)\\b[^>]*\\b${attrName}=")[^"]*("[^>]*${markerPattern}[^>]*>)`)
  const attrAfterMarker = new RegExp(`(<(?:meta|link)\\b[^>]*${markerPattern}[^>]*\\b${attrName}=")[^"]*("[^>]*>)`)

  return html
    .replace(attrBeforeMarker, `$1${escapedValue}$2`)
    .replace(attrAfterMarker, `$1${escapedValue}$2`)
}

function applyRouteMetadata(html: string, metadata: RouteMetadata) {
  const title = formatPageTitle(metadata.title)
  const canonicalUrl = toAbsoluteUrl(metadata.path)
  const replacements: Array<[string, 'title' | 'content' | 'href', string]> = [
    ['title', 'title', title],
    ['description', 'content', metadata.description],
    ['canonical', 'href', canonicalUrl],
    ['og:url', 'content', canonicalUrl],
    ['og:title', 'content', title],
    ['og:description', 'content', metadata.description],
    ['twitter:url', 'content', canonicalUrl],
    ['twitter:title', 'content', title],
    ['twitter:description', 'content', metadata.description],
  ]

  return replacements.reduce((nextHtml, [marker, target, value]) => {
    if (target === 'title') {
      return replaceSeoTextTag(nextHtml, marker, 'title', value)
    }
    return replaceSeoAttrTag(nextHtml, marker, target, value)
  }, html)
}

interface MediaTypeEntry {
  id?: string
  full_name?: string
  classification?: string
  description?: string
}

function formatDetailMetadata(mt: MediaTypeEntry): RouteMetadata {
  const id = mt.id!
  const fullName = mt.full_name ?? id.toUpperCase()
  return {
    title: `${id.toUpperCase()} Converter — Convert ${fullName} Files`,
    description: mt.description
      ? `Convert ${id.toUpperCase()} (${fullName}) files with Transmute. ${mt.description}`
      : `Convert ${id.toUpperCase()} files with Transmute — a free, self-hosted file converter.`,
    path: `/conversions/${id}`,
  }
}

async function getPublicRouteMetadata(publicDir: string) {
  const docsManifestPath = path.join(publicDir, 'docs', 'manifest.json')
  const mediaTypesPath = path.join(publicDir, 'reference_data', 'media_types.json')

  const [manifestRaw, mediaTypesRaw] = await Promise.all([
    readFile(docsManifestPath, 'utf8'),
    readFile(mediaTypesPath, 'utf8'),
  ])

  const docFiles = JSON.parse(manifestRaw) as string[]
  const mediaTypes = JSON.parse(mediaTypesRaw) as MediaTypeEntry[]

  const docRouteMetadata = await Promise.all(
    docFiles.map(async (file) => {
      const markdown = await readFile(path.join(publicDir, 'docs', file), 'utf8')
      const { attributes } = fm<DocFrontMatter>(markdown)
      const slug = file.replace(/\.md$/, '')

      return {
        title: `${attributes.title} — Docs`,
        description: attributes.description ?? DOCS_METADATA.description,
        path: `/docs/${slug}`,
      } satisfies RouteMetadata
    }),
  )

  const formatRouteMetadata = mediaTypes
    .filter((mt) => mt.id)
    .map(formatDetailMetadata)

  return [HOME_METADATA, DOCS_METADATA, CONVERSIONS_METADATA, ...docRouteMetadata, ...formatRouteMetadata]
}

function staticRouteHtmlPlugin(): Plugin {
  return {
    name: 'static-route-html',
    async closeBundle() {
      const rootDir = process.cwd()
      const distDir = path.resolve(rootDir, 'dist')
      const publicDir = path.resolve(rootDir, 'public')
      const distIndexPath = path.join(distDir, 'index.html')
      const [indexHtml, routes] = await Promise.all([
        readFile(distIndexPath, 'utf8'),
        getPublicRouteMetadata(publicDir),
      ])

      await Promise.all(
        routes.map(async (route) => {
          const routeHtml = applyRouteMetadata(indexHtml, route)

          if (route.path === '/') {
            await writeFile(distIndexPath, routeHtml)
            return
          }

          const outputDir = path.join(distDir, route.path.replace(/^\//, ''))
          await mkdir(outputDir, { recursive: true })
          await writeFile(path.join(outputDir, 'index.html'), routeHtml)
        }),
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), staticRouteHtmlPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'markdown': ['react-markdown', 'remark-gfm', 'rehype-highlight', 'rehype-raw'],
          'highlight': ['highlight.js', 'react-syntax-highlighter'],
        },
      },
    },
  },
})
