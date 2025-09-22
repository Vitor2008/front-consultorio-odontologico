import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { criarConsulta, pegarConsultas, atualizarConsulta, pegarConsultaPorId, deletarConsulta } from "../Services/ConsultaService";
import type { DadosCriacaoConsulta, DadosAtualizacaoConsulta } from "../Services/ConsultaService";
import { cadastrarUsuario, realizarLogin } from "../Services/LoginService";

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
        request: FastifyRequest<{ Body: DadosCriacaoConsulta}>,
        reply: FastifyReply
    ) => {
    try {
        const result = await criarConsulta(request.body)

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

  app.patch("/consultas/:id", async (
          request: FastifyRequest<{ Params: { id: string }, Body: DadosAtualizacaoConsulta }>,
          reply: FastifyReply
      ) => {
          try {
              const { id } = request.params;
              const dados = request.body;
              const result = await atualizarConsulta(id, dados);

              if (result.status === 'error') {
                  return result.message.includes("não encontrada") 
                      ? reply.status(404).send(result) 
                      : reply.status(400).send(result);
              }
              return reply.status(200).send(result);
          } catch (error) {
              console.error(`Erro no endpoint PATCH /consultas/${request.params.id}:`, error);
              return reply.status(500).send({ status: "error", message: "Erro interno." });
          }
      }
  );

  app.get("/consultas/:id", async (
          request: FastifyRequest<{ Params: { id: string } }>,
          reply: FastifyReply
      ) => {
          try {
              const { id } = request.params;
              const result = await pegarConsultaPorId(id);

              if (result.status === 'error') {
                  // Se não encontrou, o status correto é 404 Not Found
                  return reply.status(404).send(result);
              }

              return reply.status(200).send(result);
          } catch (error) {
              console.error("Erro no endpoint GET /consultas/:id:", error);
              return reply.status(500).send({ status: "error", message: "Erro interno." });
          }
      }
  );

  app.delete("/consultas/:id",async (
          request: FastifyRequest<{ Params: { id:string } }>,
          reply: FastifyReply
      ) => {
          try {
              const { id } = request.params;
              const result = await deletarConsulta(id);

              if (result.status === 'error') {
                  return reply.status(404).send(result);
              }

              return reply.status(200).send(result);
          } catch (error) {
              console.error("Erro no endpoint DELETE /consultas/:id:", error);
              return reply.status(500).send({ status: "error", message: "Erro interno." });
          }
      }
  );
}
