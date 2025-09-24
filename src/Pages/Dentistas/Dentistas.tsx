import React, { useState, useMemo, useEffect } from "react";
import '../Consultas/Consultas.css'
import axios from "axios";
import type { Dentistas } from "../../models/Dentistas";
import Loader from "../../Components/Loader/Loader";
import {
  faPlus,
  faSearch,
  faUserNurse,
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
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";

const ListaDentistas: React.FC = () => {
  const [dentistas, setDentistas] = useState<Dentistas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDentistas = async () => {
      try {
        setDentistas(
          (await axios.get<Dentistas[]>(`${import.meta.env.VITE_URL_SERVER}/dentistas`)).data
        );
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

  if (loading) {
    return <div><Loader /></div>;
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
          // onClick={() => abrirModal()}
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
              // aqui você pode abrir modal com detalhes
              // onClick={() => abrirModal(row.original)}
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

export default ListaDentistas;
