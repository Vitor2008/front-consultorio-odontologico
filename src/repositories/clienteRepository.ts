// Importa o pool de conexões que você já configurou
import { pool } from "../lib/db";
import type { Cliente } from "../models/Cliente";
type ClienteCreateData = Omit<Cliente, "id_cliente" | "data_cadastro">;

class ClienteRepository {
  async create(data: ClienteCreateData): Promise<Cliente> {
    const { nome_completo, cpf, data_nascimento, telefone } = data;

    const queryText = `
      INSERT INTO clientes (nome_completo, cpf, data_nascimento, telefone) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;

    const values = [nome_completo, cpf, data_nascimento, telefone];

    const result = await pool.query<Cliente>(queryText, values);

    return result.rows[0];
  }

  async update(id: number, data: Partial<Cliente>): Promise<Cliente | null> {
    const fields = Object.keys(data)
      .map((key, index) => `"${key}" = $${index + 2}`)
      .join(", ");
    const values = Object.values(data);

    const queryText = `UPDATE clientes SET ${fields} WHERE id_client e= $1 RETURNING *`;
    const result = await pool.query<Cliente>(queryText, [id, ...values]);

    return result.rows[0] || null;
  }

  async findAll(): Promise<Cliente[]> {
    const queryText = "SELECT * FROM clientes ORDER BY nome_completo ASC";
    const result = await pool.query<Cliente>(queryText);
    return result.rows;
  }

  async findById(id: number): Promise<Cliente | null> {
    const queryText = "SELECT * FROM clientes WHERE id_cliente = $1";
    const result = await pool.query<Cliente>(queryText, [id]);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }
}

export default new ClienteRepository();
