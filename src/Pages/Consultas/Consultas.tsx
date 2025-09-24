import "./Consultas.css";
import React, { useState, useMemo, useEffect } from "react";
import {
  faPlus,
  faSearch,
  faHospitalUser,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Components/Button/Button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import { isAfter, isBefore, format, parseISO } from "date-fns";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";

// 1. Interfaces atualizadas para corresponder ao backend
interface Cliente {
  id_cliente: number;
  nome_completo: string;
}

interface Dentista {
  id_dentista: number;
  nome_completo: string;
}

interface Agendamento {
  id_agendamento: number;
  id_cliente: number;
  id_dentista: number;
  data_hora_inicio: string;
  data_hora_fim: string;
  status_agendamento: string;
  observacoes?: string;
  // Adicionamos os nomes para facilitar a exibição na tabela
  nome_cliente?: string;
  nome_dentista?: string;
}

const Consultas: React.FC = () => {
  // 2. Estados para armazenar todos os dados que a página precisa
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dentistas, setDentistas] = useState<Dentista[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [dataInicioInput, setDataInicioInput] = useState("");
  const [dataFimInput, setDataFimInput] = useState("");
  const [pacienteInput, setPacienteInput] = useState("");
  const [dentistaInput, setDentistaInput] = useState("");

  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    paciente: "",
    dentista: "",
  });

  // 3. useEffect para buscar todos os dados da API quando o componente carregar
  useEffect(() => {
    const buscarDadosIniciais = async () => {
      try {
        // Usamos Promise.all para fazer as requisições em paralelo
        const [resAgendamentos, resClientes, resDentistas] = await Promise.all([
          axios.get(`${import.meta.env.VITE_URL_SERVER}/agendamentos`),
          axios.get(`${import.meta.env.VITE_URL_SERVER}/clientes`),
          axios.get(`${import.meta.env.VITE_URL_SERVER}/dentistas`),
        ]);

        setAgendamentos(resAgendamentos.data || []);
        setClientes(resClientes.data || []);
        setDentistas(resDentistas.data || []);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
        Swal.fire(
          "Erro",
          "Não foi possível carregar os dados da página.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    buscarDadosIniciais();
  }, []);

  const agendamentosFiltrados = useMemo(() => {
    // Mapeamos os agendamentos para incluir os nomes do cliente e dentista
    const agendamentosComNomes = agendamentos.map((ag) => {
      const cliente = clientes.find((c) => c.id_cliente === ag.id_cliente);
      const dentista = dentistas.find((d) => d.id_dentista === ag.id_dentista);
      return {
        ...ag,
        nome_cliente: cliente?.nome_completo || "Não encontrado",
        nome_dentista: dentista?.nome_completo || "Não encontrado",
      };
    });

    // Aplicamos os filtros
    return agendamentosComNomes.filter((ag) => {
      const dataAgendamento = parseISO(ag.data_hora_inicio);
      const dentroDoIntervalo =
        (!filtros.dataInicio ||
          isAfter(dataAgendamento, parseISO(filtros.dataInicio))) &&
        (!filtros.dataFim ||
          isBefore(dataAgendamento, parseISO(filtros.dataFim)));

      const pacienteMatch = ag.nome_cliente
        .toLowerCase()
        .includes(filtros.paciente.toLowerCase());
      const dentistaMatch = ag.nome_dentista
        .toLowerCase()
        .includes(filtros.dentista.toLowerCase());

      return dentroDoIntervalo && pacienteMatch && dentistaMatch;
    });
  }, [agendamentos, clientes, dentistas, filtros]);

  // 4. Colunas da tabela atualizadas para usar os dados corretos
  const columns = useMemo<ColumnDef<Agendamento>[]>(
    () => [
      {
        accessorKey: "data_hora_inicio_data",
        header: "Data",
        cell: (info) =>
          format(parseISO(info.row.original.data_hora_inicio), "dd/MM/yyyy"),
      },
      {
        accessorKey: "data_hora_inicio_hora",
        header: "Início",
        cell: (info) =>
          format(parseISO(info.row.original.data_hora_inicio), "HH:mm"),
      },
      {
        accessorKey: "data_hora_fim",
        header: "Término",
        cell: (info) =>
          format(parseISO(info.getValue() as string), "HH:mm"),
      },
      { accessorKey: "nome_cliente", header: "Paciente" },
      { accessorKey: "nome_dentista", header: "Dentista" },
      {
        accessorKey: "status_agendamento",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;

          let statusClass = "";
          switch (status) {
            case "Confirmado":
              statusClass = "color-blue font-semibold";
              break;
            case "Cancelado Pelo Paciente":
              statusClass = "color-red font-semibold";
              break;
            case "Agendado":
              statusClass = "color-yellow font-semibold";
              break;
            case "Realizado":
              statusClass = "color-green font-semibold";
              break;
            default:
              statusClass = "";
          }

          return <span className={statusClass}>{status}</span>;
        },
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: agendamentosFiltrados,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePesquisar = () => {
    setFiltros({
      dataInicio: dataInicioInput,
      dataFim: dataFimInput,
      paciente: pacienteInput,
      dentista: dentistaInput,
    });
  };

  // 5. Função do modal refatorada para receber os dados já carregados
  const abrirModal = (dadosAgendamento: Partial<Agendamento> = {}) => {
    const isEditMode = !!dadosAgendamento.id_agendamento;

    Swal.fire({
      title: isEditMode ? "Editar Agendamento" : "Novo Agendamento",
      html: `
        <div class="modal grid grid-cols-1 gap-4 text-left p-4">
          <div>
            <label for="campoCliente" class="block font-medium text-gray-700">Paciente:*</label>
            <select id="campoCliente" class="border rounded-md p-2 w-full">
              <option value="">Selecione o paciente</option>
              ${clientes
          .map(
            (c) =>
              `<option value="${c.id_cliente}">${c.nome_completo}</option>`
          )
          .join("")}
            </select>
          </div>
          <div>
            <label for="campoDentista" class="block font-medium text-gray-700">Dentista:*</label>
            <select id="campoDentista" class="border rounded-md p-2 w-full">
              <option value="">Selecione o dentista</option>
              ${dentistas
          .map(
            (d) =>
              `<option value="${d.id_dentista}">${d.nome_completo}</option>`
          )
          .join("")}
            </select>
          </div>
          <div>
            <label for="campoData" class="block font-medium text-gray-700">Data:*</label>
            <input type="date" id="campoData" class="border rounded-md p-2 w-full" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="campoHoraInicio" class="block font-medium text-gray-700">Hora início:*</label>
              <input type="time" id="campoHoraInicio" class="border rounded-md p-2 w-full" />
            </div>
            <div>
              <label for="campoHoraFim" class="block font-medium text-gray-700">Hora fim:*</label>
              <input type="time" id="campoHoraFim" class="border rounded-md p-2 w-full" />
            </div>
          </div>
          <div>
            <label for="campoStatus" class="block font-medium text-gray-700">Status:*</label>
            <select id="campoStatus" class="border rounded-md p-2 w-full">
                <option value="Agendado">Agendado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Realizado">Realizado</option>
                <option value="Cancelado Pelo Paciente">Cancelado Pelo Paciente</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: 'bg-color-primary',
        cancelButton: 'bg-color-secondary'
      },
      didOpen: () => {
        // Preenche os campos se estiver no modo de edição
        if (isEditMode) {
          (document.getElementById("campoCliente") as HTMLSelectElement).value =
            String(dadosAgendamento.id_cliente || "");
          (
            document.getElementById("campoDentista") as HTMLSelectElement
          ).value = String(dadosAgendamento.id_dentista || "");
          (document.getElementById("campoData") as HTMLInputElement).value =
            format(parseISO(dadosAgendamento.data_hora_inicio!), "yyyy-MM-dd");
          (
            document.getElementById("campoHoraInicio") as HTMLInputElement
          ).value = format(
            parseISO(dadosAgendamento.data_hora_inicio!),
            "HH:mm"
          );
          (document.getElementById("campoHoraFim") as HTMLInputElement).value =
            format(parseISO(dadosAgendamento.data_hora_fim!), "HH:mm");
          (document.getElementById("campoStatus") as HTMLSelectElement).value =
            dadosAgendamento.status_agendamento || "Agendado";
        }
      },
      preConfirm: async () => {
        // 6. Lógica de confirmação para enviar os dados corretos para a API
        const id_cliente = (
          document.getElementById("campoCliente") as HTMLSelectElement
        ).value;
        const id_dentista = (
          document.getElementById("campoDentista") as HTMLSelectElement
        ).value;
        const data = (document.getElementById("campoData") as HTMLInputElement)
          .value;
        const hora_inicio = (
          document.getElementById("campoHoraInicio") as HTMLInputElement
        ).value;
        const hora_fim = (
          document.getElementById("campoHoraFim") as HTMLInputElement
        ).value;
        const status_agendamento = (
          document.getElementById("campoStatus") as HTMLSelectElement
        ).value;

        if (!id_cliente || !id_dentista || !data || !hora_inicio || !hora_fim) {
          Swal.showValidationMessage(
            "Por favor, preencha todos os campos obrigatórios."
          );
          return false;
        }

        const payload = {
          id_cliente: parseInt(id_cliente),
          id_dentista: parseInt(id_dentista),
          data_hora_inicio: `${data}T${hora_inicio}:00`,
          data_hora_fim: `${data}T${hora_fim}:00`,
          status_agendamento,
          status_pagamento: "Pendente", // Valor padrão
        };

        try {
          if (isEditMode) {
            // Lógica de ATUALIZAÇÃO (PUT/PATCH)
            await axios.post(
              `${import.meta.env.VITE_URL_SERVER}/agendamentos/${dadosAgendamento.id_agendamento}`,
              payload
            );
          } else {
            // Lógica de CRIAÇÃO (POST)
            await axios.post(`${import.meta.env.VITE_URL_SERVER}/agendamentos`, payload);
          }
          // Recarregar os dados após o sucesso
          // (idealmente, apenas adiciona o novo item ao estado ou atualiza o item existente)
          const response = await axios.get(
            `${import.meta.env.VITE_URL_SERVER}/agendamentos`
          );
          setAgendamentos(response.data || []);
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Erro ao salvar: ${error}`);
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Salvo!", "O agendamento foi salvo com sucesso.", "success");
      }
    });
  };

  if (loading) {
    return <div><Loader /></div>;
  }

  return (
    <div className="consultas-page">
      {/* Cabeçalho */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold color-primary">
            <FontAwesomeIcon icon={faHospitalUser} /> Consultas
          </h1>
          <Button
            text="Novo Agendamento"
            icon={faPlus}
            color="bg-color-primary"
            onClick={() => abrirModal()}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros max-w-7xl mx-auto mt-6 gap-4">
        <input
          type="date"
          value={dataInicioInput}
          onChange={(e) => setDataInicioInput(e.target.value)}
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <input
          type="date"
          value={dataFimInput}
          onChange={(e) => setDataFimInput(e.target.value)}
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <input
          type="text"
          value={pacienteInput}
          onChange={(e) => setPacienteInput(e.target.value)}
          placeholder="Paciente"
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <input
          type="text"
          value={dentistaInput}
          onChange={(e) => setDentistaInput(e.target.value)}
          placeholder="Dentista"
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <Button
          text="Pesquisar"
          icon={faSearch}
          color="bg-color-primary"
          onClick={handlePesquisar}
        />
      </div>

      {/* Tabela */}
      <div className="max-w-7xl mx-auto mt-6 overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 bg-white">
          <thead className="bg-gray-100 bg-color-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => abrirModal(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação */}
      <div className="footer-table flex items-center justify-end mt-4 gap-4">
        <Button
          text="Página anterior"
          icon={faArrowLeft}
          color={
            !table.getCanPreviousPage()
              ? "desabled bg-color-secondary"
              : "bg-color-secondary"
          }
          onClick={() => table.previousPage()}
        />

        <span className="text-sm">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>

        <Button
          text="Próxima página"
          icon={faArrowRight}
          color={
            !table.getCanNextPage()
              ? "desabled bg-color-secondary"
              : "bg-color-secondary"
          }
          onClick={() => table.nextPage()}
        />
      </div>
    </div>
  );
};

export default Consultas;
