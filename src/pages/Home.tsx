import { useEffect, useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import {
  FaRegImage,
  FaFilm,
  FaMusic,
  FaHeadphones,
  FaTable,
  FaPenRuler,
  FaLock,
  FaBolt,
  FaInfinity,
  FaFile,
  FaDocker,
  FaGithub,
  FaPalette,
  FaArrowRight,
  FaCheck,
  FaXmark,
} from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import { useSEO } from '../hooks/useSEO'

SyntaxHighlighter.registerLanguage('yaml', yaml)

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const conversions: { category: string; formats: string[]; icon: IconType; coming?: boolean }[] = [
  { category: 'Image', formats: ['PNG → JPG', 'JPG → WebP', 'SVG → PNG', 'BMP → PNG'], icon: FaRegImage },
  { category: 'Video', formats: ['MKV → MP4', 'MOV → MKV', 'AVI → MP4', 'WebM → MP4'], icon: FaFilm },
  { category: 'Extract Audio', formats: ['MKV → MP3', 'MP4 → AAC', 'MOV → WAV'], icon: FaMusic },
  { category: 'Audio', formats: ['MP3 → WAV', 'FLAC → AAC', 'OGG → MP3'], icon: FaHeadphones },
  { category: 'Data', formats: ['CSV → JSON', 'JSON → YAML', 'YAML → CSV'], icon: FaTable },
  { category: 'Diagrams', formats: ['draw.io → PNG', 'draw.io → SVG', 'draw.io → PDF'], icon: FaPenRuler },
  { category: 'Documents', formats: ['PDF → HTML', 'DOCX → TXT', 'MD → PDF'], icon: FaFile },
  { category: 'CAD (Coming Soon)', formats: ['DWG → DXF', 'STL → OBJ', 'STEP → IGES'], icon: FaFile, coming: true },
]

const competitors = [
  { name: 'cloudconvert.com', sizeLimit: true, paidApi: true, thirdParty: true },
  { name: 'freeconvert.com', sizeLimit: true, paidApi: true, thirdParty: true },
  { name: 'convertio.co', sizeLimit: true, paidApi: true, thirdParty: true },
  { name: 'vert.sh', sizeLimit: false, paidApi: true, thirdParty: false },
  { name: 'Transmute', sizeLimit: false, paidApi: false, thirdParty: false },
]

const themes = [
  { name: 'Rubedo', type: 'Dark', default: true },
  { name: 'Albedo', type: 'Light' },
  { name: 'Citrinitas', type: 'Dark' },
  { name: 'Aurora', type: 'Dark' },
  { name: 'Viriditas', type: 'Dark' },
  { name: 'Caelum', type: 'Light' },
  { name: 'Nigredo', type: 'Dark' },
]

const screenshots = [
  {
    label: 'Converter',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/converter.png',
  },
  {
    label: 'File Lists',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/files.png',
  },
  {
    label: 'Settings',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/settings.png',
  },
]

export default function Home() {
  const [dockerCompose, setDockerCompose] = useState<string | null>(null)
  const [dockerComposeLoading, setDockerComposeLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeScreenshot, setActiveScreenshot] = useState(0)

  useSEO({
    title: 'Self-Hosted File Converter for Images, Video, Audio & More',
    description: 'Transmute is a free, open-source, self-hosted file converter. Convert images, video, audio, data, and documents on your own hardware with no file size limits, no watermarks, and full privacy.',
    path: '/',
  })

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
      {/* ────────────── Hero ────────────── */}
      <section className="relative overflow-hidden bg-surface-dark bg-grid">
        {/* Spotlight */}
        <div className="absolute inset-0 bg-spotlight pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-28 sm:pt-20 sm:pb-36 text-center">
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative">
              <img
                src={`${import.meta.env.BASE_URL}icons/beaker-red-bg.png`}
                alt="Transmute — self-hosted file converter logo"
                className="h-24 w-24 sm:h-28 sm:w-28 drop-shadow-2xl"
              />
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse-slow" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4 animate-fade-in-up">
            The <span className="gradient-text">Self-Hosted</span>{' '}
            File Converter
          </h1>

          <p className="text-sm sm:text-base uppercase tracking-[0.25em] text-text-muted/60 font-medium mb-10 animate-fade-in-up">
            Convert anything, anywhere.
          </p>

          <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Transmute is an open-source, self-hosted file converter that handles images,
            video, audio, data, documents, and more — all on your own hardware.
            <span className="block mt-2 text-text-muted/80">No uploads to third-party servers. No file size limits. No watermarks.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="https://github.com/transmute-app/transmute#quickstart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Get Started
              <FaArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/transmute-app/transmute"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-gray-700 text-text-muted font-semibold hover:text-white hover:border-gray-500 transition-all hover:-translate-y-0.5"
            >
              <FaGithub className="h-5 w-5" />
              View on GitHub
            </a>
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12 animate-fade-in" style={{ animationDelay: '0.45s' }}>
            {['Docker Ready', 'FastAPI', 'FFmpeg', 'Pillow', 'pandas', 'PyMuPDF', 'Pandoc'].map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium bg-surface-light/60 text-text-muted border border-gray-700/50">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom divider */}
        <div className="divider-gradient h-px" />
      </section>

      {/* ────────────── Screenshots ────────────── */}
      <section className="py-20 sm:py-28 bg-surface-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">See the Self-Hosted File Converter in Action</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              A clean, modern interface designed for efficiency. Upload, convert, download, that's it.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center gap-2 mb-8">
            {screenshots.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setActiveScreenshot(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  i === activeScreenshot
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-text-muted hover:text-white border border-transparent hover:border-gray-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Screenshot display */}
          <div className="relative rounded-2xl border border-gray-700/50 overflow-hidden glow-red-sm bg-surface-light">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50 bg-surface-dark/60">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-text-muted font-mono">localhost:3313</span>
            </div>
            <img
              src={screenshots[activeScreenshot].url}
              alt={screenshots[activeScreenshot].label}
              className="w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <div className="divider-gradient h-px" />

      {/* ────────────── Supported Conversions ────────────── */}
      <section className="py-20 sm:py-28 bg-surface-dark bg-grid relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/50 to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4 tracking-wide uppercase">
              Format Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Supported Conversions
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Powered by FFmpeg, Pillow, pandas, draw.io, PyMuPDF, and Pandoc, with more converters added regularly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {conversions.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.category}
                  className={`card-hover rounded-2xl p-6 border bg-surface-light/40 backdrop-blur-sm text-center flex flex-col items-center ${
                    item.coming ? 'border-gray-700/50 opacity-60' : 'border-gray-700/50'
                  }`}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{item.category}</h3>
                  <ul className="space-y-1.5">
                    {item.formats.map((line) => (
                      <li key={line} className="text-sm text-text-muted font-mono whitespace-nowrap">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <p className="text-center text-sm text-text-muted mt-8">
            …and many more combinations.
          </p>
        </div>
      </section>

      <div className="divider-gradient h-px" />

      {/* ────────────── Why Transmute ────────────── */}
      <section className="py-20 sm:py-28 bg-surface-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4 tracking-wide uppercase">
              Why Self-Host?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Why Use a Self-Hosted File Converter?
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Stop uploading sensitive files to random websites. Take full control of your file conversions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaLock,
                title: '100% Private',
                desc: 'Your files never leave your machine. Full privacy with zero third-party uploads. Perfect for sensitive documents and proprietary data.',
              },
              {
                icon: FaBolt,
                title: 'Fast & Simple',
                desc: 'Clean REST API powered by FastAPI. Beautiful web UI for drag-and-drop conversions. Upload a file, pick your format, get your result.',
              },
              {
                icon: FaInfinity,
                title: 'No Limits',
                desc: 'No file size caps, no watermarks, no rate limits, no paid tiers. Convert as much as you need, as often as you need.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="card-hover rounded-2xl p-8 border border-gray-700/50 bg-surface-light/30 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="divider-gradient h-px" />

      {/* ────────────── Comparison Table ────────────── */}
      <section className="py-20 sm:py-28 bg-surface-dark bg-grid relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/50 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4 tracking-wide uppercase">
              Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              What Does Transmute Replace?
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              These are great services — but a self-hosted file converter means you never have to upload private files to convert them.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-700/50 bg-surface-light/30 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left px-6 py-4 font-semibold text-text-muted">Service</th>
                  <th className="px-6 py-4 font-semibold text-text-muted text-center">No Size Limits</th>
                  <th className="px-6 py-4 font-semibold text-text-muted text-center">Free API</th>
                  <th className="px-6 py-4 font-semibold text-text-muted text-center">Private</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => {
                  const isTransmute = c.name === 'Transmute'
                  return (
                    <tr
                      key={c.name}
                      className={`border-b border-gray-700/30 last:border-b-0 ${
                        isTransmute ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className={`px-6 py-4 font-medium ${isTransmute ? 'text-primary font-bold' : 'text-text'}`}>
                        {c.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {!c.sizeLimit
                          ? <FaCheck className="inline h-4 w-4 text-green-400" />
                          : <FaXmark className="inline h-4 w-4 text-red-400/60" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {!c.paidApi
                          ? <FaCheck className="inline h-4 w-4 text-green-400" />
                          : <FaXmark className="inline h-4 w-4 text-red-400/60" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {!c.thirdParty
                          ? <FaCheck className="inline h-4 w-4 text-green-400" />
                          : <FaXmark className="inline h-4 w-4 text-red-400/60" />}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="divider-gradient h-px" />

      {/* ────────────── Themes ────────────── */}
      <section className="py-20 sm:py-28 bg-surface-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4 tracking-wide uppercase">
              Personalization
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Built-in Themes
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Choose from seven carefully crafted themes. Switch between dark and light modes to match your setup.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {themes.map((t) => (
              <div
                key={t.name}
                className="card-hover rounded-xl overflow-hidden border border-gray-700/50 bg-surface-light/30"
              >
                <img
                  src={`https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/${t.name.toLowerCase()}.png`}
                  alt={`${t.name} theme`}
                  className="w-full aspect-video object-cover object-top"
                  loading="lazy"
                />
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium">{t.name}</span>
                  <span className="text-xs text-text-muted">{t.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gradient h-px" />

      {/* ────────────── Quickstart ────────────── */}
      <section className="py-20 sm:py-28 bg-surface-dark bg-grid relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/50 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
              <FaDocker className="h-7 w-7" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Quickstart
            </h2>
            <p className="text-text-muted max-w-md mx-auto">
              Deploy in seconds with Docker Compose. One command, fully running.
            </p>
          </div>

          {/* One-liner */}
          <div className="mb-6 rounded-xl border border-gray-700/50 bg-surface-light/40 px-5 py-4 font-mono text-sm overflow-x-auto">
            <span className="text-text-muted select-none">$ </span>
            <span className="text-primary-light">wget</span>{' '}
            <span className="text-text-muted">"https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/docker-compose.yml"</span>{' '}
            <span className="text-text-muted">&&</span>{' '}
            <span className="text-primary-light">docker compose up -d</span>
          </div>

          {/* Full compose file */}
          <div className="relative rounded-2xl border border-gray-700/50 bg-surface-light/30 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50 bg-surface-dark/40">
              <span className="text-xs text-text-muted font-mono">docker-compose.yml</span>
              {!dockerComposeLoading && dockerCompose !== null && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-text-muted hover:text-white transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="px-5 py-4 overflow-x-auto max-h-80">
              {dockerComposeLoading ? (
                <div className="flex items-center gap-2 text-sm text-text-muted font-mono py-4">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading…
                </div>
              ) : dockerCompose !== null ? (
                <SyntaxHighlighter
                  language="yaml"
                  style={atomOneDark}
                  customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: '0.8rem' }}
                >
                  {dockerCompose}
                </SyntaxHighlighter>
              ) : (
                <span className="text-sm text-red-400 font-mono">Failed to load docker-compose.yml</span>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-text-muted mt-6">
            Then open{' '}
            <code className="text-primary-light bg-surface-light px-1.5 py-0.5 rounded text-xs">
              http://localhost:3313
            </code>{' '}
            in your browser.
          </p>
        </div>
      </section>

      <div className="divider-gradient h-px" />

      {/* ────────────── API Docs ────────────── */}
      <section className="py-20 sm:py-24 bg-surface-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Full API Access
          </h2>
          <p className="text-text-muted max-w-lg mx-auto mb-8 leading-relaxed">
            Every conversion available through the UI is also available via a REST API.
            Interactive Swagger docs are served at{' '}
            <code className="text-primary-light bg-surface-light px-1.5 py-0.5 rounded text-xs">/api/docs</code>{' '}
            when the app is running.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/transmute-app/openapi-specifications"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-text-muted font-semibold hover:text-white hover:border-gray-500 transition-all hover:-translate-y-0.5"
            >
              OpenAPI Specs
              <FaArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <div className="divider-gradient h-px" />

      {/* ────────────── CTA / Contribute ────────────── */}
      <section className="py-20 sm:py-28 bg-surface-dark bg-grid relative">
        <div className="absolute inset-0 bg-spotlight pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent mb-5 tracking-wide uppercase">
            Under Active Development
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Open Source & Community Driven
          </h2>
          <p className="text-text-muted max-w-lg mx-auto mb-10 leading-relaxed">
            Transmute is an MIT-licensed, open-source self-hosted file converter built in the open. Star the repo to stay updated, open an issue
            to request features, or jump in and contribute code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/transmute-app/transmute"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <FaGithub className="h-5 w-5" />
              Star on GitHub
            </a>
            <a
              href="https://github.com/transmute-app/transmute/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-gray-700 text-text-muted font-semibold hover:text-white hover:border-gray-500 transition-all hover:-translate-y-0.5"
            >
              <FaPalette className="h-4 w-4" />
              Request a Feature
            </a>
          </div>

          {/* Contributors shoutout */}
          <p className="text-xs text-text-muted mt-10">
            Built with ❤ by{' '}
            <a href="https://github.com/chase-roohms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              chase-roohms
            </a>{' '}
            and{' '}
            <a href="https://github.com/transmute-app/transmute/graphs/contributors" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              contributors
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
