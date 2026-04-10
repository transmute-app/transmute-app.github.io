import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaArrowRight, FaDownload, FaArrowLeft } from 'react-icons/fa6'
import { useSEO } from '../hooks/useSEO'
import { buildCategoryMetadata, getCategory } from '../lib/categories'

const CONVERSIONS_URL =
  'https://raw.githubusercontent.com/transmute-app/conversion-compatibility/refs/heads/main/supported_conversions.json'
const MEDIA_TYPES_URL = '/reference_data/media_types.json'
const SAMPLES_BASE_URL =
  'https://github.com/transmute-app/transmute/blob/main/assets/samples'
const SAMPLES_RAW_URL =
  'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/samples'

interface Conversion {
  converter_name: string
  input_format: string
  output_format: string
}

interface MediaType {
  id?: string
  full_name?: string
  hide?: boolean
  classification?: string
  description?: string
  extensions?: string[]
  aliases?: string[]
  sample_file?: string
}

/** Convert a format id (e.g. "pdf/a") to a URL-safe slug ("pdf-a"). */
function toSlug(id: string) { return id.replace(/\//g, '-') }

/** Convert a URL slug ("pdf-a") back to the canonical format id ("pdf/a"). */
function fromSlug(slug: string) { return slug.replace(/-/g, '/') }

export default function FormatDetail() {
  const { format } = useParams<{ format: string }>()
  const urlSlug = format?.toLowerCase() ?? ''

  const [conversions, setConversions] = useState<Conversion[]>([])
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(CONVERSIONS_URL).then((r) => {
        if (!r.ok) throw new Error(`Conversions HTTP ${r.status}`)
        return r.json() as Promise<Conversion[]>
      }),
      fetch(MEDIA_TYPES_URL).then((r) => {
        if (!r.ok) throw new Error(`Media types HTTP ${r.status}`)
        return r.json() as Promise<MediaType[]>
      }),
    ])
      .then(([convData, mtData]) => {
        setConversions(convData)
        setMediaTypes(mtData)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Try exact match on the slug first, then try converting hyphens to slashes
  const formatId = useMemo(() => {
    const exact = mediaTypes.find((mt) => mt.id?.toLowerCase() === urlSlug)
    if (exact) return urlSlug
    const slashed = fromSlug(urlSlug)
    const found = mediaTypes.find((mt) => mt.id?.toLowerCase() === slashed)
    if (found) return slashed
    // Also check conversions for the slash variant
    const inConversions = conversions.some(
      (c) => c.input_format.toLowerCase() === slashed || c.output_format.toLowerCase() === slashed,
    )
    if (inConversions) return slashed
    return urlSlug
  }, [mediaTypes, conversions, urlSlug])

  const mediaType = useMemo(
    () => mediaTypes.find((mt) => mt.id?.toLowerCase() === formatId),
    [mediaTypes, formatId],
  )

  const isHidden = mediaType?.hide === true

  const categoryMetadata = useMemo(
    () => buildCategoryMetadata(mediaTypes),
    [mediaTypes],
  )

  const hiddenIds = useMemo(() => {
    const set = new Set<string>()
    for (const mt of mediaTypes) {
      if (mt.hide && mt.id) set.add(mt.id.toLowerCase())
    }
    return set
  }, [mediaTypes])

  const outputFormats = useMemo(() => {
    const set = new Set<string>()
    for (const c of conversions) {
      if (c.input_format.toLowerCase() === formatId) set.add(c.output_format)
    }
    return Array.from(set).sort()
  }, [conversions, formatId])

  const inputFormats = useMemo(() => {
    const set = new Set<string>()
    for (const c of conversions) {
      if (c.output_format.toLowerCase() === formatId) set.add(c.input_format)
    }
    return Array.from(set).sort()
  }, [conversions, formatId])

  const fullName = mediaType?.full_name ?? formatId.toUpperCase()
  const description = mediaType?.description
  const classification = mediaType?.classification

  useSEO({
    title: `${formatId.toUpperCase()} Converter — Convert ${fullName} Files`,
    description: description
      ? `Convert ${formatId.toUpperCase()} (${fullName}) files with Transmute. ${description}`
      : `Convert ${formatId.toUpperCase()} files to ${outputFormats.length} formats with Transmute — a free, self-hosted file converter.`,
    path: `/conversions/${toSlug(formatId)}/`,
  })

  const hasSampleFile = mediaType?.sample_file !== 'None'
  const sampleFileName = mediaType?.sample_file ?? `${formatId}.${formatId}`
  const sampleViewUrl = `${SAMPLES_BASE_URL}/${sampleFileName}`
  const sampleDownloadUrl = `${SAMPLES_RAW_URL}/${sampleFileName}`
  const category = getCategory(categoryMetadata.formatToCategory, formatId)
  const style = categoryMetadata.categoryStyles.get(category) ?? categoryMetadata.OTHER_CATEGORY_STYLE

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          {/* Back link skeleton */}
          <div className="h-4 w-32 bg-surface-light/30 rounded mb-8" />
          {/* Title skeleton */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-28 bg-surface-light/40 rounded-lg" />
              <div className="h-7 w-16 bg-surface-light/30 rounded-full" />
            </div>
            <div className="h-5 w-48 bg-surface-light/30 rounded mb-3" />
            <div className="h-4 w-full max-w-xl bg-surface-light/20 rounded" />
          </div>
          {/* Output formats skeleton */}
          <div className="mb-10">
            <div className="h-5 w-44 bg-surface-light/30 rounded mb-4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-8 w-14 bg-surface-light/30 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-28">
          <p className="text-red-400 font-medium">Failed to load data</p>
          <p className="text-text-muted text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  const hasConversions = outputFormats.length > 0 || inputFormats.length > 0

  if (isHidden || (!mediaType && !hasConversions)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-28">
          <p className="text-white text-xl font-semibold mb-2">Format not found</p>
          <p className="text-text-muted mb-6">
            No information available for "{formatId}".
          </p>
          <Link
            to="/conversions/"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            &larr; Browse all conversions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back link */}
      <Link
        to="/conversions/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 text-sm"
      >
        <FaArrowLeft className="h-3 w-3" />
        All conversions
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-mono uppercase tracking-wide">
            .{formatId}
          </h1>
          {classification && (
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full border ${style.badge}`}
            >
              <span className={`inline-block h-2 w-2 rounded-full mr-2 ${style.dot}`} />
              {category}
            </span>
          )}
        </div>
        {fullName && fullName !== formatId.toUpperCase() && (
          <p className="text-xl text-text-muted mb-3">{fullName}</p>
        )}
        {description && (
          <p className="text-text-muted leading-relaxed max-w-3xl">{description}</p>
        )}

        {/* Extensions & aliases */}
        {mediaType && (
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {mediaType.extensions && mediaType.extensions.length > 0 && (
              <div>
                <span className="text-text-muted">Extensions: </span>
                <span className="text-white font-mono">
                  {mediaType.extensions.map((e) => `.${e}`).join(', ')}
                </span>
              </div>
            )}
            {mediaType.aliases && mediaType.aliases.filter((a) => a.toLowerCase() !== formatId).length > 0 && (
              <div>
                <span className="text-text-muted">Also known as: </span>
                <span className="text-white">
                  {mediaType.aliases.filter((a) => a.toLowerCase() !== formatId).join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Sample file download */}
        {hasSampleFile && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => {
              fetch(sampleDownloadUrl)
                .then((r) => r.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = sampleFileName
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  URL.revokeObjectURL(url)
                })
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors text-sm font-medium cursor-pointer"
          >
            <FaDownload className="h-3.5 w-3.5" />
            Download sample .{formatId} file
          </button>
          <a
            href={sampleViewUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-text-muted border border-gray-700/50 hover:text-white hover:bg-surface-light/60 transition-colors text-sm font-medium"
          >
            View on GitHub
          </a>
        </div>
        )}
      </div>

      {/* Convert FROM this format */}
      {outputFormats.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaArrowRight className="h-4 w-4 text-text-muted" />
            Convert .{formatId} to…
            <span className="text-text-muted font-normal text-sm">
              ({outputFormats.length} format{outputFormats.length !== 1 && 's'})
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {outputFormats.map((fmt) => {
              const fmtCategory = getCategory(categoryMetadata.formatToCategory, fmt)
              const fmtStyle = categoryMetadata.categoryStyles.get(fmtCategory) ?? categoryMetadata.OTHER_CATEGORY_STYLE
              const isHiddenFmt = hiddenIds.has(fmt.toLowerCase())
              return isHiddenFmt ? (
                <span
                  key={fmt}
                  className={`font-mono text-sm px-3 py-1.5 rounded-lg border ${fmtStyle.badge}`}
                >
                  .{fmt}
                </span>
              ) : (
                <Link
                  key={fmt}
                  to={`/conversions/${toSlug(fmt.toLowerCase())}/`}
                  className={`font-mono text-sm px-3 py-1.5 rounded-lg border transition-colors hover:scale-105 ${fmtStyle.badge}`}
                >
                  .{fmt}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Convert TO this format */}
      {inputFormats.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaArrowRight className="h-4 w-4 text-text-muted rotate-180" />
            Convert to .{formatId} from…
            <span className="text-text-muted font-normal text-sm">
              ({inputFormats.length} format{inputFormats.length !== 1 && 's'})
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {inputFormats.map((fmt) => {
              const fmtCategory = getCategory(categoryMetadata.formatToCategory, fmt)
              const fmtStyle = categoryMetadata.categoryStyles.get(fmtCategory) ?? categoryMetadata.OTHER_CATEGORY_STYLE
              const isHiddenFmt = hiddenIds.has(fmt.toLowerCase())
              return isHiddenFmt ? (
                <span
                  key={fmt}
                  className={`font-mono text-sm px-3 py-1.5 rounded-lg border ${fmtStyle.badge}`}
                >
                  .{fmt}
                </span>
              ) : (
                <Link
                  key={fmt}
                  to={`/conversions/${toSlug(fmt.toLowerCase())}/`}
                  className={`font-mono text-sm px-3 py-1.5 rounded-lg border transition-colors hover:scale-105 ${fmtStyle.badge}`}
                >
                  .{fmt}
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
