import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  cadastrarUsuario,
  pegarConsultas,
  realizarLogin,
} from "../Services/LoginService";

interface ICadastroBody {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  senha: string;
}

interface ILoginBody {
  email: string;
  senha: string;
}

export default async function routes(app: FastifyInstance) {
  console.log("Entrou em routes");
  // Cadastrar Usuário
  app.post(
    "/cadastrar-usuario",
    async (
      request: FastifyRequest<{ Body: ICadastroBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { nome, email, telefone, cpf, dataNascimento, senha } =
          request.body;
        const result = await cadastrarUsuario(
          nome,
          email,
          telefone,
          cpf,
          dataNascimento,
          senha
        );
        console.log("Status cadastrar: ", result.status);
        if (result.status === "error") {
          return reply.status(400).send(result);
        }
        return reply.status(201).send(result);
      } catch (error) {
        console.error("Erro no endpoint de cadastro:", error);
        return reply
          .status(500)
          .send({ status: "error", message: "Erro interno no servidor." });
      }
    }
  );

  // Cadastrar Login
  app.post(
    "/login",
    async (
      request: FastifyRequest<{ Body: ILoginBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { email, senha } = request.body;
        const result = await realizarLogin(email, senha);

        if (result.status === "error") {
          return reply.status(401).send(result);
        }
        return reply.status(200).send(result);
      } catch (error) {
        console.error("Erro no endpoint de login:", error);
        return reply
          .status(500)
          .send({ status: "error", message: "Erro interno no servidor." });
      }
    }
  );

  // Pegas todas as consultas
  app.get("/consultas", async (_request, reply) => {
    try {
      const result = await pegarConsultas();

      return reply.status(200).send(result);
    } catch (error) {
      console.error("Erro no endpoint /consultas:", error);
      return reply
        .status(500)
        .send({ status: "error", message: "Erro interno." });
    }
  });
}
