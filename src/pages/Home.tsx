import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaLock,
  FaBolt,
  FaInfinity,
  FaDocker,
  FaGithub,
  FaPalette,
  FaArrowRight,
  FaRightLeft,
  FaCheck,
  FaXmark,
} from 'react-icons/fa6'
import { useSEO } from '../hooks/useSEO'
import { HOME_METADATA } from '../seo.ts'

const LazyYamlHighlighter = lazy(() =>
  Promise.all([
    import('react-syntax-highlighter/dist/esm/light'),
    import('react-syntax-highlighter/dist/esm/languages/hljs/yaml'),
    import('react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark'),
  ]).then(([{ default: SyntaxHighlighter }, { default: yaml }, { default: atomOneDark }]) => {
    SyntaxHighlighter.registerLanguage('yaml', yaml)
    return {
      default: ({ children }: { children: string }) => (
        <SyntaxHighlighter
          language="yaml"
          style={atomOneDark}
          customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: '0.8rem' }}
        >
          {children}
        </SyntaxHighlighter>
      ),
    }
  }),
)

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const competitors = [
  { name: 'cloudconvert.com', noSizeLimit: false, freeApi: false, private: false, sso: true },
  { name: 'freeconvert.com', noSizeLimit: false, freeApi: false, private: false, sso: true },
  { name: 'convertio.co', noSizeLimit: false, freeApi: false, private: false, sso: true },
  { name: 'vert.sh', noSizeLimit: true, freeApi: false, private: true, sso: false },
  { name: 'convertx.org', noSizeLimit: true, freeApi: false, private: true, sso: false },
  { name: 'Transmute', noSizeLimit: true, freeApi: true, private: true, sso: true },
]

const themes = [
  { name: 'Rubedo', type: 'Dark', default: true },
  { name: 'Albedo', type: 'Light' },
  { name: 'Citrinitas', type: 'Dark' },
  { name: 'Aurora', type: 'Dark' },
  { name: 'Viriditas', type: 'Dark' },
  { name: 'Caelum', type: 'Light' },
  { name: 'Nigredo', type: 'Dark' },
  { name: 'Argentum', type: 'Light' },
]

const screenshots = [
  {
    label: 'Login',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/login.png',
  },
  {
    label: 'Converter',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/converter.png',
  },
  {
    label: 'Post-Conversion',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/post-conversion.png',
  },
  {
    label: 'Files',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/files.png',
  },
  {
    label: 'Jobs',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/jobs.png',
  },
  {
    label: 'Settings',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/settings.png',
  },
  {
    label: 'Account',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/account.png',
  },
  {
    label: 'User Management',
    url: 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/user-management.png',
  },
]

function PikaPodsLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 383.39 169.27"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M383.39,161c-2.83,6.42-7.81,8.33-14.68,8.32q-155.86-.21-311.74-.1c-27.27,0-49.44-17.67-55.6-44.24C-5.79,94.08,15.88,62.26,47.24,57.65a74.42,74.42,0,0,1,8.17-.71c6.93-.25,12-4.95,12.08-11.22S62.28,34.47,55.13,34.45c-14.22-.05-28.44,0-42.66,0C5.12,34.42.19,30,.15,23.31S5,12,12.28,12C27,12,41.72,12,56.44,12c18.28.08,33.32,14.85,33.5,32.81.19,19-14.17,34.06-32.93,34.51-18.36.45-31.76,12.1-34.12,30.26a33,33,0,0,0,30.59,36.8c12.12,1,24.39.18,36.78.18,4.92-46.53,26.36-83.33,65-109.73,22.36-15.3,47.34-23.26,74.23-24.66-1.2,5.44-2.7,10.59-3.41,15.84-4,30.06,18.3,58.48,48.51,61.94a38.2,38.2,0,0,0,8.18.46A11.31,11.31,0,0,0,292.79,78.9c-.33-6.06-5.17-10.52-11.73-10.78-13.69-.54-23.72-7-29.84-19.13C245,36.65,247.44,21.68,257,11.07a33.11,33.11,0,0,1,35.48-9.23A35.2,35.2,0,0,1,315.33,32.4a6.1,6.1,0,0,0,2.4,4c33.18,22.94,54.39,53.9,62.8,93.44,1.19,5.58,1.92,11.25,2.86,16.88ZM326.48,101.8A11.22,11.22,0,1,0,315.29,113,11.54,11.54,0,0,0,326.48,101.8Z" />
    </svg>
  )
}

