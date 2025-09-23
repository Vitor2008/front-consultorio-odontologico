import { pool } from "../lib/db";
import type { Atendente } from '../models/Atendente';

type AtendenteCreateData = Omit<Atendente, 'id'>;

class AtendenteRepository {
  
    async findByEmail(email: string): Promise<Atendente | null> {
        const queryText = 'SELECT id_atendente, nome_completo, email_login, senha_hash FROM atendentes WHERE email_login = $1';
        
        const result = await pool.query<Atendente>(queryText, [email]);
        if (result.rows.length === 0) {
          return null;
        }
        
        return result.rows[0];
    }

  async findByCpf(cpf: string): Promise<Atendente | null> {
    const queryText = 'SELECT * FROM atendentes WHERE cpf = $1';
    const result = await pool.query<Atendente>(queryText, [cpf]);
    return result.rows[0] || null;
  }

  async create(data: AtendenteCreateData): Promise<Atendente> {
    const { nome_completo, telefone, cpf, data_nascimento, email_login, senha_hash } = data;

    const queryText = `
      INSERT INTO atendentes (nome_completo, telefone, cpf, data_nascimento, email_login, senha_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_atendente, nome_completo, email_login, data_nascimento, cpf, telefone;
    `;
    
    const values = [nome_completo, telefone, cpf, data_nascimento, email_login, senha_hash];
    const result = await pool.query<Atendente>(queryText, values);
    
    return result.rows[0];
  }
}

export default new AtendenteRepository();