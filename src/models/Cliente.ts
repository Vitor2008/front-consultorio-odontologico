export interface Cliente {
    id_cliente?: number;
    nome_completo: string;
    cpf: string;
    data_nascimento: string;
    telefone: string;
    endereco: string | null;
    numero_cartao_plano: string | null;
    data_cadastro: string;
}