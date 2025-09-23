import { pool } from "../lib/db";
import type { Agendamentos } from "../models/Agendamento";

type AgendamentoCreateData = Omit<Agendamentos, "id_agendamento">;

class AgendamentoRepository {
  async create(data: AgendamentoCreateData): Promise<Agendamentos> {
    const {
      id_cliente,
      id_dentista,
      data_hora_inicio,
      data_hora_fim,
      status_agendamento,
      valor_consulta,
      status_pagamento,
      observacoes,
    } = data;

    const queryText = `
      INSERT INTO agendamentos (
        id_cliente, id_dentista, data_hora_inicio, data_hora_fim,
        status_agendamento, valor_consulta, status_pagamento, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      id_cliente,
      id_dentista,
      data_hora_inicio,
      data_hora_fim,
      status_agendamento,
      valor_consulta,
      status_pagamento,
      observacoes,
    ];

    const result = await pool.query<Agendamentos>(queryText, values);
    return result.rows[0];
  }

  async findAll(): Promise<Agendamentos[]> {
    const queryText = `
      SELECT
        ag.*,
        cl.nome_completo as nome_cliente,
        de.nome_completo as nome_dentista
      FROM agendamentos ag
      JOIN clientes cl ON ag.id_cliente = cl.id_cliente
      JOIN dentistas de ON ag.id_dentista = de.id_dentista
      ORDER BY ag.data_hora_inicio DESC;
    `;
    const result = await pool.query(queryText); // O tipo de retorno é um pouco diferente aqui
    return result.rows;
  }
}

export default new AgendamentoRepository();
