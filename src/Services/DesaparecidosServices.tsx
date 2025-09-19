import config from '../../appsettings.json';


export async function buscarDesaparecidos(pagina: number = 0, porPagina: number = 10) {
  try {
    //const response = await fetch(`${config.api.buscarDesaparecidos}`);
    console.log("pagina: ", pagina);
    console.log("porPagina: ", porPagina);
    const url = `${config.api.buscarDesaparecidos}/filtro?pagina=${pagina}&porPagina=${porPagina}`;
    const response = await fetch(url);
    if (!response.ok) {
      return {
        status: 'error',
        message: 'Erro ao buscar dados da API'
      };
    }
    const dados = await response.json();
    return {
      status: 'success',
      data: dados.content,
      total: dados.totalElements,
      totalPaginas: dados.totalPages
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Erro ao buscar desaparecidos: ${error}`
    };
  }
};

export const buscarDetalheDesaparecido = async (id: number) => {
  try {
    const response = await fetch(`${config.api.buscarDetalheDesaparecido}/${id}`);
    if (!response.ok) {
      return {
        status: 'error',
        message: 'Erro ao buscar detalhes'
      };
    }
    const dados = await response.json();
    return {
      status: 'success',
      data: dados
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Erro ao buscar detalhes: ${error}`
    };
  }
};

export async function buscarDesaparecidosComFiltro(filtros: {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: "MASCULINO" | "FEMININO";
  status?: "DESAPARECIDO" | "LOCALIZADO";
  pagina?: number;
  porPagina?: number;
}) {
  try {
    const url = new URL(`${config.api.buscarDesaparecidosComFiltro}`);

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== null) {
        url.searchParams.append(chave, valor.toString());
      }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      return {
        status: 'error',
        message: `Erro ao buscar dados da API`
      };
    }
    const dados = await response.json();
    return {
      status: 'success',
      data: dados.content
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Erro ao buscar desaparecidos com filtros: ${error}`
    };
  }
};

export const enviarInformacoes = async (dados: {
  informacao: string;
  data: string;
  ocoId: number;
  id: number;
  anexos?: File[];
}) => {
  try {
    const { anexos } = dados;

    const formData = new FormData();

    for (const [key, value] of Object.entries(dados)) {
      formData.append(key, value as string);
    }

    if (anexos && anexos.length > 0) {
      anexos.forEach((anexo, index) => {
        formData.append(`anexos[${index}]`, anexo);
      });
    }

    const response = await fetch(`${config.api.enviarInformacoes}`, {
      method: "POST",
      headers: {
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        status: 'error',
        message: `Erro ao enviar informações para API ${errorText}`
      };
    }
    return {
      status: 'success',
      data: await response.json()
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Erro ao enviar informações do desaparecido: ${error}`
    };
  }
};



