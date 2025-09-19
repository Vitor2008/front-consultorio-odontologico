import {
  buscarDesaparecidos,
  buscarDetalheDesaparecido,
  buscarDesaparecidosComFiltro,
  enviarInformacoes,
} from "../Services/DesaparecidosServices";

// Tipagem dos dados principais
interface FiltrosDesaparecidos {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: "MASCULINO" | "FEMININO";
  status?: "DESAPARECIDO" | "LOCALIZADO";
  pagina?: number;
  porPagina?: number;
}

export const DesaparecidosController = {

  async listarTodos(pagina: number = 0, porPagina: number = 10) {
    try {
      return await buscarDesaparecidos(pagina, porPagina);
    } catch (error) {
      return {
        status: 'error',
        message: `Controller - Erro ao listar desaparecidos: ${error}`
      };
    }
  },

  async listarComFiltro(filtros: FiltrosDesaparecidos) {
    try {
      return await buscarDesaparecidosComFiltro(filtros);
    } catch (error) {
      return {
        status: 'error',
        message: `Controller - Erro ao listar com filtros: ${error}`
      };
    }
  },

  async obterDetalhes(id: number) {
    try {
      return await buscarDetalheDesaparecido(id);
    } catch (error) {
      console.error("Controller - Erro ao obter detalhes:", error);
      return {
        status: 'error',
        message: `Controller - Erro ao obter detalhes: ${error}`
      };
    }
  },

  async enviarInformacoes(dados: {
    informacao: string;
    data: string;
    ocoId: number;
    id: number;
    anexos?: File[];
  }) {
    try {
      return await enviarInformacoes(dados);
    } catch (error) {
      return {
        status: 'error',
        message: `Controller -  Erro ao enviar informações: ${error}`
      };
    }
  },
};
