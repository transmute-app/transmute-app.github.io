import React, { useState, useCallback, useRef, type ReactNode, type ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { slugifyHeading } from '../lib/docsText'

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

function Pre({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const text = extractText(children)
  return (
    <pre className="relative group" {...props}>
      <CopyButton text={text.trimEnd()} />
      {children}
    </pre>
  )
}

function createHeading(level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function Heading({ children, className, id, ...props }: ComponentPropsWithoutRef<'h1'>) {
    const Tag = level
    const headingId = id ?? slugifyHeading(extractText(children))
    const classes = [className, 'group scroll-mt-24'].filter(Boolean).join(' ') || undefined

    return (
      <Tag id={headingId || undefined} data-doc-heading={level} className={classes} {...props}>
        {children}
        {headingId && (
          <a
            href={`#${headingId}`}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-primary-light"
            aria-label={`Link to ${extractText(children)}`}
            onClick={(e) => {
              e.preventDefault()
              const url = new URL(window.location.href)
              url.hash = headingId
              url.search = ''
              navigator.clipboard.writeText(url.toString())
              window.history.replaceState(null, '', `#${headingId}`)
              document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <svg className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </a>
        )}
      </Tag>
    )
  }
}

function Anchor({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href && /^\//.test(href)) {
    return <Link to={href}>{children}</Link>
  }
  return <a href={href} target="_blank" rel="noopener" {...props}>{children}</a>
}

function InlineCode({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) {
  const isInline = !className
  if (isInline) {
    return (
      <code className="bg-surface-light text-primary-light px-1.5 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    )
  }
  return <code className={className} {...props}>{children}</code>
}

const mdxComponents = {
  pre: Pre,
  a: Anchor,
  code: InlineCode,
  h1: createHeading('h1'),
  h2: createHeading('h2'),
  h3: createHeading('h3'),
  h4: createHeading('h4'),
  h5: createHeading('h5'),
  h6: createHeading('h6'),
}

export function DocsProvider({ children }: { children: ReactNode }) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>
}
