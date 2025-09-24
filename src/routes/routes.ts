import type { FastifyInstance } from "fastify";
import clienteController from "../controllers/clienteController";
import agendamentoController from "../controllers/agendamentoController";
import dentistaController from "../controllers/dentistaController";
import loginController from "../controllers/loginController";
import atendenteController from "../controllers/atendenteController";

async function agendamentoRoutes(app: FastifyInstance) {
  // Rotas específicas para agendamentos
  app.post("/", agendamentoController.create);
  app.get("/", agendamentoController.findAll);
  app.post("/:id", agendamentoController.update);
}

async function atendenteRoutes(app: FastifyInstance) {
  // Rotas específicas para atendentes
  app.post("/", atendenteController.cadastrar);
}

async function dentistaRoutes(app: FastifyInstance) {
  // Rotas específicas para dentistas
  app.post("/", dentistaController.create);
  app.get("/", dentistaController.findAll);
  app.post("/:id", dentistaController.update);
}

async function pacienteRoutes(app: FastifyInstance) {
  // Rotas específicas para clientes/pacientes
  app.post("/", clienteController.create);
  app.get("/", clienteController.findAll);
  app.post("/:id", clienteController.update);
}

async function loginRoutes(app: FastifyInstance) {
  // Rota de login
  app.post("/", loginController.login); // Alterado para "/" já que o prefixo será "/login"
}

export default function registerAllRoutes(app: FastifyInstance) {
  app.register(agendamentoRoutes, { prefix: "/agendamentos" });
  app.register(atendenteRoutes, { prefix: "/atendentes" });
  app.register(dentistaRoutes, { prefix: "/dentistas" });
  app.register(pacienteRoutes, { prefix: "/clientes" });
  app.register(loginRoutes, { prefix: "/login" });
}
