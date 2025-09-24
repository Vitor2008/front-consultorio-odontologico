/* eslint-disable @typescript-eslint/no-unused-vars */
import { pool } from "../lib/db";
// import bcrypt from "bcrypt";
import * as bcrypt from 'bcrypt';
import type { LoginPayload } from "../models/Login";

class LoginRepository {
    async login ({email, senha_plana}: LoginPayload) {
        try {
            const queryText = "SELECT * FROM usuarios WHERE email = $1";
            const result = await pool.query(queryText, [email]);
            if (result.rows.length === 0) {
                return { status: "error", message: "Usuário ou senha incorretos." };
            }

            const usuario = result.rows[0];

            const senhaCorreta = await bcrypt.compare(senha_plana, usuario.senha);

            if (!senhaCorreta) {
            return { status: "error", message: "Usuário ou senha incorretos." };
            }

            const { senha, ...dadosUsuario } = usuario;

            return {
            status: "success",
            message: "Login realizado com sucesso!",
            data: dadosUsuario,
            };
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            return { status: "error", message: "Erro interno ao tentar fazer login." };
        }
    }
}

export default new LoginRepository();