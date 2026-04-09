#!/usr/bin/env node

/**
 * generate-seo.js
 *
 * Reads public/docs/manifest.json + the markdown files and outputs:
 *   - public/sitemap.xml
 *   - public/llms.txt
 *   - public/llms-full.txt
 *
 * Usage:  node scripts/generate-seo.js
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import fm from 'front-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(__dirname, '..', 'public')
const DOCS = resolve(PUBLIC, 'docs')
const MEDIA_TYPES_PATH = resolve(PUBLIC, 'reference_data', 'media_types.json')

const SITE_URL = 'https://transmute.sh'

// ── Shared intro block (used by llms.txt and llms-full.txt) ──────────

const INTRO = `# Transmute

> Transmute is a free, open-source, self-hosted file converter. Convert images, video, audio, data, documents, and more on your own hardware with Docker. No file size limits, no watermarks, no third-party uploads — full privacy.

Transmute is a self-hosted alternative to cloud-based file converters like CloudConvert, FreeConvert, and Convertio. It runs entirely on your own hardware via Docker, keeping all files private. It supports converting between hundreds of formats across images (PNG, JPG, WebP, SVG, BMP, HEIC), video (MKV, MP4, MOV, AVI, WebM), audio (MP3, WAV, FLAC, AAC, OGG), documents (PDF, DOCX, TXT, Markdown, HTML), data (CSV, JSON, YAML, Parquet), diagrams (draw.io), fonts, subtitles, and more. It has a clean web UI, a full REST API, built-in authentication with per-user data isolation, and seven built-in themes.

- License: MIT
- Source Code: https://github.com/transmute-app/transmute
- Docker Image: ghcr.io/transmute-app/transmute:main`

// ── Static pages (non-doc routes) ────────────────────────────────────

const STATIC_PAGES = [
  { path: '/',             changefreq: 'weekly', priority: '1.0', label: 'Home', desc: 'Overview of the self-hosted file converter.' },
  { path: '/docs/',        changefreq: 'weekly', priority: '0.8' },
  { path: '/conversions/', changefreq: 'daily',  priority: '0.9', label: 'Supported Conversions', desc: 'Browse every file format conversion supported by Transmute.' },
]

// ── Load docs ────────────────────────────────────────────────────────

const manifest = JSON.parse(readFileSync(resolve(DOCS, 'manifest.json'), 'utf-8'))

const docs = manifest
  .map((file) => {
    const raw = readFileSync(resolve(DOCS, file), 'utf-8')
    const { attributes, body } = fm(raw)
    const slug = file.replace(/\.md$/, '')
    return { slug, title: attributes.title, description: attributes.description, order: attributes.order ?? 99, body }
  })
  .sort((a, b) => a.order - b.order)

// ── Load media types ─────────────────────────────────────────────────

const mediaTypes = JSON.parse(readFileSync(MEDIA_TYPES_PATH, 'utf-8'))
  .filter((mt) => mt.id && !mt.hide)

// ── Generate sitemap.xml ─────────────────────────────────────────────

function generateSitemap() {
  const urls = [
    ...STATIC_PAGES.map(({ path, changefreq, priority }) =>
      `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    ),
    ...docs.map(({ slug }) =>
      `  <url>\n    <loc>${SITE_URL}/docs/${slug}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    ),
    ...mediaTypes.map(({ id }) =>
      `  <url>\n    <loc>${SITE_URL}/conversions/${id.replace(/\//g, '-')}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    ),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

// ── Generate llms.txt ────────────────────────────────────────────────

function generateLlmsTxt() {
  const docLinks = docs
    .map(({ slug, title, description }) =>
      `- [${title}](${SITE_URL}/docs/${slug}/): ${description}`)
    .join('\n')

  const pageLinks = STATIC_PAGES
    .filter((p) => p.label)
    .map(({ path, label, desc }) =>
      `- [${label}](${SITE_URL}${path}): ${desc}`)
    .join('\n')

  return `${INTRO}

## Documentation

${docLinks}

## Pages

${pageLinks}

## Optional

- [Full Documentation for LLMs](${SITE_URL}/llms-full.txt): Complete documentation content in a single file.
`
}

// ── Generate llms-full.txt ───────────────────────────────────────────

function generateLlmsFullTxt() {
  const sections = docs.map(({ body }) => body.trim()).join('\n\n---\n\n')
  return `${INTRO}\n\n---\n\n${sections}\n`
}

// ── Write files ──────────────────────────────────────────────────────

writeFileSync(resolve(PUBLIC, 'sitemap.xml'), generateSitemap())
writeFileSync(resolve(PUBLIC, 'llms.txt'), generateLlmsTxt())
writeFileSync(resolve(PUBLIC, 'llms-full.txt'), generateLlmsFullTxt())

console.log('✓ sitemap.xml')
console.log('✓ llms.txt')
console.log('✓ llms-full.txt')
