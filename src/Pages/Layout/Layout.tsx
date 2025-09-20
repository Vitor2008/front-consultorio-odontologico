import type { ReactNode } from 'react'
import './Layout.css'
import NavBar from '../../Components/NavBar/NavBar'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  //const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    window.location.href = '/' // ou use navigate('/') se estiver dentro de <Router>
  }

  return (
    <>
      <NavBar />
      <div className="layout-content">
        <header className="layout-header">
          <span>{'teste@gmail.com'}</span>
          <button onClick={handleLogout}>Sair</button>
        </header>
        <main className="layout-main">
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout
