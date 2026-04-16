import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { DOCS_METADATA } from '../seo.ts'
import { docs, getDocBySlug } from '../content/docs/index.ts'
import { DocsProvider } from '../components/DocsProvider.tsx'
import DocSearch from '../components/DocSearch.tsx'

function forceScrollTop() {
  window.scrollTo(0, 0)
}

function clearSearchHighlights(root: HTMLElement) {
  root.querySelectorAll('mark[data-doc-search-highlight="true"]').forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) {
      return
    }

    parent.replaceChild(document.createTextNode(mark.textContent ?? ''), mark)
    parent.normalize()
  })
}

function getSectionNodes(root: HTMLElement, sectionId: string) {
  const heading = root.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`)
  if (!heading || !/^H[1-6]$/.test(heading.tagName)) {
    return [root]
  }

  const headingLevel = Number(heading.tagName.slice(1))
  const nodes: Node[] = []
  let current: ChildNode | null = heading

  while (current) {
    if (current !== heading && current instanceof HTMLElement && /^H[1-6]$/.test(current.tagName)) {
      const currentLevel = Number(current.tagName.slice(1))
      if (currentLevel <= headingLevel) {
        break
      }
    }

    nodes.push(current)
    current = current.nextSibling
  }

  return nodes.length > 0 ? nodes : [root]
}

function findAndHighlight(nodes: Node[], lowerMatch: string, matchLength: number, filter: 'prose' | 'code' | 'heading') {
  for (const node of nodes) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode(textNode) {
        const parent = textNode.parentElement
        if (!parent || !textNode.textContent?.trim()) {
          return NodeFilter.FILTER_REJECT
        }

        if (parent.closest('script, style, mark[data-doc-search-highlight="true"]')) {
          return NodeFilter.FILTER_REJECT
        }

        const inCode = parent.closest('pre, code, kbd, samp')
        const inHeading = parent.closest('h1, h2, h3, h4, h5, h6')

        if (filter === 'prose' && (inCode || inHeading)) {
          return NodeFilter.FILTER_REJECT
        }

        if (filter === 'code' && !inCode) {
          return NodeFilter.FILTER_REJECT
        }

        if (filter === 'heading' && !inHeading) {
          return NodeFilter.FILTER_REJECT
        }

        return NodeFilter.FILTER_ACCEPT
      },
    })

    let currentNode = walker.nextNode()
    while (currentNode) {
      const textNode = currentNode as Text
      const textValue = textNode.textContent ?? ''
      const matchIndex = textValue.toLowerCase().indexOf(lowerMatch)
      if (matchIndex >= 0) {
        const matchedNode = textNode.splitText(matchIndex)
        matchedNode.splitText(matchLength)

        const mark = document.createElement('mark')
        mark.dataset.docSearchHighlight = 'true'
        mark.className = 'doc-search-highlight'
        mark.textContent = matchedNode.textContent
        matchedNode.parentNode?.replaceChild(mark, matchedNode)
        return mark
      }

      currentNode = walker.nextNode()
    }
  }

  return null
}

function highlightFirstMatch(nodes: Node[], matchText: string) {
  const lowerMatch = matchText.toLowerCase()
  return findAndHighlight(nodes, lowerMatch, matchText.length, 'prose')
    ?? findAndHighlight(nodes, lowerMatch, matchText.length, 'code')
    ?? findAndHighlight(nodes, lowerMatch, matchText.length, 'heading')
}

export default function Docs() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const activeDoc = slug ? getDocBySlug(slug) : undefined
  const DocContent = activeDoc?.Component

  function handleSidebarNavigation() {
    setSidebarOpen(false)
    forceScrollTop()
  }

  useSEO({
    title: activeDoc?.meta.title ? `${activeDoc.meta.title} — Docs` : 'Documentation',
    description: activeDoc?.meta.description ?? DOCS_METADATA.description,
    path: slug ? `/docs/${slug}/` : '/docs/',
  })

  // If no slug selected, redirect to first doc
  useEffect(() => {
    if (!slug && docs.length > 0) {
      navigate(`/docs/${docs[0].slug}/`, { replace: true })
    }
  }, [navigate, slug])

  useLayoutEffect(() => {
    const params = new URLSearchParams(location.search)
    const matchText = params.get('match')?.trim()
    const hasHash = Boolean(location.hash.replace(/^#/, ''))

    if (!matchText && !hasHash) {
      forceScrollTop()
    }
  }, [location.hash, location.search, slug])

  useEffect(() => {
    const contentRoot = contentRef.current
    if (!contentRoot) {
      return
    }

    clearSearchHighlights(contentRoot)

    const params = new URLSearchParams(location.search)
    const matchText = params.get('match')?.trim()
    const sectionId = params.get('section')?.trim() || location.hash.replace(/^#/, '')
    if (!matchText) {
      if (sectionId) {
        let firstFrame = 0
        let secondFrame = 0
        firstFrame = requestAnimationFrame(() => {
          secondFrame = requestAnimationFrame(() => {
            contentRoot.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
        })
        return () => {
          cancelAnimationFrame(firstFrame)
          cancelAnimationFrame(secondFrame)
        }
      }
      return
    }

    let firstFrame = 0
    let secondFrame = 0

    const runHighlight = () => {
      const sectionNodes = sectionId ? getSectionNodes(contentRoot, sectionId) : [contentRoot]
      const mark = highlightFirstMatch(sectionNodes, matchText)

      if (mark) {
        mark.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }

      if (sectionId) {
        contentRoot.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(runHighlight)
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
      clearSearchHighlights(contentRoot)
    }
  }, [DocContent, location.hash, location.search])

  return (
    <div className="max-w-7xl mx-auto flex min-h-[calc(100vh-8rem)]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg shadow-primary/25"
        aria-label="Toggle sidebar"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 shrink-0
          bg-surface-dark/95 backdrop-blur-xl lg:bg-transparent border-r border-gray-800/60 lg:border-r-0
          overflow-y-auto transition-transform lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-6 space-y-1">
          <DocSearch />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Documentation
          </h2>
          {docs.map((entry) => (
            <Link
              key={entry.slug}
              to={`/docs/${entry.slug}/`}
              onClick={handleSidebarNavigation}
              className={`
                block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  slug === entry.slug
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-text-muted hover:text-white hover:bg-surface-light/50'
                }
              `}
            >
              {entry.meta.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <article className="flex-1 min-w-0 px-6 py-10 lg:px-12">
        {DocContent ? (
          <>
            {activeDoc.meta.description && (
              <p className="text-text-muted text-lg mb-8 border-l-4 border-primary pl-4 bg-primary/5 py-3 pr-4 rounded-r-lg">
                {activeDoc.meta.description}
              </p>
            )}
            <div ref={contentRef} className="prose prose-invert prose-headings:text-white prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary-light prose-pre:bg-[#1e293b] prose-pre:border prose-pre:border-gray-700/50 prose-pre:rounded-xl prose-blockquote:border-primary prose-th:text-left prose-img:rounded-xl max-w-none">
              <DocsProvider>
                <DocContent />
              </DocsProvider>
            </div>
          </>
        ) : slug ? (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">Document not found.</p>
            <Link to="/docs/" className="text-primary hover:underline mt-4 inline-block">
              ← Back to docs
            </Link>
          </div>
        ) : null}
      </article>
    </div>
  )
}
