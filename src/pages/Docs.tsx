import React, { useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import fm from 'front-matter'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useSEO } from '../hooks/useSEO'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    })
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/60 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
      aria-label="Copy code"
    >
      {copied ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement<{ children?: ReactNode }>).props.children)
  }
  return ''
}

interface DocMeta {
  title: string
  description?: string
  order?: number
}

interface DocEntry {
  slug: string
  meta: DocMeta
}

export default function Docs() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [entries, setEntries] = useState<DocEntry[]>([])
  const [content, setContent] = useState<string>('')
  const [activeMeta, setActiveMeta] = useState<DocMeta | null>(null)
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null)
  const loading = slug !== loadedSlug
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useSEO({
    title: activeMeta?.title ? `${activeMeta.title} — Docs` : 'Documentation',
    description: activeMeta?.description ?? 'Transmute documentation — learn how to install, configure, and use the self-hosted file converter.',
    path: slug ? `/docs/${slug}` : '/docs',
  })

  // Load manifest + all frontmatter once
  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}docs/manifest.json`)
      .then((r) => r.json())
      .then(async (files: string[]) => {
        const parsed: DocEntry[] = await Promise.all(
          files.map(async (file) => {
            const res = await fetch(`${base}docs/${file}`)
            const text = await res.text()
            const { attributes } = fm<DocMeta>(text)
            return {
              slug: file.replace(/\.md$/, ''),
              meta: attributes,
            }
          }),
        )
        parsed.sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99))
        setEntries(parsed)

        // If no slug selected, redirect to first doc
        if (!slug && parsed.length > 0) {
          navigate(`/docs/${parsed[0].slug}`, { replace: true })
        }
      })
      .catch(() => setEntries([]))
  }, [navigate, slug])

  // Load selected doc content
  useEffect(() => {
    if (!slug) return
    const base = import.meta.env.BASE_URL
    fetch(`${base}docs/${slug}.md`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.text()
      })
      .then((text) => {
        const { attributes, body } = fm<DocMeta>(text)
        setActiveMeta(attributes)
        setContent(body)
        setLoadedSlug(slug)
      })
      .catch(() => {
        setContent('')
        setActiveMeta(null)
        setLoadedSlug(slug)
      })
  }, [slug])

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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Documentation
          </h2>
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              to={`/docs/${entry.slug}`}
              onClick={() => setSidebarOpen(false)}
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : content ? (
          <>
            {activeMeta?.description && (
              <p className="text-text-muted text-lg mb-8 border-l-4 border-primary pl-4 bg-primary/5 py-3 pr-4 rounded-r-lg">
                {activeMeta.description}
              </p>
            )}
            <div className="prose prose-invert prose-headings:text-white prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary-light prose-pre:bg-[#1e293b] prose-pre:border prose-pre:border-gray-700/50 prose-pre:rounded-xl prose-blockquote:border-primary prose-th:text-left prose-img:rounded-xl max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
                components={{
                  pre({ children }) {
                    const text = extractText(children)
                    return (
                      <pre className="relative group">
                        <CopyButton text={text.trimEnd()} />
                        {children}
                      </pre>
                    )
                  },
                  code({ className, children, ...props }) {
                    const isInline = !className
                    if (isInline) {
                      return (
                        <code className="bg-surface-light text-primary-light px-1.5 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      )
                    }
                    return <code className={className} {...props}>{children}</code>
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">Document not found.</p>
            <Link to="/docs" className="text-primary hover:underline mt-4 inline-block">
              ← Back to docs
            </Link>
          </div>
        )}
      </article>
    </div>
  )
}
