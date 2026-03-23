#!/usr/bin/env node

/**
 * sort-media-types.js
 *
 * Sorts media_types.json entries alphabetically by their "id" field.
 *
 * Usage:  node scripts/sort-media-types.js
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MEDIA_TYPES_PATH = resolve(__dirname, '..', 'public', 'reference_data', 'media_types.json')

const mediaTypes = JSON.parse(readFileSync(MEDIA_TYPES_PATH, 'utf-8'))

const sorted = [...mediaTypes].sort((a, b) =>
  (a.id ?? '').localeCompare(b.id ?? '', undefined, { sensitivity: 'base' }),
)

writeFileSync(MEDIA_TYPES_PATH, JSON.stringify(sorted, null, 2) + '\n')

console.log(`Sorted ${sorted.length} entries in media_types.json by id.`)
