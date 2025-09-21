import type { FastifyRequest, FastifyReply } from "fastify";

export const users = async (req: FastifyRequest, res: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };

  console.log("Backend recebeu o Email: ", email);
  console.log("Backend recebeu a Senha: ", password);

  res.send({
    status: "ok",
    message: "Dados recebidos com sucesso pelo backend!",
  });
};
