import React, { useState } from 'react'
import './FormLogin.css'
import { realizarLogin, cadastrarUsuario } from '../../Services/LoginService'

interface FormLoginProps {
    tipo: 'login' | 'register';
    onTrocarTipo: () => void;
}

const FormLogin: React.FC<FormLoginProps> = ({ tipo, onTrocarTipo }) => {

    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const resposta = await realizarLogin(email, senha);

        if (resposta.status === 'success') {
            setMensagem(resposta.message);
            // Aqui você pode redirecionar ou salvar dados no localStorage, etc.
        } else {
            setMensagem(resposta.message);
        }
    };

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        const resposta = await cadastrarUsuario(nome, email, telefone, cpf, dataNascimento, senha);

        if (resposta.status === 'success') {
            setMensagem(resposta.message);
            // Aqui você pode redirecionar ou salvar dados no localStorage, etc.
        } else {
            setMensagem(resposta.message);
        }
    };

    return tipo === 'login' ?
        (<form className="form card-form-login" onSubmit={handleLogin}>
            <p className="title">Entrar </p>
            <p className="message">Acesse sua conta na Clínica OdontoVida</p>
            <label>
                <input placeholder="" type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <span>Email</span>
            </label>

            <label>
                <input placeholder="" type="password" className="input" required value={senha} onChange={(e) => setSenha(e.target.value)} />
                <span>Senha</span>
            </label>
            <button className="submit" type="submit">Entrar</button>
            {mensagem && <p className="error-message">{mensagem}</p>}
            <p className="signin">Ainda não tem uma conta? <a href="#" onClick={onTrocarTipo}>Criar Conta</a> </p>
        </form>)
        : (
            <form className="form form-register" onSubmit={handleCadastro}>
                <p className="title">Registrar </p>
                <p className="message">Crie sua conta</p>
                <div className='flex'>
                    <label>
                        <input type="text" className="input" required value={nome} onChange={(e) => setNome(e.target.value)} />
                        <span>Nome completo</span>
                    </label>
                    <label>
                        <input type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <span>Email</span>
                    </label>
                </div>

                <div className='flex'>
                    <label>
                        <input type="phone" className="input" required value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                        <span>Telefone</span>
                    </label>

                    <label>
                        <input type="text" className="input" required value={cpf} onChange={(e) => setCpf(e.target.value)} />
                        <span>CPF</span>
                    </label>
                </div>
                <label>
                    <p>Data Nascimento</p>
                    <input type="date" className="input" required value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                </label>
                <label>
                    <input type="password" className="input" required value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <span>Senha</span>
                </label>
                <label>
                    <input type="password" className="input" required value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <span>Confirmar senha</span>
                </label>
                <button className="submit">Criar conta</button>
                <p className="signin">Já tem uma conta? <a href="#" onClick={onTrocarTipo}>Entrar</a> </p>
            </form>
        );
}

export default FormLogin