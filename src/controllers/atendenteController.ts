/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyRequest, FastifyReply } from "fastify";
import atendenteService from "../services/atendenteService";
import type { CadastroAtendentePayload } from "../models/Login";

class AtendenteController {
  async cadastrar(request: FastifyRequest, reply: FastifyReply) {
    try {
      const payload = request.body as CadastroAtendentePayload;

      console.log("Payload: ", payload);

      const novoAtendente = await atendenteService.cadastrar(payload);

      console.log("novoAtendente: ", novoAtendente);
      // 201 Created é o status correto para criação de recurso
      return reply.status(201).send(novoAtendente);
    } catch (error: any) {
      // 409 Conflict é um bom status para quando o recurso já existe
      if (
        error.message.includes("já está em uso") ||
        error.message.includes("já está cadastrado")
      ) {
        return reply.status(409).send({ error: error.message });
      }

      return reply.status(500).send({ error: "Erro interno no servidor." });
    }
  }
}

export default new AtendenteController();
