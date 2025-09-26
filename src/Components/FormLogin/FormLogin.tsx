import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormLogin.css";
import api from "../../api/api";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import type { LoginResponse } from "../../models/Login";

interface FormLoginProps {
  tipo: "login" | "register";
  onTrocarTipo: () => void;
}

const FormLogin: React.FC<FormLoginProps> = ({ tipo, onTrocarTipo }) => {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // setMensagem("Entrando...");

    try {
      const response = (
        await axios.post<LoginResponse>(
          `${import.meta.env.VITE_URL_SERVER}/login`,
          {
            email,
            senha_plana: senha,
          }
        )
      ).data;

      login(response);
      setMensagem(response.message);
      localStorage.setItem("usuario", JSON.stringify(response.dados));
      localStorage.setItem("authToken", response.token);
      navigate("/consultas");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMensagem(error.response.data.error || "Erro no login.");
      } else {
        setMensagem("Erro de conexão com o servidor.");
      }
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("Cadastrando...");

    try {
      const payload = {
        nome_completo: nome,
        email_login: email,
        telefone,
        cpf,
        data_nascimento: dataNascimento,
        senha_plana: senha,
      };

      await api.post("/atendentes", payload);

      setMensagem("Agora você pode fazer o login!");
      onTrocarTipo();
    } catch (error) {
      console.log("Erro do back: ", error);
      if (axios.isAxiosError(error) && error.response) {
        setMensagem(error.response.data.message || "Erro ao cadastrar.");
      } else {
        setMensagem("Erro de conexão com o servidor.");
      }
    }
  };

  useEffect(() => {
    if (!mensagem) return;

    const limparMensagem = () => {
      setMensagem("");
    };

    window.addEventListener("click", limparMensagem);
    window.addEventListener("keydown", limparMensagem);

    return () => {
      window.removeEventListener("click", limparMensagem);
      window.removeEventListener("keydown", limparMensagem);
    };
  }, [mensagem]);

  return tipo === "login" ? (
    <form className="form card-form-login" onSubmit={handleLogin}>
      <p className="title">Entrar </p>
      <p className="message">Acesse sua conta no SISo</p>
      <label>
        <input
          placeholder=""
          type="email"
          className="input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span>Email</span>
      </label>

      <label>
        <input
          placeholder=""
          type="password"
          className="input"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <span>Senha</span>
      </label>
      <button className="submit" type="submit">
        Entrar
      </button>
      {mensagem && <p className="error-message">{mensagem}</p>}
      {/* <p className="signin">
        Ainda não tem uma conta?{" "}
        <a href="#" onClick={onTrocarTipo}>
          Criar Conta
        </a>{" "}
      </p> */}
    </form>
  ) : (
    <form className="form form-register" onSubmit={handleCadastro}>
      <p className="title">Registrar </p>
      <p className="message">Crie sua conta</p>
      <div className="flex">
        <label>
          <input
            type="text"
            className="input"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <span>Nome completo</span>
        </label>
        <label>
          <input
            type="email"
            className="input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>
      </div>

      <div className="flex">
        <label>
          <input
            type="phone"
            className="input"
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <span>Telefone</span>
        </label>

        <label>
          <input
            type="text"
            className="input"
            required
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <span>CPF</span>
        </label>
      </div>
      <label>
        <p>Data Nascimento</p>
        <input
          type="date"
          className="input"
          required
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />
      </label>
      <label>
        <input
          type="password"
          className="input"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <span>Senha</span>
      </label>
      <label>
        <input
          type="password"
          className="input"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <span>Confirmar senha</span>
      </label>
      <button className="submit">Criar conta</button>
      <p className="signin">
        Já tem uma conta?{" "}
        <a href="#" onClick={onTrocarTipo}>
          Entrar
        </a>
      </p>
      {mensagem && <p className="error-message">{mensagem}</p>}
    </form>
  );
};

export default FormLogin;
