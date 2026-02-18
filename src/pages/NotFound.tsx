import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-xl text-text-muted dark:text-text-muted-dark mb-8">
        Page not found. The route you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
