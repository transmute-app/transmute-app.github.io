export default function Footer() {
  return (
    <footer className="border-t border-surface-light py-8 bg-surface-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p>&copy; {new Date().getFullYear()} Transmute. All rights reserved.</p>
        <a
          href="https://github.com/transmute-app/transmute"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  )
}
