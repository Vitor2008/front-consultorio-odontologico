/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { LoginResponse, ResponseType } from "../models/Login";

// 2. Defina o que o seu contexto irá fornecer
interface AuthContextType {
  user: ResponseType | null;
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
}

// 3. Crie o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Crie o "Provedor" do Contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ResponseType | null>(null);

  // Efeito para carregar o usuário do localStorage quando a página é carregada
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser != null) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (loginResponse: LoginResponse) => {
    const userData: ResponseType = {
      id_atendente: loginResponse.dados.id_atendente,
      nome: loginResponse.dados.nome,
    };
    console.log("userData: ", userData);
    setUser(userData);
    localStorage.setItem("usuario", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
    window.location.href = "/"; // Redireciona para a página de login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Crie um Hook customizado para facilitar o uso do contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
