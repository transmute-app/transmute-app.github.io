import { FaRegImage, FaFilm, FaMusic, FaHeadphones, FaLock, FaBolt, FaInfinity } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

const conversions: { category: string; formats: string[][]; icon: IconType }[] = [
  {
    category: 'Image to Image',
    formats: [['PNG → JPG'], ['JPG → WebP'], ['BMP → PNG']],
    icon: FaRegImage,
  },
  {
    category: 'Video to Video',
    formats: [['MKV → MP4'], ['MOV → MKV'], ['AVI → MP4']],
    icon: FaFilm,
  },
  {
    category: 'Video to Audio',
    formats: [['MKV → MP3'], ['MOV → WAV'], ['MP4 → AAC']],
    icon: FaMusic,
  },
  {
    category: 'Audio to Audio',
    formats: [['MP3 → WAV'], ['FLAC → AAC'], ['OGG → MP3']],
    icon: FaHeadphones,
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <img
              src={`${import.meta.env.BASE_URL}icons/beaker-black.svg`}
              alt="Transmute logo"
              className="h-20 w-20 dark:hidden"
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Convert <span className="text-primary">anything</span>,{' '}
            <span className="text-primary-light">anywhere</span>.
          </h1>
          <p className="text-lg sm:text-xl text-text-muted dark:text-text-muted-dark max-w-3xl mx-auto mb-10">
            Transmute is a self-hosted file converter that handles images, video, and audio — all on your own hardware. No uploads to third-party servers. No limits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/chase-roohms/transmute"
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

      {/* Features */}
      <section className="py-16 bg-surface-dim dark:bg-surface-dim-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Supported Conversions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {conversions.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.category}
                  className="bg-surface dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow text-center flex flex-col items-center"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{item.category}</h3>
                  <ul className="space-y-1.5">
                    {item.formats.map((line) => (
                      <li
                        key={line[0]}
                        className="text-sm text-text-muted dark:text-text-muted-dark font-mono whitespace-nowrap"
                      >
                        {line[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16">
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
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                Your files never leave your machine. Full privacy, zero third-party uploads.
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <FaBolt className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast & Simple</h3>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                Clean API powered by FastAPI. Upload a file, pick your format, get your result.
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <FaInfinity className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No Limits</h3>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                No file size caps, no watermarks, no rate limits. Convert as much as you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Status / CTA */}
      <section className="py-16 bg-surface-dim dark:bg-surface-dim-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent mb-4">
            Under Active Development
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Transmute is a work in progress
          </h2>
          <p className="text-text-muted dark:text-text-muted-dark mb-8">
            This project is under heavy development. Star the repo on GitHub to stay updated, or
            jump in and contribute!
          </p>
          <a
            href="https://github.com/chase-roohms/transmute"
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
