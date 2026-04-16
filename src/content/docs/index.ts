import type { ComponentType } from 'react'

export interface DocMeta {
  title: string
  description?: string
  order?: number
}

export interface DocEntry {
  slug: string
  meta: DocMeta
  Component: ComponentType
  content: string
}

function getStringExport(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && 'default' in value) {
    const defaultValue = (value as { default?: unknown }).default
    if (typeof defaultValue === 'string') {
      return defaultValue
    }
  }

  return ''
}

const modules = import.meta.glob<{
  default: ComponentType
  frontmatter: DocMeta
}>('./*.mdx', { eager: true })

const rawModules = import.meta.glob('./*.mdx', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, unknown>

export const docs: DocEntry[] = Object.entries(modules)
  .map(([filePath, mod]) => ({
    slug: filePath.replace(/^\.\//, '').replace(/\.mdx$/, ''),
    meta: mod.frontmatter,
    Component: mod.default,
    content: getStringExport(rawModules[filePath]),
  }))
  .sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99))

export function getDocBySlug(slug: string): DocEntry | undefined {
  return docs.find((d) => d.slug === slug)
}
