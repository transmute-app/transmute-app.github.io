import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 dark:bg-surface-dark/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          {/* Dark mode: white icon, Light mode: black icon */}
          <img
            src={`${import.meta.env.BASE_URL}icons/beaker-black.svg`}
            alt="Transmute logo"
            className="h-8 w-8 dark:hidden"
          />
          <img
            src={`${import.meta.env.BASE_URL}icons/beaker-white.svg`}
            alt="Transmute logo"
            className="h-8 w-8 hidden dark:block"
          />
          <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            Transmute
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <a
            href="https://github.com/transmute-app/transmute"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
