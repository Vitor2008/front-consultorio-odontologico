import type { Agendamentos } from "../models/Agendamento";
import agendamentoRepository from "../repositories/agendamentoRepository";

type AgendamentoCreateData = Omit<Agendamentos, "id_agendamento">;

class AgendamentoService {
  /**
   * Orquestra a criação de um novo agendamento.
   */
  async create(data: AgendamentoCreateData): Promise<Agendamentos> {
    return agendamentoRepository.create(data);
  }

  /**
   * Atualiza um agendamento existente.
   */
  async update(id: number, data: Partial<Agendamentos>): Promise<Agendamentos> {
    const agendamentoAtualizado = await agendamentoRepository.update(id, data);

    if (!agendamentoAtualizado) {
      throw new Error("Agendamento não encontrado.");
    }

    return agendamentoAtualizado;
  }

  /**
   * Busca todos os agendamentos.
   */
  async findAll(): Promise<Agendamentos[]> {
    return agendamentoRepository.findAll();
  }
}

export default new AgendamentoService();
