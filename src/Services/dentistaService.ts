import type { Dentistas } from "../models/Dentistas";
import DentistaRepository from "../repositories/dentistaRepository";

type DentistaCreateData = Omit<Dentistas, "id_Dentista" | "data_cadastro">;

class DentistaService {
  async create(data: DentistaCreateData): Promise<Dentistas> {
    const novoDentista = await DentistaRepository.create(data);
    return novoDentista;
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
