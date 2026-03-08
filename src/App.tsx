import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Docs from './pages/Docs'
import Conversions from './pages/Conversions'
import NotFound from './pages/NotFound'

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
        <Route path="/" element={<Home />} />
        <Route path="/docs/" element={<Docs />} />
        <Route path="/docs/:slug/" element={<Docs />} />
        <Route path="/conversions/" element={<Conversions />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
