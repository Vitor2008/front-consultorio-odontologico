import React, { useState, useMemo, useEffect } from "react";
import "../Consultas/Consultas.css";
import "./Pacientes.css";
import type { Cliente } from "../../models/Cliente";
import api from "../../api/api";
import Loader from "../../Components/Loader/Loader";
import {
  faPlus,
  faSearch,
  faHospitalUser,
  faArrowLeft,
  faArrowRight,
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
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";

const Pacientes: React.FC = () => {
  const [pacientes, setPaciente] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [nomeInput, setNomeInput] = useState("");
  const [cpfInput, setCpfInput] = useState("");

  const [filtros, setFiltros] = useState({
    nome: "",
    cpf: "",
  });

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setPaciente((await api.get<Cliente[]>(`/clientes`)).data);
      } catch (error) {
        console.error("Erro ao buscar dentistas:", error);
        Swal.fire({
          title: "Erro",
          text: "Não foi possível carregar os dados da página.",
          customClass: {
            confirmButton: "bg-color-primary",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, []);

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((d) => {
      const matchNome = filtros.nome
        ? d.nome_completo.toLowerCase().includes(filtros.nome.toLowerCase())
        : true;

      const matchCro = filtros.cpf
        ? d.cpf.toLowerCase().includes(filtros.cpf.toLowerCase())
        : true;

      return matchNome && matchCro;
    });
  }, [pacientes, filtros]);

  const columns = useMemo<ColumnDef<Cliente>[]>(
    () => [
      {
        accessorKey: "nome_completo",
        header: "Nome",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "cpf",
        header: "CPF",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "telefone",
        header: "Telefone",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "data_cadastro",
        header: "Data Cadastro",
        cell: (info) =>
          format(parseISO(info.getValue() as string), "dd/MM/yyyy"),
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: pacientesFiltrados,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePesquisar = () => {
    setFiltros({
      nome: nomeInput,
      cpf: cpfInput,
    });
  };

  const abrirModal = (dadosCliente: Partial<Cliente> = {}) => {
    const isEditMode = !!dadosCliente.id_cliente;

    Swal.fire({
      title: isEditMode ? "Editar Cliente" : "Novo Cliente",
      html: `
        <div class="modal grid grid-cols-1 gap-4 text-left">
          <div>
            <label for="nomeCliente" class="block font-medium text-gray-700">Nome Completo:*</label>
            <input type="text" id="nomeCliente" class="border rounded-md p-2 w-full" />
          </div>
          <div class="flex items-center gap-4">
            <div>
              <label for="campoCpf" class="block font-medium text-gray-700">CPF:*</label>
              <input type="text" id="campoCpf" class="border rounded-md p-2 w-full" />
            </div>
            <div class="input-data">
              <label for="dataNascimento" class="block font-medium text-gray-700">Data Nascimento:*</label>
              <input type="date" id="dataNascimento" class="border rounded-md p-2 w-full" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div>
              <label for="campoTelefone" class="block font-medium text-gray-700">Telefone:*</label>
              <input type="number" id="campoTelefone" class="border rounded-md p-2 w-full" />
            </div>
            <div class="input-data">
              <label for="dataCadastro" class="block font-medium text-gray-700">Data Cadastro:*</label>
              <input type="date" id="dataCadastro" class="border rounded-md p-2 w-full" disabled />
            </div>
          </div>
          <div>
            <label for="campoEndereco" class="block font-medium text-gray-700">Endereço:*:</label>
            <textarea id="campoEndereco" class="border w-full" row="3"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "bg-color-primary",
        cancelButton: "bg-color-secondary",
      },
      didOpen: () => {
        // Preenche os campos se estiver no modo de edição
        if (isEditMode) {
          (document.getElementById("nomeCliente") as HTMLSelectElement).value =
            String(dadosCliente.nome_completo || "");
          (document.getElementById("campoCpf") as HTMLSelectElement).value =
            String(dadosCliente.cpf || "");
          (
            document.getElementById("dataNascimento") as HTMLInputElement
          ).value = format(
            parseISO(dadosCliente.data_nascimento!),
            "yyyy-MM-dd"
          );
          (
            document.getElementById("campoTelefone") as HTMLSelectElement
          ).value = dadosCliente.telefone || "";
          (document.getElementById("dataCadastro") as HTMLInputElement).value =
            format(parseISO(dadosCliente.data_cadastro!), "yyyy-MM-dd");
          (
            document.getElementById("campoEndereco") as HTMLSelectElement
          ).value = dadosCliente.endereco || "";
        }
      },
      preConfirm: async () => {
        // 6. Lógica de confirmação para enviar os dados corretos para a API
        const nome_completo = (
          document.getElementById("nomeCliente") as HTMLSelectElement
        ).value;
        const cpf = (document.getElementById("campoCpf") as HTMLSelectElement)
          .value;
        const data_nascimento = (
          document.getElementById("dataNascimento") as HTMLInputElement
        ).value;
        const telefone = (
          document.getElementById("campoTelefone") as HTMLInputElement
        ).value;
        const data_cadastro = (
          document.getElementById("dataCadastro") as HTMLInputElement
        ).value;
        const endereco = (
          document.getElementById("campoEndereco") as HTMLSelectElement
        ).value;

        if (
          !nome_completo ||
          !cpf ||
          !data_nascimento ||
          !telefone ||
          !endereco
        ) {
          Swal.fire({
            title: "Erro",
            text: "Por favor, preencha todos os campos obrigatórios.",
            customClass: {
              confirmButton: "bg-color-primary",
            },
          });
          return false;
        }

        const payload = {
          nome_completo,
          cpf,
          data_nascimento,
          telefone,
          data_cadastro,
          endereco,
        };

        try {
          if (isEditMode) {
            // Lógica de ATUALIZAÇÃO (PUT/PATCH)
            await api.post(`/clientes/${dadosCliente.id_cliente}`, payload);
          } else {
            // Lógica de CRIAÇÃO (POST)
            await api.post(`/clientes`, payload);
          }
          // Recarregar os dados após o sucesso
          // (idealmente, apenas adiciona o novo item ao estado ou atualiza o item existente)
          const response = await api.get(`/clientes`);
          setPaciente(response.data || []);
          return true;
        } catch (error) {
          Swal.fire({
            title: "Erro",
            text: `Erro ao salvar: ${error}`,
            customClass: {
              confirmButton: "bg-color-primary",
            },
          });
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Salvo!",
          text: "O cliente foi salvo com sucesso.",
          customClass: {
            confirmButton: "bg-color-primary",
          },
        });
      }
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pacientes-page">
      {/* Cabeçalho */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold color-primary">
            <FontAwesomeIcon icon={faHospitalUser} /> Pacientes
          </h1>
          <Button
            text="Novo Paciente"
            icon={faPlus}
            color="bg-color-primary"
            onClick={() => abrirModal()}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros max-w-7xl mx-auto mt-6 gap-4">
        <input
          type="text"
          value={nomeInput}
          onChange={(e) => setNomeInput(e.target.value)}
          placeholder="Nome do Paciente"
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <input
          type="number"
          value={cpfInput}
          onChange={(e) => setCpfInput(e.target.value)}
          placeholder="Cpf do Paciente"
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
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
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

export default Pacientes;
