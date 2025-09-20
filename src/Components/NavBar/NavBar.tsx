import './NavBar.css'

const NavBar = () => {
    return (
        <div className="navbar">
            <h2 className="logo">OdontoVida</h2>
            <ul className="nav-links">
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/pacientes">Pacientes</a></li>
                <li><a href="/consultas">Consultas</a></li>
                <li><a href="/configuracoes">Configurações</a></li>
            </ul>
        </div>
    )
}

export default NavBar
