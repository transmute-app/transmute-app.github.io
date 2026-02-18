export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted dark:text-text-muted-dark">
        <p>&copy; {new Date().getFullYear()} Transmute. All rights reserved.</p>
        <a
          href="https://github.com/chase-roohms/transmute"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-text dark:hover:text-text-dark transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  )
}
