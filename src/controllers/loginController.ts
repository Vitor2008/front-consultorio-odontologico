/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyRequest, FastifyReply } from "fastify";
import loginService from "../Services/loginService";
import type { LoginPayload } from "../models/Login";

class LoginController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const payload = request.body as LoginPayload;
      if (!payload.email || !payload.senha_plana) {
        return reply
          .status(400)
          .send({ error: "E-mail e senha são obrigatórios." });
      }

      const resultado = await loginService.login(payload);
      return reply.status(200).send(resultado);
    } catch (error: any) {
      return reply.status(401).send({ error: error.message });
    }
  }
}

export default new LoginController();
