// Importa o pool de conexões que você já configurou
import { pool } from "../lib/db";
import type { Dentistas } from "../models/Dentistas";
type ClienteCreateData = Omit<Dentistas, "id_dentista" | "data_cadastro">;

class DentistaRepository {
  async create(data: ClienteCreateData): Promise<Dentistas> {
    const { nome_completo, cro, data_nascimento, telefone, endereco } = data;

    const queryText = `
      INSERT INTO dentistas (nome_completo, cro, data_nascimento, telefone, endereco) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;

    const values = [nome_completo, cro, data_nascimento, telefone, endereco];

    const result = await pool.query<Dentistas>(queryText, values);

    return result.rows[0];
  }

  async update(
    id: number,
    data: Partial<Dentistas>
  ): Promise<Dentistas | null> {
    const fields = Object.keys(data)
      .map((key, index) => `"${key}" = $${index + 2}`)
      .join(", ");
    const values = Object.values(data);

    const queryText = `UPDATE dentistas SET ${fields} WHERE id_dentista = $1 RETURNING *`;
    const result = await pool.query<Dentistas>(queryText, [id, ...values]);

    return result.rows[0] || null;
  }

  async findAll(): Promise<Dentistas[]> {
    const queryText = "SELECT * FROM dentistas ORDER BY nome_completo ASC";
    const result = await pool.query<Dentistas>(queryText);
    return result.rows;
  }

  async findById(id: number): Promise<Dentistas | null> {
    const queryText = "SELECT * FROM dentistas WHERE id_cliente = $1";
    const result = await pool.query<Dentistas>(queryText, [id]);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }
}

export default new DentistaRepository();
