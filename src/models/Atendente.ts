export interface Atendente {
    id_atendente?: number;
    nome_completo: string;
    email_login: string;
    senha_hash: string;
    data_nascimento: string;
    data_cadastro: string;
    cpf: string;
    telefone: string;
    admin: boolean;
    ativo: boolean;
}