import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './NavBar.css'
import logo from '../../assets/Img/logo.png'

const NavBar = () => {
    const location = useLocation();
    console.log('Location:', location.pathname);
    const [aberta, setAberta] = useState(false);
    return (
        <>
            <div className="navbar no-mobile">
                <div className='flex'>
                    <img src={logo} width={40} alt='logo' />
                    <h2 className="logo">Sistema SISo</h2>
                </div>
                <ul className="nav-links">
                    <li className={location.pathname === '/consultas' ? 'active' : ''}><a href="/consultas">Consultas</a></li>
                    <li className={location.pathname === '/pacientes' ? 'active' : ''}><a href="/pacientes">Pacientes</a></li>
                    <li className={location.pathname === '/medicos' ? 'active' : ''}><a href="/medicos">Médicos</a></li>
                    <li className={location.pathname === '/financeiro' ? 'active' : ''}><a href="/financeiro">Financeiro</a></li>
                    <li className={location.pathname === '/configuracoes' ? 'active' : ''}><a href="/configuracoes">Configurações</a></li>
                </ul>
            </div>
        </>
    )
}

export default NavBar
