import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
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

function App() {
  return (
    <>
    <ScrollToTop />
    <TrailingSlash />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Suspense><Home /></Suspense>} />
        <Route path="/docs/" element={<Suspense><Docs /></Suspense>} />
        <Route path="/docs/:slug/" element={<Suspense><Docs /></Suspense>} />
        <Route path="/conversions/" element={<Suspense><Conversions /></Suspense>} />
        <Route path="/conversions/:format/" element={<Suspense><FormatDetail /></Suspense>} />
        <Route path="*" element={<Suspense><NotFound /></Suspense>} />
      </Route>
    </Routes>
    </>
  )
}

export default App
