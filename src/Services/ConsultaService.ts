import { pool } from "../lib/db";

export interface Consulta {
    id: number;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    paciente: string;
    medico: string;
    observacoes?: string;
    status: string;
}

export type DadosAtualizacaoConsulta = Partial<Omit<Consulta, 'id'>>;

export type ServiceResponse<T> = {
    status: "success" | "error";
    message: string;
    data?: T | null;
};

export async function pegarConsultas(): Promise<ServiceResponse<Consulta[]>> {
    try {
        const queryText = "SELECT * FROM consultas ORDER BY data, hora_inicio ASC";
        const result = await pool.query<Consulta>(queryText);
        return {
            status: "success",
            message: "Consultas obtidas com sucesso.",
            data: result.rows,
        };
    } catch (error) {
        console.error("Erro ao pegar consultas:", error);
        return { status: "error", message: "Erro interno ao tentar coletar as consultas." };
    }
}

export async function pegarConsultaPorId(id: string): Promise<ServiceResponse<Consulta>> {
    try {
        const queryText = "SELECT * FROM consultas WHERE id = $1";
        const result = await pool.query<Consulta>(queryText, [id]);

        if (result.rows.length === 0) {
            return { status: "error", message: "Consulta não encontrada." };
        }

        return {
            status: "success",
            message: "Consulta encontrada com sucesso.",
            data: result.rows[0],
        };
    } catch (error) {
        console.error(`Erro ao buscar consulta com id ${id}:`, error);
        return { status: "error", message: "Erro interno ao buscar a consulta." };
    }
}

export type DadosCriacaoConsulta = Omit<Consulta, 'id' | 'status'>;

export async function criarConsulta(dados: DadosCriacaoConsulta): Promise<ServiceResponse<Consulta>> {
    try {
        const { data, hora_inicio, hora_fim, paciente, medico, observacoes } = dados;

        const queryText = `
            INSERT INTO consultas (data, hora_inicio, hora_fim, paciente, medico, observacoes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const result = await pool.query<Consulta>(queryText, [data, hora_inicio, hora_fim, paciente, medico, observacoes]);

        return {
            status: "success",
            message: "Consulta cadastrada com sucesso!",
            data: result.rows[0],
        };
    } catch (error) {
        console.error("Erro ao criar consulta:", error);
        return { status: "error", message: "Erro interno ao criar a consulta.", data: null };
    }
}

export async function atualizarConsulta(id: string, dados: DadosAtualizacaoConsulta): Promise<ServiceResponse<Consulta>> {
    try {
        const camposValidos = Object.keys(dados).filter(key => key in dados && dados[key as keyof typeof dados] !== undefined);
        
        if (camposValidos.length === 0) {
            return { status: "error", message: "Nenhum dado fornecido para atualização." };
        }

        const valores = camposValidos.map(key => dados[key as keyof typeof dados]);
        const setClause = camposValidos.map((campo, index) => `"${campo}" = $${index + 1}`).join(', ');

        const queryText = `
            UPDATE consultas SET ${setClause}
            WHERE id = $${camposValidos.length + 1}
            RETURNING *;
        `;

        const result = await pool.query<Consulta>(queryText, [...valores, id]);

        if (result.rows.length === 0) {
            return { status: "error", message: "Consulta não encontrada." };
        }

        return {
            status: "success",
            message: "Consulta atualizada com sucesso!",
            data: result.rows[0],
        };
    } catch (error) {
        console.error("Erro ao atualizar consulta:", error);
        return { status: "error", message: "Erro interno ao atualizar consulta." };
    }
}

export async function deletarConsulta(id: string): Promise<ServiceResponse<null>> {
    try {
        const queryText = "DELETE FROM consultas WHERE id = $1";
        const result = await pool.query(queryText, [id]);

        if (result.rowCount === 0) {
            return { status: "error", message: "Consulta não encontrada para deleção." };
        }

        return {
            status: "success",
            message: "Consulta deletada com sucesso!",
        };
    } catch (error) {
        console.error(`Erro ao deletar consulta com id ${id}:`, error);
        return { status: "error", message: "Erro interno ao deletar a consulta." };
    }
}