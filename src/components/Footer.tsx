import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/60 bg-surface-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src={`${import.meta.env.BASE_URL}icons/beaker-red.svg`}
                alt="Transmute"
                className="h-6 w-6"
              />
              <span className="text-lg font-bold text-primary">Transmute</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Self-hosted file converter for images, video, audio, data, documents, and more.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/docs" className="text-text-muted hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/docs/getting-started" className="text-text-muted hover:text-white transition-colors">
                  Quickstart Guide
                </Link>
              </li>
              <li>
                <a href="https://github.com/transmute-app/transmute?tab=contributing-ov-file" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                  Contributing
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/transmute-app/transmute" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://github.com/transmute-app/transmute/issues" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                  Report an Issue
                </a>
              </li>
              <li>
                <a href="https://github.com/transmute-app/transmute/graphs/contributors" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                  Contributors
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider-gradient h-px mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} Transmute &middot; MIT License</p>
          <a
            href="https://github.com/transmute-app/transmute"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <FaGithub className="h-4 w-4" />
            transmute-app/transmute
          </a>
        </div>
      </div>
    </footer>
  )
}
