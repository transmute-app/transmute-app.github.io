import { useEffect, useState, useMemo } from 'react'
import { FaArrowRight, FaMagnifyingGlass, FaCircleNotch } from 'react-icons/fa6'
import { useSEO } from '../hooks/useSEO'

const CONVERSIONS_URL =
  'https://raw.githubusercontent.com/transmute-app/conversion-compatibility/refs/heads/main/supported_conversions.json'

interface Conversion {
  converter_name: string
  input_format: string
  output_format: string
}

const IMAGE_FORMATS = new Set([
  'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'tiff', 'tif', 'svg', 'ico',
  'heic', 'heif', 'pbm', 'pgm', 'ppm', 'sgi', 'tga', 'pcx', 'jp2',
])
const VIDEO_FORMATS = new Set([
  'mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'mpg', 'mpeg', 'ts',
  'm4v', '3gp', 'f4v', 'ogv', 'asf', 'gif',
])
const AUDIO_FORMATS = new Set([
  'mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'oga', 'opus', 'wma', 'ac3',
  'mka', 'mp2', 'aiff',
])
const DOCUMENT_FORMATS = new Set([
  'pdf', 'docx', 'odt', 'epub', 'md', 'txt', 'html', 'rst', 'tex', 'org',
  'rtf', 'latex', 'textile', 'dbk', 'mediawiki', 'ipynb', 'muse', 'opml',
  'jira', 'asciidoc', 'fb2',
])
const PRESENTATION_FORMATS = new Set<string>([
  'pptx', 'ppt', 'odp', 'key', 'pps', 'ppsx', 'pot', 'potx',
])
const DATA_FORMATS = new Set([
  'csv', 'json', 'xlsx', 'yaml', 'parquet',
])
const DIAGRAM_FORMATS = new Set([
  'drawio',
])
const CAD_FORMATS = new Set<string>([
  'dwg', 'dxf', 'step', 'stp', 'iges', 'igs',
])
const MODEL_3D_FORMATS = new Set<string>([
  'stl', 'obj', 'fbx', 'gltf', 'glb', '3ds', 'blend', 'ply', 'dae', 'amf', '3mf',
])
const AUDIOBOOK_FORMATS = new Set<string>([
  'm4b', 'aax', 'aa',
])
const ARCHIVE_FORMATS = new Set<string>([
  'zip', 'tar', 'gz', 'bz2', '7z', 'rar', 'xz', 'zst',
])
const FONT_FORMATS = new Set<string>([
  'ttf', 'otf', 'woff', 'woff2', 'eot',
])
const SUBTITLE_FORMATS = new Set<string>([
  'srt', 'vtt', 'ass', 'ssa', 'sub',
])

function getCategory(fmt: string, outputs?: string[]): string {
  const f = fmt.toLowerCase()
  if (DIAGRAM_FORMATS.has(f)) return 'Diagrams'
  // gif is ambiguous; treat it as Image when it appears as input to image converters
  // but the set membership already handles it — VIDEO_FORMATS wins because we check Image first here
  if (IMAGE_FORMATS.has(f) && !VIDEO_FORMATS.has(f)) return 'Image'
  if (VIDEO_FORMATS.has(f)) return 'Video'
  if (AUDIO_FORMATS.has(f)) return 'Audio'
  if (AUDIOBOOK_FORMATS.has(f)) return 'Audiobook'
  if (DOCUMENT_FORMATS.has(f)) return 'Document'
  if (DATA_FORMATS.has(f)) return 'Data'
  if (PRESENTATION_FORMATS.has(f)) return 'Presentation'
  if (CAD_FORMATS.has(f)) return 'CAD'
  if (MODEL_3D_FORMATS.has(f)) return '3D Model'
  if (ARCHIVE_FORMATS.has(f)) return 'Archive'
  if (FONT_FORMATS.has(f)) return 'Font'
  if (SUBTITLE_FORMATS.has(f)) return 'Subtitle'

  // Unknown input format — infer from output formats (most common non-Other category wins)
  if (outputs && outputs.length > 0) {
    const counts = new Map<string, number>()
    for (const o of outputs) {
      const cat = getCategory(o)
      if (cat !== 'Other') counts.set(cat, (counts.get(cat) ?? 0) + 1)
    }
    if (counts.size > 0) {
      return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0]
    }
  }

  return 'Other'
}

