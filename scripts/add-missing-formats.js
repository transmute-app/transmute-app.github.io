#!/usr/bin/env node

/**
 * add-missing-formats.js
 *
 * Fetches supported_conversions.json from the conversion-compatibility repo,
 * finds formats that are missing from media_types.json, and adds empty
 * stub entries for each one (sorted by id).
 *
 * Usage:  node scripts/add-missing-formats.js
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MEDIA_TYPES_PATH = resolve(__dirname, '..', 'public', 'reference_data', 'media_types.json')

const CONVERSIONS_REPO = {
  owner: 'transmute-app',
  repo: 'conversion-compatibility',
  path: 'supported_conversions.json',
  ref: 'main',
}

async function fetchGitHubRepoJson({ owner, repo, path, ref }) {
  const url = new URL(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
  url.searchParams.set('ref', ref)

  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'transmute-app.github.io scripts/add-missing-formats',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)

  const payload = await res.json()
  if (payload.encoding !== 'base64' || typeof payload.content !== 'string') {
    throw new Error(`Unexpected GitHub contents response for ${url}`)
  }

  return JSON.parse(Buffer.from(payload.content, 'base64').toString('utf8'))
}

async function main() {
  const mediaTypes = JSON.parse(readFileSync(MEDIA_TYPES_PATH, 'utf-8'))

  // Build a set of all known format identifiers (id, extensions, aliases)
  const allKnownFormats = new Set()
  for (const mt of mediaTypes) {
    if (mt.id) allKnownFormats.add(mt.id.toLowerCase())
    for (const ext of mt.extensions ?? []) allKnownFormats.add(ext.toLowerCase())
    for (const alias of mt.aliases ?? []) allKnownFormats.add(alias.toLowerCase())
  }

  console.log('Fetching supported conversions…')
  const conversions = await fetchGitHubRepoJson(CONVERSIONS_REPO)

  // Collect all unique format ids from conversions
  const conversionFormats = new Set()
  for (const { input_format, output_format } of conversions) {
    conversionFormats.add(input_format.toLowerCase())
    conversionFormats.add(output_format.toLowerCase())
  }

  // Find formats missing from media_types.json
  const missing = Array.from(conversionFormats)
    .filter((fmt) => !allKnownFormats.has(fmt))
    .sort()

  if (missing.length === 0) {
    console.log('No missing formats — media_types.json is already complete.')
    return
  }

  console.log(`Adding ${missing.length} stub entries: ${missing.join(', ')}`)

  // Create stub entries
  for (const id of missing) {
    mediaTypes.push({
      id,
      full_name: '',
      classification: '',
      description: '',
      extensions: [id],
      aliases: [id],
    })
  }

  // Sort the full list by id
  mediaTypes.sort((a, b) =>
    (a.id ?? '').localeCompare(b.id ?? '', undefined, { sensitivity: 'base' }),
  )

  writeFileSync(MEDIA_TYPES_PATH, JSON.stringify(mediaTypes, null, 2) + '\n')
  console.log(`Done. media_types.json now has ${mediaTypes.length} entries.`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exitCode = 1
})
