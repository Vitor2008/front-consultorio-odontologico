import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './Pages/Layout/Layout'
import Home from './Pages/Home/Home'

const Login = lazy(() => import('./Pages/Login/Login'))

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default App
