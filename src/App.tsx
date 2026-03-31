import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'

const Docs = lazy(() => import('./pages/Docs'))
const Conversions = lazy(() => import('./pages/Conversions'))
const FormatDetail = lazy(() => import('./pages/FormatDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollToTop() {
  const { key } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [key])
  return null
}

/** Redirects paths without a trailing slash to the same path with one. */
function TrailingSlash() {
  const { pathname, search, hash } = useLocation()
  if (pathname !== '/' && !pathname.endsWith('/')) {
    return <Navigate to={`${pathname}/${search}${hash}`} replace />
  }
  return null
}

function PageSkeleton() {
  return (
    <div className="min-h-[80vh] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-surface-light/40 rounded-lg w-1/3" />
        <div className="h-4 bg-surface-light/30 rounded w-2/3" />
        <div className="h-4 bg-surface-light/30 rounded w-1/2" />
        <div className="h-64 bg-surface-light/20 rounded-2xl mt-8" />
      </div>
    </div>
  )
}

function App() {
  return (
    <>
    <ScrollToTop />
    <TrailingSlash />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/docs/" element={<Suspense fallback={<PageSkeleton />}><Docs /></Suspense>} />
        <Route path="/docs/:slug/" element={<Suspense fallback={<PageSkeleton />}><Docs /></Suspense>} />
        <Route path="/conversions/" element={<Suspense fallback={<PageSkeleton />}><Conversions /></Suspense>} />
        <Route path="/conversions/:format/" element={<Suspense fallback={<PageSkeleton />}><FormatDetail /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageSkeleton />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
    </>
  )
}

export default App
