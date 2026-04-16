import { escapeRegExp, normalizeWhitespace } from './docsText'

export interface DocsSearchEntry {
  slug: string
  title: string
  description: string
  sectionTitle: string
  headingId: string
  text: string
}

export interface LocalSearchResult {
  slug: string
  title: string
  sectionTitle: string
  headingId: string
  excerpt: string
  matchText: string
}

function createExcerpt(text: string, matchText: string) {
  if (!text) {
    return ''
  }

  const lowerText = text.toLowerCase()
  const lowerMatch = matchText.toLowerCase()
  const index = lowerText.indexOf(lowerMatch)
  if (index < 0) {
    return text.slice(0, 160)
  }

  const start = Math.max(0, index - 56)
  const end = Math.min(text.length, index + matchText.length + 88)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  return `${prefix}${text.slice(start, end).trim()}${suffix}`
}

function scoreSection(section: DocsSearchEntry, query: string, terms: string[]) {
  const docTitle = section.title.toLowerCase()
  const docDescription = section.description.toLowerCase()
  const slug = section.slug.toLowerCase()
  const sectionTitle = section.sectionTitle.toLowerCase()
  const text = section.text.toLowerCase()
  const exactIndex = text.indexOf(query)
  let score = 0

  if (docTitle.includes(query)) score += 28
  if (docDescription.includes(query)) score += 16
  if (slug.includes(query)) score += 18
  if (sectionTitle.includes(query)) score += 54
  if (exactIndex >= 0) score += 96

  for (const term of terms) {
    if (docTitle.includes(term)) score += 10
    if (docDescription.includes(term)) score += 6
    if (slug.includes(term)) score += 8
    if (sectionTitle.includes(term)) score += 18
    if (text.includes(term)) score += 14
  }

  return score
}

export function highlightQuery(text: string, query: string) {
  const normalizedQuery = normalizeWhitespace(query)
  if (!normalizedQuery) {
    return [{ text, match: false }]
  }

  const matcher = new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'ig')
  const parts = text.split(matcher).filter(Boolean)
  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === normalizedQuery.toLowerCase(),
  }))
}

export function searchDocs(index: DocsSearchEntry[], query: string, limit = 8): LocalSearchResult[] {
  const normalizedQuery = normalizeWhitespace(query).toLowerCase()
  if (!normalizedQuery) {
    return []
  }

  const terms = normalizedQuery.split(' ').filter((term) => term.length > 1)
  const scoredResults = index
    .map((section) => {
      const score = scoreSection(section, normalizedQuery, terms)
      if (score === 0) {
        return null
      }

      const matchedTerm = section.text.toLowerCase().includes(normalizedQuery)
        ? normalizedQuery
        : terms.find((term) => section.text.toLowerCase().includes(term) || section.sectionTitle.toLowerCase().includes(term) || section.title.toLowerCase().includes(term)) ?? normalizedQuery

      return {
        score,
        result: {
          slug: section.slug,
          title: section.title,
          sectionTitle: section.sectionTitle,
          headingId: section.headingId,
          excerpt: createExcerpt(section.text, matchedTerm),
          matchText: matchedTerm,
        },
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((left, right) => right.score - left.score || left.result.title.localeCompare(right.result.title))

  const deduped: LocalSearchResult[] = []
  const seen = new Set<string>()
  for (const entry of scoredResults) {
    const key = `${entry.result.slug}:${entry.result.headingId}:${entry.result.matchText}`
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(entry.result)
    }
    if (deduped.length >= limit) {
      break
    }
  }

  return deduped
}