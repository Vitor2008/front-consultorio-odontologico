export interface LoginPayload {
    email: string;
    senha_plana: string;
}

export interface CadastroAtendentePayload {
    nome_completo: string;
    telefone: string;
    cpf: string;
    data_nascimento: string;
    email_login: string;
    senha_plana: string;
}