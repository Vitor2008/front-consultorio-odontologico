/* eslint-disable @typescript-eslint/no-unused-vars */
import { pool } from "../lib/db";
import bcrypt from "bcrypt";

type ServiceResponse = {
  status: "success" | "error";
  message: string;
  data?: Date | null;
};

export async function cadastrarUsuario(
  nome: string,
  email: string,
  telefone: string,
  cpf: string,
  data_nascimento: string,
  senha_plana: string // Recebemos a senha em texto plano
): Promise<ServiceResponse> {
  try {
    const saltRounds = 10; // Fator de custo para o hash
    const senha_hash = await bcrypt.hash(senha_plana, saltRounds);

    const queryText = `
      INSERT INTO usuarios (nome, email, senha, data_nascimento, cpf, telefone, data_criacao)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING nome, email, cpf, data_criacao; -- Retorna dados seguros
    `;
    const values = [nome, email, senha_hash, data_nascimento, cpf, telefone];

    const result = await pool.query(queryText, values);

    console.log("Response database: ", result);

    return {
      status: "success",
      message: "Usuário cadastrado com sucesso!",
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    if (typeof error === "object" && error !== null && "code" in error) {
      console.error("Erro:", error.code);
    }
    // Erro de violação de chave única (ex: email ou CPF já existe)
    if (error instanceof Error && "code" in error && error.code === "23505") {
      return { status: "error", message: "E-mail ou CPF já está em uso." };
    }
    return { status: "error", message: "Erro interno ao criar usuário." };
  }
}

export async function realizarLogin(
  email: string,
  senha_plana: string
): Promise<ServiceResponse> {
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
