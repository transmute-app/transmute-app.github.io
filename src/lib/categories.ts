export type CategoryStyle = { badge: string; dot: string }

const OTHER_CATEGORY = 'Other'

const RAINBOW_STYLES: CategoryStyle[] = [
  { badge: 'text-red-400 bg-red-400/10 border-red-400/20', dot: 'bg-red-400' },
  { badge: 'text-orange-400 bg-orange-400/10 border-orange-400/20', dot: 'bg-orange-400' },
  { badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20', dot: 'bg-amber-400' },
  { badge: 'text-green-400 bg-green-400/10 border-green-400/20', dot: 'bg-green-400' },
  { badge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', dot: 'bg-cyan-400' },
  { badge: 'text-blue-400 bg-blue-400/10 border-blue-400/20', dot: 'bg-blue-400' },
  { badge: 'text-violet-400 bg-violet-400/10 border-violet-400/20', dot: 'bg-violet-400' },
]

const OTHER_CATEGORY_STYLE: CategoryStyle = {
  badge: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  dot: 'bg-gray-400',
}

interface MediaTypeEntry {
  id?: string
  classification?: string
  extensions?: string[]
  aliases?: string[]
}

function toCategoryLabel(classification: string | undefined): string {
  const normalized = classification?.trim().toLowerCase()
  if (!normalized) return OTHER_CATEGORY

  return normalized
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function buildCategoryMetadata(mediaTypes: MediaTypeEntry[]) {
  const formatToCategory = new Map<string, string>()
  const categoryCounts = new Map<string, number>()

  for (const mediaType of mediaTypes) {
    const category = toCategoryLabel(mediaType.classification)
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1)

    const formats = new Set<string>()
    if (mediaType.id) formats.add(mediaType.id)
    for (const extension of mediaType.extensions ?? []) formats.add(extension)
    for (const alias of mediaType.aliases ?? []) formats.add(alias)

    for (const format of formats) {
      const normalizedFormat = format.trim().toLowerCase()
      if (!normalizedFormat) continue
      if (!formatToCategory.has(normalizedFormat)) {
        formatToCategory.set(normalizedFormat, category)
      }
    }
  }

  categoryCounts.delete(OTHER_CATEGORY)

  const orderedCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]
      return a[0].localeCompare(b[0])
    })
    .map(([category]) => category)

  const categoryStyles = new Map<string, CategoryStyle>()
  orderedCategories.forEach((category, index) => {
    categoryStyles.set(category, RAINBOW_STYLES[index % RAINBOW_STYLES.length])
  })
  categoryStyles.set(OTHER_CATEGORY, OTHER_CATEGORY_STYLE)

  return {
    formatToCategory,
    orderedCategories: [...orderedCategories, OTHER_CATEGORY],
    categoryStyles,
    OTHER_CATEGORY_STYLE,
  }
}

export function getCategory(formatToCategory: Map<string, string>, fmt: string): string {
  return formatToCategory.get(fmt.toLowerCase()) ?? OTHER_CATEGORY
}
