import type { Cliente } from "../models/Cliente";
import clienteRepository from "../repositories/clienteRepository";

type ClienteCreateData = Omit<Cliente, "id_cliente" | "data_cadastro">;

class ClienteService {
  async create(data: ClienteCreateData): Promise<Cliente> {
    const novoCliente = await clienteRepository.create(data);
    return novoCliente;
  }

  async update(id: number, data: Partial<Cliente>): Promise<Cliente> {
    const clienteAtualizado = await clienteRepository.update(id, data);

    if (!clienteAtualizado) {
      throw new Error("Cliente não encontrado.");
    }

    return clienteAtualizado;
  }

  async findAll(): Promise<Cliente[]> {
    return clienteRepository.findAll();
  }

  async findById(id: number): Promise<Cliente | null> {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) {
      throw new Error("Cliente não encontrado.");
    }
    return cliente;
  }
}

export default new ClienteService();
