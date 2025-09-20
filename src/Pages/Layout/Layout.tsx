import type { ReactNode } from 'react'
import NavBar from '../../Components/NavBar/NavBar'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <div style={{ marginLeft: '220px', padding: '20px' }}>
        {children}
      </div>
    </>
  )
}

export default Layout
