import type { Agendamentos } from "../models/Agendamento";
import agendamentoRepository from "../repositories/agendamentoRepository";

type AgendamentoCreateData = Omit<Agendamentos, "id_agendamento">;

class AgendamentoService {
  /**
   * Orquestra a criação de um novo agendamento.
   */
  async create(data: AgendamentoCreateData): Promise<Agendamentos> {
    // Regra de Negócio: Verificar se o horário já está ocupado para aquele dentista
    // (A constraint no banco de dados já faz isso, mas validar aqui retorna um erro melhor)
    // const conflito = await agendamentoRepository.findByDentistaAndHorario(data.id_dentista, data.data_hora_inicio);
    // if (conflito) {
    //   throw new Error("Este horário já está ocupado para o dentista selecionado.");
    // }

    return agendamentoRepository.create(data);
  }

  /**
   * Busca todos os agendamentos.
   */
  async findAll(): Promise<Agendamentos[]> {
    return agendamentoRepository.findAll();
  }
}

export default new AgendamentoService();
