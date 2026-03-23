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

const CONVERSIONS_URL =
  'https://raw.githubusercontent.com/transmute-app/conversion-compatibility/refs/heads/main/supported_conversions.json'

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
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
  const conversions = await fetchJson(CONVERSIONS_URL)

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
