import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa6'
import { useSEO } from '../hooks/useSEO'

export default function NotFound() {
  useSEO({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
  })

  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-grid relative min-h-[60vh]">
      <div className="absolute inset-0 bg-spotlight pointer-events-none" />
      <div className="relative">
        <h1 className="text-8xl sm:text-9xl font-extrabold mb-2 gradient-text">404</h1>
        <p className="text-xl text-text-muted mb-8">
          Page not found. The route you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
        >
          <FaArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