// Categories are shown in this order; empty ones are automatically hidden by presentCategories.
const CATEGORY_ORDER = [
  'Image', 'Video', 'Audio', 'Audiobook',
  'Document', 'Presentation', 'Data', 'Diagrams',
  'CAD', '3D Model', 'Archive', 'Font', 'Subtitle',
  'Other',
]

const CATEGORY_STYLES: Record<string, { badge: string; dot: string }> = {
  Image:     { badge: 'text-blue-400 bg-blue-400/10 border-blue-400/20',     dot: 'bg-blue-400' },
  Video:     { badge: 'text-purple-400 bg-purple-400/10 border-purple-400/20', dot: 'bg-purple-400' },
  Audio:     { badge: 'text-green-400 bg-green-400/10 border-green-400/20',   dot: 'bg-green-400' },
  Audiobook: { badge: 'text-lime-400 bg-lime-400/10 border-lime-400/20',      dot: 'bg-lime-400' },
  Document:  { badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20',   dot: 'bg-amber-400' },
  Data:         { badge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',      dot: 'bg-cyan-400' },
  Presentation: { badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', dot: 'bg-yellow-400' },
  Diagrams:     { badge: 'text-primary bg-primary/10 border-primary/20',         dot: 'bg-primary' },
  CAD:       { badge: 'text-orange-400 bg-orange-400/10 border-orange-400/20', dot: 'bg-orange-400' },
  '3D Model':{ badge: 'text-rose-400 bg-rose-400/10 border-rose-400/20',      dot: 'bg-rose-400' },
  Archive:   { badge: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', dot: 'bg-indigo-400' },
  Font:      { badge: 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20', dot: 'bg-fuchsia-400' },
  Subtitle:  { badge: 'text-sky-400 bg-sky-400/10 border-sky-400/20',         dot: 'bg-sky-400' },
  Other:     { badge: 'text-gray-400 bg-gray-400/10 border-gray-400/20',      dot: 'bg-gray-400' },
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
    title: 'Supported Conversions | Transmute',
    description:
      'Browse every file format conversion supported by Transmute — images, video, audio, documents, data, and diagrams.',
    path: '/conversions',
  })

  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    fetch(CONVERSIONS_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<Conversion[]>
      })
      .then((data) => {
        setConversions(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

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
        return { input, outputs, category: getCategory(input, outputs) }
      })
      .sort((a, b) => {
        const ci =
          CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
        return ci !== 0 ? ci : a.input.localeCompare(b.input)
      })
  }, [grouped])

  const presentCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => entries.some((e) => e.category === c)),
    [entries],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const results = entries.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false
      if (!q) return true
      return e.input.includes(q) || e.outputs.some((o) => o.includes(q))
    })
    if (!q) return results
    return results.sort((a, b) => {
      const aMatch = a.input.includes(q)
      const bMatch = b.input.includes(q)
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
        <div className="flex flex-col items-center justify-center py-28 gap-4 text-text-muted">
          <FaCircleNotch className="animate-spin h-8 w-8" />
          <span>Loading conversions…</span>
        </div>
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
                const style = CATEGORY_STYLES[cat] ?? CATEGORY_STYLES.Other
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
                const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Other
                const q = search.toLowerCase().trim()
                return (
                  <div
                    key={input}
                    className="bg-surface-light/40 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/70 transition-colors"
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono font-bold text-white text-base uppercase tracking-wide">
                        .<Highlight text={input} query={q} />
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}
                      >
                        {category}
                      </span>
                    </div>

                    {/* Outputs */}
                    <div className="flex items-start gap-2">
                      <FaArrowRight className="text-text-muted mt-0.5 h-3 w-3 shrink-0" />
                      <div className="flex flex-wrap gap-1.5">
                        {outputs.map((o) => (
                          <span
                            key={o}
                            className="font-mono text-xs bg-surface-dark/70 border border-gray-700/40 text-text-muted px-2 py-0.5 rounded-md hover:text-white hover:border-gray-600 transition-colors"
                          >
                            <Highlight text={o} query={q} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
