import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaMagnifyingGlass } from 'react-icons/fa6'
import { useSEO } from '../hooks/useSEO'
import { CONVERSIONS_METADATA } from '../seo.ts'
import { buildCategoryMetadata, getCategory } from '../lib/categories'

/** Convert a format id (e.g. "pdf/a") to a URL-safe slug ("pdf-a"). */
function toSlug(id: string) { return id.replace(/\//g, '-') }

const CONVERSIONS_URL =
  'https://raw.githubusercontent.com/transmute-app/conversion-compatibility/refs/heads/main/supported_conversions.json'
const MEDIA_TYPES_URL = '/reference_data/media_types.json'

interface Conversion {
  converter_name: string
  input_format: string
  output_format: string
}

interface MediaType {
  id?: string
  full_name?: string
  classification?: string
  extensions?: string[]
  aliases?: string[]
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/30 text-white rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function Conversions() {
  useSEO({
    title: CONVERSIONS_METADATA.title,
    description: CONVERSIONS_METADATA.description,
    path: CONVERSIONS_METADATA.path,
  })

  const [conversions, setConversions] = useState<Conversion[]>([])
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(CONVERSIONS_URL).then((response) => {
        if (!response.ok) throw new Error(`Conversions HTTP ${response.status}`)
        return response.json() as Promise<Conversion[]>
      }),
      fetch(MEDIA_TYPES_URL).then((response) => {
        if (!response.ok) throw new Error(`Media types HTTP ${response.status}`)
        return response.json() as Promise<MediaType[]>
      })
    ])
      .then(([conversionData, mediaTypeData]) => {
        setConversions(conversionData)
        setMediaTypes(mediaTypeData)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const categoryMetadata = useMemo(
    () => buildCategoryMetadata(mediaTypes),
    [mediaTypes],
  )

  const fullNameMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const mt of mediaTypes) {
      if (mt.id && mt.full_name) map.set(mt.id.toLowerCase(), mt.full_name)
    }
    return map
  }, [mediaTypes])

  // Group by input_format → Set of output_formats
  const grouped = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const { input_format, output_format } of conversions) {
      if (!map.has(input_format)) map.set(input_format, new Set())
      map.get(input_format)!.add(output_format)
    }
    return map
  }, [conversions])

  // Flat list enriched with category, sorted by category order then alphabetically
  const entries = useMemo(() => {
    return Array.from(grouped.entries())
      .map(([input, outputSet]) => {
        const outputs = Array.from(outputSet).sort()
        return {
          input,
          outputs,
          category: getCategory(categoryMetadata.formatToCategory, input),
        }
      })
      .sort((a, b) => {
        const ci =
          categoryMetadata.orderedCategories.indexOf(a.category) -
          categoryMetadata.orderedCategories.indexOf(b.category)
        return ci !== 0 ? ci : a.input.localeCompare(b.input)
      })
  }, [categoryMetadata, grouped])

  const presentCategories = useMemo(
    () =>
      categoryMetadata.orderedCategories.filter((category) =>
        entries.some((entry) => entry.category === category),
      ),
    [categoryMetadata, entries],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const results = entries.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false
      if (!q) return true
      return (
        e.input.toLowerCase().includes(q) ||
        e.outputs.some((o) => o.toLowerCase().includes(q))
      )
    })
    if (!q) return results
    return results.sort((a, b) => {
      const aMatch = a.input.toLowerCase().includes(q)
      const bMatch = b.input.toLowerCase().includes(q)
      if (aMatch !== bMatch) return aMatch ? -1 : 1
      return 0
    })
  }, [entries, search, activeCategory])

  const totalInputFormats = entries.length
  const totalPairs = conversions.length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Page header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Supported Conversions
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Every file format conversion Transmute can perform.
        </p>
        {!loading && !error && (
          <p className="mt-3 text-sm text-text-muted">
            <span className="text-white font-semibold">{totalInputFormats}</span> input
            formats ·{' '}
            <span className="text-white font-semibold">{totalPairs}</span> conversion
            pairs
          </p>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <>
          {/* Skeleton controls */}
          <div className="mb-8 flex flex-col gap-4">
            <div className="h-11 bg-surface-light/40 rounded-xl animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-8 w-20 bg-surface-light/30 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          {/* Skeleton cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-surface-light/40 border border-gray-700/50 rounded-xl p-5 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-16 bg-surface-light/50 rounded" />
                  <div className="h-5 w-14 bg-surface-light/30 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-6 w-12 bg-surface-dark/50 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-28">
          <p className="text-red-400 font-medium">Failed to load conversions</p>
          <p className="text-text-muted text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Controls */}
          <div className="mb-8 flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search formats — e.g. mp4, png, docx…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-light rounded-xl border border-gray-700/50 text-white placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors text-base sm:text-sm"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  activeCategory === null
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'text-text-muted border-gray-700/50 hover:text-white hover:bg-surface-light/60'
                }`}
              >
                All
              </button>
              {presentCategories.map((cat) => {
                const style =
                  categoryMetadata.categoryStyles.get(cat) ?? categoryMetadata.OTHER_CATEGORY_STYLE
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? null : cat)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      isActive
                        ? style.badge
                        : 'text-text-muted border-gray-700/50 hover:text-white hover:bg-surface-light/60'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-text-muted">
              No conversions match{search ? ` "${search}"` : ''}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(({ input, outputs, category }) => {
                const style =
                  categoryMetadata.categoryStyles.get(category) ??
                  categoryMetadata.OTHER_CATEGORY_STYLE
                const q = search.toLowerCase().trim()
                return (
                  <Link
                    key={input}
                    to={`/conversions/${toSlug(input.toLowerCase())}/`}
                    className="block bg-surface-light/40 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/70 transition-colors"
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-white text-base uppercase tracking-wide">
                        .<Highlight text={input} query={q} />
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}
                      >
                        {category}
                      </span>
                    </div>
                    {fullNameMap.get(input.toLowerCase()) && (
                      <p className="text-xs text-text-muted mb-4">
                        {fullNameMap.get(input.toLowerCase())}
                      </p>
                    )}
                    {!fullNameMap.get(input.toLowerCase()) && <div className="mb-3" />}

                    {/* Outputs */}
                    <div className="flex items-start gap-2">
                      <FaArrowRight className="text-text-muted mt-0.5 h-3 w-3 shrink-0" />
                      <div className="flex flex-wrap gap-1.5">
                        {outputs.map((o) => (
                          <Link
                            key={o}
                            to={`/conversions/${toSlug(o.toLowerCase())}/`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-xs bg-surface-dark/70 border border-gray-700/40 text-text-muted px-2 py-0.5 rounded-md hover:text-white hover:border-gray-600 transition-colors"
                          >
                            <Highlight text={o} query={q} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
