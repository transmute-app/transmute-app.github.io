import { Link, useLocation } from 'react-router-dom'
import { FaGithub, FaBook } from 'react-icons/fa6'

export default function Header() {
  const { pathname } = useLocation()

  const navItems = [
    { to: '/docs', label: 'Docs', icon: FaBook },
  ]

  return (
    <header className="sticky top-0 z-50 bg-surface-dark/80 backdrop-blur-xl border-b border-gray-800/60">
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

        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-primary bg-primary/10'
                    : 'text-text-muted hover:text-white hover:bg-surface-light/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            )
          })}

          <div className="w-px h-5 bg-gray-700/60 mx-2" />

          <a
            href="https://github.com/transmute-app/transmute"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-surface-light/50 transition-colors"
          >
            <FaGithub className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
