/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyRequest, FastifyReply } from "fastify";
import clienteService from "../Services/clienteService";
import type { Cliente } from "../models/Cliente";

// Tipo para os dados de criação que vêm do corpo da requisição
type ClienteCreateRequest = FastifyRequest<{
  Body: Omit<Cliente, "id_cliente" | "data_cadastro">;
}>;

// Tipo para requisições que têm um ID no parâmetro da URL
type ClienteIdRequest = FastifyRequest<{ Params: { id: string } }>;

class ClienteController {
  async create(request: ClienteCreateRequest, reply: FastifyReply) {
    try {
      const novoCliente = await clienteService.create(request.body);
      reply.status(201).send(novoCliente);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const clientes = await clienteService.findAll();
      reply.status(200).send(clientes);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  async findById(request: ClienteIdRequest, reply: FastifyReply) {
    try {
      const id = parseInt(request.params.id, 10);
      const cliente = await clienteService.findById(id);
      reply.status(200).send(cliente);
    } catch (error: any) {
      if (error.message === "Cliente não encontrado.") {
        reply.status(404).send({ error: error.message });
      } else {
        reply.status(500).send({ error: error.message });
      }
    }
  }
}

export default new ClienteController();
