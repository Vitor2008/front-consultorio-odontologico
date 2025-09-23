import type { FastifyInstance } from "fastify";
import clienteController from "../controllers/clienteController";
import agendamentoController from "../controllers/agendamentoController";
import dentistaController from "../controllers/dentistaController";
import loginController from "../controllers/loginController";
import atendenteController from "../controllers/atendenteController"

export default async function clienteRoutes(fastify: FastifyInstance) {
  // Define a rota POST para /login
  fastify.post('/login', loginController.login);

  fastify.post('/atendentes', atendenteController.cadastrar);

  // Rota para criar um cliente
  fastify.post("/clientes", clienteController.create);

  // Rota para listar todos os clientes
  fastify.get("/clientes", clienteController.findAll);

  // Rota para buscar um cliente por ID
  fastify.get("/clientes/:id", clienteController.findById);

  // Rota para criar um agendamento
  fastify.post("/agendamentos", agendamentoController.create);

  // Rota para listar todos os agendamentos
  fastify.get("/agendamentos", agendamentoController.findAll);

  // Rota para criar um agendamento
  fastify.post("/dentistas", dentistaController.create);

  // Rota para listar todos os agendamentos
  fastify.get("/dentistas", dentistaController.findAll);
}
