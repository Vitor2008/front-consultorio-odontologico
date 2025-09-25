import type { Agendamentos } from "./Agendamento";

export interface Dentistas {
    id_dentista?: number;
    nome_completo: string;
    cro: string;
    data_nascimento: string;
    telefone: string;
    endereco: string | null;
    data_cadastro: string;
    agendamentos: Agendamentos;
}