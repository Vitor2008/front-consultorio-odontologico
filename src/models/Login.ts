export interface LoginPayload {
  email: string;
  senha_plana: string;
}

export interface ResponseType {
  id_atendente: number;
  nome: string;
}
export interface LoginResponse {
  dados: ResponseType;
  token: string;
  message: string;
}
export interface CadastroAtendentePayload {
  nome_completo: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  email_login: string;
  senha_plana: string;
}
