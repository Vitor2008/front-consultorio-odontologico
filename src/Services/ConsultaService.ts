/* eslint-disable @typescript-eslint/no-explicit-any */
import { pool } from "../lib/db";

interface DadosAtualizacaoConsulta {
    data?: string;
    hora_inicio?: string;
    hora_fim?: string;
    paciente?: string;
    medico?: string;
    observacoes?: string;
    status: "success" | "error";
    message: string;
    dados: any;
}

export async function criarConsulta(
    data?: string,
    hora_inicio?: string,
    hora_fim?: string,
    paciente?: string,
    medico?: string,
    observacoes?: string,
): Promise<DadosAtualizacaoConsulta> {
    try {
        const queryText = `
            INSERT INTO consultas (data, hora_inicio, hora_fim, paciente, medico, observacoes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING data, hora_inicio, hora_fim, paciente, medico, observacoes; -- Retorna dados seguros
        `;

    const result = await pool.query(queryText, [data, hora_inicio, hora_fim, paciente, medico, observacoes]);

    console.log("Response database: ", result);

    return {
        status: "success",
        message: "Consulta cadastrado com sucesso!",
        dados: result.rows[0],
    };
    } catch (error) {
        console.error("Erro ao pegar consultas:", error);
        return {
        status: "error",
        message: "Erro interno ao tentar coletar as consultas.",
        dados: null
        };
    }
}

export async function atualizarConsulta(
    id: string, 
    dados: DadosAtualizacaoConsulta
) {
    try {
        const campos = Object.keys(dados);
        const valores = Object.values(dados);

        if (campos.length === 0) {
            return { status: "error", message: "Nenhum dado fornecido para atualização." };
        }

        const setClause = campos
            .map((campo, index) => `"${campo}" = $${index + 1}`)
            .join(', ');

        const queryText = `
            UPDATE consultas
            SET ${setClause}
            WHERE id = $${campos.length + 1}
            RETURNING *;
        `;

        const result = await pool.query(queryText, [...valores, id]);

        if (result.rows.length === 0) {
            return { status: "error", message: "Consulta não encontrada." };
        }

        return {
            status: "success",
            message: "Consulta atualizada com sucesso!",
            data: result.rows[0]
        };

    } catch (error) {
        console.error("Erro ao atualizar consulta:", error);
        return { status: "error", message: "Erro interno ao atualizar consulta." };
    }
}