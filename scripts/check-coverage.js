#!/usr/bin/env node

/**
 * check-coverage.js
 *
 * Checks for:
 *   1. Formats in supported_conversions.json missing from media_types.json
 *   2. Formats in media_types.json missing a sample file in transmute-app/samples-examples
 *
 * Usage:  node scripts/check-coverage.js
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(__dirname, '..', 'public')
const MEDIA_TYPES_PATH = resolve(PUBLIC, 'reference_data', 'media_types.json')

const CONVERSIONS_URL =
  'https://raw.githubusercontent.com/transmute-app/conversion-compatibility/refs/heads/main/supported_conversions.json'
const SAMPLES_API_URL =
  'https://api.github.com/repos/transmute-app/transmute/contents/assets/samples'

// ── Helpers ──────────────────────────────────────────────────────────

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

function printSection(heading, items) {
  if (items.length === 0) {
    console.log(`\n✓ ${heading}: none`)
  } else {
    console.log(`\n✗ ${heading} (${items.length}):`)
    for (const item of items) {
      console.log(`  - ${item}`)
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  // Load local media types
  const mediaTypes = JSON.parse(readFileSync(MEDIA_TYPES_PATH, 'utf-8'))
  const mediaTypeIds = new Set(
    mediaTypes.filter((mt) => mt.id).map((mt) => mt.id.toLowerCase()),
  )

  // Also build a set of all known aliases/extensions for broader matching
  const allKnownFormats = new Set(mediaTypeIds)
  for (const mt of mediaTypes) {
    for (const ext of mt.extensions ?? []) allKnownFormats.add(ext.toLowerCase())
    for (const alias of mt.aliases ?? []) allKnownFormats.add(alias.toLowerCase())
  }

  // Fetch remote data
  console.log('Fetching supported conversions…')
  const conversions = await fetchJson(CONVERSIONS_URL)

  console.log('Fetching sample files list…')
  const sampleFiles = await fetchJson(SAMPLES_API_URL)
  const sampleNames = new Set(sampleFiles.map((f) => f.name.toLowerCase()))

  // ── Check 1: Conversion formats missing from media_types.json ────

  const conversionFormats = new Set()
  for (const { input_format, output_format } of conversions) {
    conversionFormats.add(input_format.toLowerCase())
    conversionFormats.add(output_format.toLowerCase())
  }

  const missingMediaTypes = Array.from(conversionFormats)
    .filter((fmt) => !allKnownFormats.has(fmt))
    .sort()

  printSection('Conversion formats missing from media_types.json', missingMediaTypes)

  // ── Check 2: Media types missing a sample file ───────────────────

  // Build a map of id → sample_file override
  const sampleFileOverrides = new Map()
  for (const mt of mediaTypes) {
    if (mt.id && mt.sample_file) {
      sampleFileOverrides.set(mt.id.toLowerCase(), mt.sample_file.toLowerCase())
    }
  }

  const missingSamples = Array.from(mediaTypeIds)
    .filter((id) => {
      // If there's an explicit sample_file override, check for that
      const override = sampleFileOverrides.get(id)
      if (override) {
        return !sampleNames.has(override)
      }
      // Otherwise check for any file starting with "id." in the samples directory
      for (const name of sampleNames) {
        if (name === id || name.startsWith(`${id}.`)) return false
      }
      return true
    })
    .sort()

  printSection('Media types missing a sample file in samples-examples', missingSamples)

  // ── Summary ──────────────────────────────────────────────────────

  const total = missingMediaTypes.length + missingSamples.length
  console.log('')
  if (total === 0) {
    console.log('All checks passed!')
  } else {
    console.log(`Found ${total} issue(s).`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exitCode = 1
})
