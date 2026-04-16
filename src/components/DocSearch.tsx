import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { highlightQuery, searchDocs, type DocsSearchEntry, type LocalSearchResult } from '../lib/docsSearch'

export default function DocSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [searchIndex, setSearchIndex] = useState<DocsSearchEntry[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const deferredQuery = useDeferredValue(query)
  const results = deferredQuery.trim() ? searchDocs(searchIndex, deferredQuery) : []
  const selectedIndex = Math.min(activeIndex, Math.max(results.length - 1, 0))

  useEffect(() => {
    let cancelled = false

    fetch('/docs-search.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load local search index')
        }

        return response.json() as Promise<DocsSearchEntry[]>
      })
      .then((data) => {
        if (!cancelled) {
          setSearchIndex(Array.isArray(data) ? data : [])
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSearchIndex([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(result: LocalSearchResult) {
    const search = new URLSearchParams({
      match: result.matchText,
      section: result.headingId,
    })

    navigate({
      pathname: `/docs/${result.slug}/`,
      search: `?${search.toString()}`,
      hash: result.headingId ? `#${result.headingId}` : '',
    })

    setQuery('')
    setOpen(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % results.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + results.length) % results.length)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      handleSelect(results[selectedIndex])
      return
    }

    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative mb-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const nextQuery = e.target.value
            setQuery(nextQuery)
            setActiveIndex(0)
            setOpen(Boolean(nextQuery.trim()))
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search docs..."
          aria-label="Search documentation"
          aria-controls="docs-search-results"
          aria-expanded={open}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-surface-light/50 border border-gray-700/50 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
        />
      </div>
      {open && query.trim() && (
        <div id="docs-search-results" className="absolute z-50 top-full mt-1 w-full bg-surface-dark border border-gray-700/50 rounded-lg shadow-xl overflow-hidden">
          {results.map((result, i) => (
            <button
              key={`${result.slug}-${result.headingId}-${i}`}
              onClick={() => handleSelect(result)}
              className={`w-full text-left px-3 py-3 transition-colors border-b border-gray-800/40 last:border-b-0 ${selectedIndex === i ? 'bg-surface-light/60' : 'hover:bg-surface-light/50'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-white">{result.title}</div>
                {result.sectionTitle !== result.title && (
                  <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted">{result.sectionTitle}</div>
                )}
              </div>
              <div className="text-xs text-text-muted line-clamp-2 mt-1 leading-5">
                {highlightQuery(result.excerpt, result.matchText).map((part, partIndex) => (
                  <span
                    key={`${part.text}-${partIndex}`}
                    className={part.match ? 'text-primary-light font-medium bg-primary/10 rounded px-0.5' : undefined}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </button>
          ))}
          {results.length === 0 && (
            <div className="px-3 py-3 text-sm text-text-muted">No local matches found.</div>
          )}
        </div>
      )}
    </div>
  )
}
