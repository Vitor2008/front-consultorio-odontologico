import React, { useState, useMemo, useEffect } from "react";
import "../Consultas/Consultas.css";
import api from "../../api/api";
import type { Dentistas } from "../../models/Dentistas";
import Loader from "../../Components/Loader/Loader";
import {
  faPlus,
  faSearch,
  faUserNurse,
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

const ListaDentistas: React.FC = () => {
  const [dentistas, setDentistas] = useState<Dentistas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDentistas = async () => {
      try {
        setDentistas((await api.get<Dentistas[]>(`/dentistas`)).data);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
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

    fetchDentistas();
  }, []);

  const columns = useMemo<ColumnDef<Dentistas>[]>(
    () => [
      {
        accessorKey: "nome_completo",
        header: "Nome",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "cro",
        header: "CRO",
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
    data: dentistas,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const abrirModal = (dadosDentista: Partial<Dentistas> = {}) => {
    const isEditMode = !!dadosDentista.id_dentista;

    Swal.fire({
      title: isEditMode ? "Editar Dentista" : "Novo Dentista",
      html: `
        <div class="modal grid grid-cols-1 gap-4 text-left">
          <div>
            <label for="nomeDentista" class="block font-medium text-gray-700">Nome Completo:*</label>
            <input type="text" id="nomeDentista" class="border rounded-md p-2 w-full" />
          </div>
          <div class="flex items-center gap-4">
            <div>
              <label for="campoCro" class="block font-medium text-gray-700">CRO:*</label>
              <input type="text" id="campoCro" class="border rounded-md p-2 w-full" />
            </div>
            <div class="input-data">
              <label for="dataNascimentoDentista" class="block font-medium text-gray-700">Data Nascimento:*</label>
              <input type="date" id="dataNascimentoDentista" class="border rounded-md p-2 w-full" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div>
              <label for="campoTelefoneDentista" class="block font-medium text-gray-700">Telefone:*</label>
              <input type="number" id="campoTelefoneDentista" class="border rounded-md p-2 w-full" />
            </div>
            <div class="input-data">
              <label for="dataCadastroDentista" class="block font-medium text-gray-700">Data Cadastro:*</label>
              <input type="date" id="dataCadastroDentista" class="border rounded-md p-2 w-full" disabled />
            </div>
          </div>
          <div>
            <label for="campoEnderecoDentista" class="block font-medium text-gray-700">Endereço:*:</label>
            <textarea id="campoEnderecoDentista" class="border w-full" row="3"></textarea>
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
          (document.getElementById("nomeDentista") as HTMLSelectElement).value =
            String(dadosDentista.nome_completo || "");
          (document.getElementById("campoCro") as HTMLSelectElement).value =
            String(dadosDentista.cro || "");
          (
            document.getElementById(
              "campoTelefoneDentista"
            ) as HTMLSelectElement
          ).value = dadosDentista.telefone || "";
          (
            document.getElementById(
              "campoEnderecoDentista"
            ) as HTMLSelectElement
          ).value = dadosDentista.endereco || "";
          (
            document.getElementById(
              "dataNascimentoDentista"
            ) as HTMLInputElement
          ).value = format(
            parseISO(dadosDentista.data_nascimento!),
            "yyyy-MM-dd"
          );
          (
            document.getElementById("dataCadastroDentista") as HTMLInputElement
          ).value = format(
            parseISO(dadosDentista.data_cadastro!),
            "yyyy-MM-dd"
          );
        }
      },
      preConfirm: async () => {
        // 6. Lógica de confirmação para enviar os dados corretos para a API
        const nome_completo = (
          document.getElementById("nomeDentista") as HTMLSelectElement
        ).value;
        const cro = (document.getElementById("campoCro") as HTMLSelectElement)
          .value;
        const data_nascimento = (
          document.getElementById("dataNascimentoDentista") as HTMLInputElement
        ).value;
        const telefone = (
          document.getElementById("campoTelefoneDentista") as HTMLInputElement
        ).value;
        const data_cadastro = (
          document.getElementById("dataCadastroDentista") as HTMLInputElement
        ).value;
        const endereco = (
          document.getElementById("campoEnderecoDentista") as HTMLSelectElement
        ).value;

        if (
          !nome_completo ||
          !cro ||
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
          cro,
          telefone,
          endereco,
          data_nascimento,
          data_cadastro,
        };

        try {
          if (isEditMode) {
            // Lógica de ATUALIZAÇÃO (PUT/PATCH)
            await api.post(`/dentistas/${dadosDentista.id_dentista}`, payload);
          } else {
            // Lógica de CRIAÇÃO (POST)
            await api.post(`/dentistas`, payload);
          }
          const response = await api.get(`/dentistas`);
          setDentistas(response.data || []);
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
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="dentista-page">
      {/* Cabeçalho */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold color-primary">
            <FontAwesomeIcon icon={faUserNurse} /> Dentistas
          </h1>
          <Button
            text="Novo Dentista"
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
          // value={pacienteInput}
          // onChange={(e) => setPacienteInput(e.target.value)}
          placeholder="Nome do Dentista"
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <input
          type="number"
          // value={dentistaInput}
          // onChange={(e) => setDentistaInput(e.target.value)}
          placeholder="Cpf do Dentista"
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <Button
          text="Pesquisar"
          icon={faSearch}
          color="bg-color-primary"
          // onClick={handlePesquisar}
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

export default ListaDentistas;
