import { useEffect, useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { FaRegImage, FaFilm, FaMusic, FaHeadphones, FaTable, FaPenRuler, FaLock, FaBolt, FaInfinity } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

SyntaxHighlighter.registerLanguage('yaml', yaml)

const conversions: { category: string; formats: string[]; icon: IconType }[] = [
  {
    category: 'Image',
    formats: ['PNG → JPG', 'JPG → WebP', 'SVG → PNG'],
    icon: FaRegImage,
  },
  {
    category: 'Video',
    formats: ['MKV → MP4', 'MOV → MKV', 'AVI → MP4'],
    icon: FaFilm,
  },
  {
    category: 'Video → Audio',
    formats: ['MKV → MP3', 'MP4 → AAC', 'MOV → WAV'],
    icon: FaMusic,
  },
  {
    category: 'Audio',
    formats: ['MP3 → WAV', 'FLAC → AAC', 'OGG → MP3'],
    icon: FaHeadphones,
  },
  {
    category: 'Data',
    formats: ['CSV → JSON', 'JSON → YAML', 'YAML → CSV'],
    icon: FaTable,
  },
  {
    category: 'Diagrams',
    formats: ['draw.io → PNG', 'draw.io → SVG', 'draw.io → PDF'],
    icon: FaPenRuler,
  },
]

export default function Home() {
  const [dockerCompose, setDockerCompose] = useState<string | null>(null)
  const [dockerComposeLoading, setDockerComposeLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (dockerCompose) {
      navigator.clipboard.writeText(dockerCompose)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/docker-compose.yml')
      .then((res) => res.text())
      .then((text) => { setDockerCompose(text); setDockerComposeLoading(false) })
      .catch(() => { setDockerCompose(null); setDockerComposeLoading(false) })
  }, [])
  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-32 bg-surface-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <img
              src={`${import.meta.env.BASE_URL}icons/beaker-red-bg.png`}
              alt="Transmute logo"
              className="h-20 w-20"
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Convert <span className="text-primary">anything</span>,{' '}
            <span className="text-primary-light">anywhere</span>.
          </h1>
          <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto mb-10">
            Transmute is a self-hosted file converter that handles images, video, data, and more.
            <br />
            All on your own hardware.
            <br /><br />
            No uploads to third-party servers. No limits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/transmute-app/transmute#quickstart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
            >
              Get Started
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Supported Conversions */}
      <section className="py-16 bg-surface-light border-y border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Supported Conversions
          </h2>
          <p className="text-text-muted text-center mb-10">
            Powered by FFmpeg, Pillow, pandas, and draw.io
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversions.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.category}
                  className="bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-700 hover:border-primary/50 transition-colors text-center flex flex-col items-center"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{item.category}</h3>
                  <ul className="space-y-1.5">
                    {item.formats.map((line) => (
                      <li
                        key={line}
                        className="text-sm text-text-muted font-mono whitespace-nowrap"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Transmute */}
      <section className="py-16 bg-surface-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Transmute?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <FaLock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Self-Hosted</h3>
              <p className="text-sm text-text-muted">
                Your files never leave your machine. Full privacy, zero third-party uploads.
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <FaBolt className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast & Simple</h3>
              <p className="text-sm text-text-muted">
                Clean API powered by FastAPI. Upload a file, pick your format, get your result.
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <FaInfinity className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No Limits</h3>
              <p className="text-sm text-text-muted">
                No file size caps, no watermarks, no rate limits. Convert as much as you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quickstart */}
      <section className="py-16 bg-surface-light border-y border-gray-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Quickstart
          </h2>
          <p className="text-text-muted mb-6">
            Deploy in seconds with Docker Compose.
          </p>
          <div className="relative bg-surface-dark rounded-xl border border-gray-700 px-6 py-4 text-left mb-8 overflow-x-auto">
            {!dockerComposeLoading && dockerCompose !== null && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-text-muted hover:text-white transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
            {dockerComposeLoading ? (
              <span className="text-sm text-text-muted font-mono">Loading...</span>
            ) : dockerCompose !== null ? (
              <SyntaxHighlighter
                language="yaml"
                style={atomOneDark}
                customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: '0.875rem' }}
              >
                {dockerCompose}
              </SyntaxHighlighter>
            ) : (
              <span className="text-sm text-red-400 font-mono">Failed to load docker-compose.yml</span>
            )}
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent mb-4">
            Under Active Development
          </span>
          <p className="text-text-muted mb-6">
            Star the repo on GitHub to stay updated, or jump in and contribute!
          </p>
          <a
            href="https://github.com/transmute-app/transmute"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            Star on GitHub &rarr;
          </a>
        </div>
      </section>
    </>
  )
}
