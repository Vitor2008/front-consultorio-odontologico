import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { criarConsulta } from "../Services/ConsultaService"
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

interface DadosAtualizacaoConsulta {
    data?: string;
    hora_inicio?: string;
    hora_fim?: string;
    paciente?: string;
    medico?: string;
    observacoes?: string;
}

interface ILoginBody {
  email: string;
  senha: string;
}

export default async function routes(app: FastifyInstance) {
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

  // Criar consultas
  app.post("/consultas", async (
      request: FastifyRequest<{ Body: DadosAtualizacaoConsulta }>,
      reply: FastifyReply
    ) => {
    try {
        const { data, hora_inicio, hora_fim, medico, paciente, observacoes } =
          request.body;

        const result = await criarConsulta(data, hora_inicio, hora_fim, paciente, medico, observacoes)

        if (result.status === "error") {
          return reply.status(400).send(result);
        }
        return reply.status(201).send(result);
    } catch (error) {
      console.error("Erro no endpoint /consultas:", error);
      return reply 
        .status(500)
        .send({ status: "error", message: "Erro interno." });
    }
  });


}
