import type { ReactNode } from "react";
import "./Layout.css";
import NavBar from "../../Components/NavBar/NavBar";
import Button from "../../Components/Button/Button";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <NavBar />
      <div className="layout-content">
        <header className="layout-header">
          <span>
            {user
              ? `Bem-vindo, ${user.nome_completo}`
              : "Nenhum usuário logado"}
          </span>
          <Button
            onClick={logout}
            text="Sair"
            icon={faRightFromBracket}
            color="bg-color-secondary"
          ></Button>
        </header>
        <main className="layout-main">{children}</main>
      </div>
    </>
  );
};

export default Layout;
