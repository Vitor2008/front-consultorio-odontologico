/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyRequest, FastifyReply } from "fastify";
import agendamentoService from "../Services/agendamentoService";
import type { Agendamentos } from "../models/Agendamento";

type AgendamentoCreateRequest = FastifyRequest<{
  Body: Omit<Agendamentos, "id_agendamento">;
}>;

class AgendamentoController {
  async create(request: AgendamentoCreateRequest, reply: FastifyReply) {
    try {
      const novoAgendamento = await agendamentoService.create(request.body);
      reply.status(201).send(novoAgendamento);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const agendamentos = await agendamentoService.findAll();
      reply.status(200).send(agendamentos);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }
}

export default new AgendamentoController();