export default function Home() {
  const [dockerCompose, setDockerCompose] = useState<string | null>(null)
  const [dockerComposeLoading, setDockerComposeLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeScreenshot, setActiveScreenshot] = useState(0)

  useSEO({
    title: HOME_METADATA.title,
    description: HOME_METADATA.description,
    path: HOME_METADATA.path,
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
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={`${import.meta.env.BASE_URL}icons/beaker-red-bg.png`}
                alt="Transmute: self-hosted file converter logo"
                className="h-24 w-24 sm:h-28 sm:w-28 drop-shadow-2xl"
                width={112}
                height={112}
              />
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse-slow" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4">
            The <span className="gradient-text">Self-Hosted</span>{' '}
            File Converter
          </h1>

          <p className="text-sm sm:text-base uppercase tracking-[0.25em] text-text-muted/60 font-medium mb-10">
            Convert anything, anywhere.
          </p>

          <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto mb-10 leading-relaxed">
            Transmute is an open-source, self-hosted file converter that handles images,
            video, audio, data, documents, and more; all on your own hardware.
            <span className="block mt-2 text-text-muted/80">No uploads to third-party servers. No file size limits. No watermarks.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/docs/getting-started/"
              className="inline-flex min-w-[18rem] items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <FaDocker className="h-5 w-5 shrink-0" />
              <span className="flex flex-col items-start text-left leading-tight">
                <span>Host on Your Hardware</span>
              </span>
            </Link>
            <a
              href="https://www.pikapods.com/pods?run=transmute"
              target="_blank"
              className="relative inline-flex min-w-[18rem] items-center justify-center gap-3 px-8 py-3.5 rounded-xl border border-[#43A047] bg-[#43A047] text-white font-semibold hover:bg-[#388E3C] hover:border-[#388E3C] transition-all shadow-lg shadow-[#43A047]/25 hover:shadow-[#43A047]/40 hover:-translate-y-0.5"
            >
              <span className="absolute -top-2.5 right-3 rounded-full border border-white/20 bg-surface-dark px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
                Coming Soon
              </span>
              <PikaPodsLogo className="h-3.5 w-auto shrink-0" />
              <span className="flex flex-col items-start text-left leading-tight">
                <span>Host on PikaPods</span>
              </span>
            </a>
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
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex w-max min-w-full justify-start gap-2 sm:justify-center">
              {screenshots.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setActiveScreenshot(i)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    i === activeScreenshot
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-text-muted hover:text-white border border-transparent hover:border-gray-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Screenshot display */}
          <div className="relative rounded-2xl border border-gray-700/50 overflow-hidden glow-red-sm bg-surface-light">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50 bg-surface-dark/60">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-text-muted font-mono">localhost:3313</span>
            </div>
            <div className="aspect-[16/9]">
              <img
                src={screenshots[activeScreenshot].url}
                alt={screenshots[activeScreenshot].label}
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gradient h-px" />

      {/* ────────────── Supported Conversions ────────────── */}
      <section className="py-20 sm:py-28 bg-surface-dark bg-grid relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/50 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4 tracking-wide uppercase">
            Format Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Supported Conversions
          </h2>
          <p className="text-text-muted max-w-xl mx-auto mb-6">
            Powered by FFmpeg, Pillow, Pandoc, and more, Transmute converts images, video, documents, fonts, and many other formats.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              'Image', 'Video', 'Audio', 'Document', 'Data', 'Diagrams', 'Fonts', 'Subtitles'
            ].map((cat) => (
              <span
                key={cat}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-light/50 border border-gray-700/50 text-text-muted"
              >
                {cat}
              </span>
            ))}
          </div>

          <Link
            to="/conversions/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            <FaRightLeft className="h-4 w-4" />
            Browse All Conversions
          </Link>
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

      {/* ────────────── OIDC / SSO ────────────── */}
      <section className="py-20 sm:py-24 bg-surface-dark bg-grid relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/50 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4 tracking-wide uppercase">
              Access Control
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              OIDC / SSO Integration
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Let users sign in to Transmute with Authentik, Authelia, or any OpenID Connect provider instead of managing separate local credentials.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/docs/oidc/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Read the OIDC Docs
              <FaArrowRight className="h-4 w-4" />
            </Link>
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
              These are great services, but Transmute gives you a feature rich, self-hosted option with full control over your files, workflows, and deployment.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-700/50 bg-surface-light/30 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left px-6 py-4 font-semibold text-text-muted">Service</th>
                  <th className="px-6 py-4 font-semibold text-text-muted text-center">No Size Limits</th>
                  <th className="px-6 py-4 font-semibold text-text-muted text-center">Private</th>
                  <th className="px-6 py-4 font-semibold text-text-muted text-center">Free API</th>
                  <th className="px-6 py-4 font-semibold text-text-muted text-center">SSO</th>
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
                        {c.noSizeLimit
                          ? <FaCheck className="inline h-4 w-4 text-green-400" />
                          : <FaXmark className="inline h-4 w-4 text-red-400/60" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {c.private
                          ? <FaCheck className="inline h-4 w-4 text-green-400" />
                          : <FaXmark className="inline h-4 w-4 text-red-400/60" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {c.freeApi
                          ? <FaCheck className="inline h-4 w-4 text-green-400" />
                          : <FaXmark className="inline h-4 w-4 text-red-400/60" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {c.sso
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
                  width={1920}
                  height={1080}
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
                <Suspense fallback={<pre className="text-xs text-text-muted font-mono whitespace-pre-wrap">{dockerCompose}</pre>}>
                  <LazyYamlHighlighter>{dockerCompose}</LazyYamlHighlighter>
                </Suspense>
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
            ReDocly formatted docs are served at{' '}
            <code className="text-primary-light bg-surface-light px-1.5 py-0.5 rounded text-xs">/api/docs</code>{' '}
            when the app is running.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/transmute-app/openapi-specifications/blob/main/openapi.json"
              target="_blank"
              rel="noopener"
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
              rel="noopener"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <FaGithub className="h-5 w-5" />
              Star on GitHub
            </a>
            <a
              href="https://github.com/transmute-app/transmute/issues"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-gray-700 text-text-muted font-semibold hover:text-white hover:border-gray-500 transition-all hover:-translate-y-0.5"
            >
              <FaPalette className="h-4 w-4" />
              Request a Feature
            </a>
          </div>

          {/* Contributors shoutout */}
          <p className="text-xs text-text-muted mt-10">
            Built by{' '}
            <a href="https://github.com/chase-roohms" target="_blank" rel="noopener" className="text-primary hover:underline">
              chase-roohms
            </a>{' '}
            and{' '}
            <a href="https://github.com/transmute-app/transmute/graphs/contributors" target="_blank" rel="noopener" className="text-primary hover:underline">
              contributors
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
