/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import atendenteRepository from '../repositories/atendenteRepository';
import type { LoginPayload } from '../models/Login';

class LoginService {
  async login(payload: LoginPayload) {
    const { email, senha_plana } = payload;

    const atendente = await atendenteRepository.findByEmail(email);

    if (!atendente) {
      throw new Error("Usuário ou senha incorretos.");
    }

    const senhaCorreta = await bcrypt.compare(senha_plana, atendente.senha_hash);
    if (!senhaCorreta) {
      throw new Error("Usuário ou senha incorretos.");
    }
    
    const tokenPayload = {
      id: atendente.id_atendente,
      nome: atendente.nome_completo,
      email: atendente.email_login
    };
    
    console.log("Validou tokenPayload: ", tokenPayload)
    console.log("Env: ", process.env.JWT_SECRET!)
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '8h',
    });

    const { senha_hash, ...dadosUsuario } = atendente;

    return {
      token,
      usuario: dadosUsuario
    };
  }
}

export default new LoginService();