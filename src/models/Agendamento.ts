export interface Agendamentos {
    id_agendamento?: number;
    id_cliente: number;
    id_dentista: number;
    data_hora_inicio: string;
    data_hora_fim: string;
    status_agendamento:
    | "Agendado"
    | "Confirmado"
    | "Cancelado Pelo Paciente"
    | "Cancelado Pela Clínica"
    | "Realizado"
    | "Não Compareceu";
    valor_consulta: number | null;
    status_pagamento: "Pendente" | "Pago" | "Parcial";
    observacoes: string | null;
}