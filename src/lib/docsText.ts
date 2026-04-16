function toText(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (value && typeof value === 'object' && 'default' in value) {
    const defaultValue = (value as { default?: unknown }).default
    if (typeof defaultValue === 'string') {
      return defaultValue
    }
  }

  return ''
}

function stripDiacritics(value: unknown) {
  return toText(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
}

export function normalizeWhitespace(value: unknown) {
  return toText(value).replace(/\s+/g, ' ').trim()
}

export function stripFrontmatter(value: unknown) {
  return toText(value).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function stripMarkdownInline(value: unknown) {
  return normalizeWhitespace(
    toText(value)
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[*~]+/g, '')
      .replace(/(?<=\s|^)_+|_+(?=\s|$)/g, '')
      .replace(/\\([`*_{}[\]()#+.!-])/g, '$1')
  )
}

export function slugifyHeading(value: string) {
  return stripDiacritics(stripMarkdownInline(value))
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}