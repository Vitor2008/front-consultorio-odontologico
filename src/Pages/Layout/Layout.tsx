import type { ReactNode } from 'react'
import './Layout.css'
import NavBar from '../../Components/NavBar/NavBar'
import Button from '../../Components/Button/Button'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

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
          <Button 
              onClick={handleLogout}
              text='Sair' 
              icon={faRightFromBracket} 
              color='bg-color-secondary'>
          </Button>
        </header>
        <main className="layout-main">
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout
