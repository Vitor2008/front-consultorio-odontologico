import type { Dentistas } from "../models/Dentistas";
import DentistaRepository from "../repositories/dentistaRepository";

type DentistaCreateData = Omit<Dentistas, "id_Dentista" | "data_cadastro">;

class DentistaService {
  async create(data: DentistaCreateData): Promise<Dentistas> {
    const novoDentista = await DentistaRepository.create(data);
    return novoDentista;
  }

  async update(id: number, data: Partial<Dentistas>): Promise<Dentistas> {
    const dentistaAtualizado = await DentistaRepository.update(id, data);

    if (!dentistaAtualizado) {
      throw new Error("Dentista não encontrado.");
    }

    return dentistaAtualizado;
  }

  async findAll(): Promise<Dentistas[]> {
    return DentistaRepository.findAll();
  }

  async findById(id: number): Promise<Dentistas | null> {
    const dentista = await DentistaRepository.findById(id);
    if (!dentista) {
      throw new Error("dentista não encontrado.");
    }
    return dentista;
  }
}

export default new DentistaService();
