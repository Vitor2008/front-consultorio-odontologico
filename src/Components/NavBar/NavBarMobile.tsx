import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./NavBarMobile.css";
import logo from "../../assets/Img/logo.png";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Components/Button/Button";

const NavBarMobile = () => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const usuarioString = localStorage.getItem("usuario");
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;
    const isAdmin = usuario?.admin;

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="navbar-mobile no-desktop">

            <div className="navbar-mobile-header">
                <img src={logo} width={40} alt="logo" />
                <h2>SISo</h2>
                <Button
                    onClick={toggleMenu}
                    text=""
                    icon={faBars}
                    color="bg-color-primary"
                ></Button>
            </div>
            {menuOpen && (
                <ul className="mobile-nav-links">
                    <li className={location.pathname === '/consultas' ? 'active' : ''}><a href="/consultas">Consultas</a></li>
                    <li className={location.pathname === '/pacientes' ? 'active' : ''}><a href="/pacientes">Pacientes</a></li>
                    <li className={location.pathname === '/medicos' ? 'active' : ''}><a href="/medicos">Médicos</a></li>
                    {isAdmin && (
                        <>
                            <li className={location.pathname === '/financeiro' ? 'active' : ''}><a href="/financeiro">Financeiro</a></li>
                            <li className={location.pathname === '/configuracoes' ? 'active' : ''}><a href="/configuracoes">Configurações</a></li>
                        </>
                    )}
                </ul>
            )
            }
        </div >
    )
};

export default NavBarMobile;
