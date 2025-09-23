import { useState } from 'react';
import './NavBar.css'
import logo from '../../assets/Img/logo.png'

const NavBar = () => {
    const [aberta, setAberta] = useState(false);
    return (
        <>
            <div className="navbar no-mobile">
                <div className='flex'>
                    <img src={logo} width={40} alt='logo' />
                    <h2 className="logo">Sistema SISo</h2>
                </div>
                <ul className="nav-links">
                    <li><a href="/consultas">Consultas</a></li>
                    <li><a href="/pacientes">Pacientes</a></li>
                    <li><a href="/medicos">Médicos</a></li>
                    <li><a href="/financeiro">Financeiro</a></li>
                    <li><a href="/configuracoes">Configurações</a></li>
                </ul>
            </div>
        </>
    )
}

export default NavBar
