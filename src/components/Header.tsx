import { Link } from 'react-router-dom'
import { FaGithub, FaBook } from 'react-icons/fa6'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface-dark shadow-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}icons/beaker-red.svg`}
            alt="Transmute logo"
            className="h-8 w-8"
          />
          <span className="text-2xl font-bold text-primary">
            Transmute
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/docs"
            className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors text-sm font-medium"
          >
            <FaBook className="h-4 w-4" />
          </Link>
          <a
            href="https://github.com/transmute-app/transmute"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-white transition-colors"
          >
            <FaGithub className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  )
}
