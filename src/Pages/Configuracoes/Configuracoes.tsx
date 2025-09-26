import React, { useState, useMemo, useEffect } from "react";
import "../Consultas/Consultas.css";
import './Configuracoes.css'
import api from "../../api/api";
import type { Atendente } from "../../models/Atendente";
import {
    faPlus,
    faGear,
    faSearch,
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
import Loader from "../../Components/Loader/Loader";


const Configuracoes: React.FC = () => {

    const [atendentes, setAtendentes] = useState<Atendente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAtendentes = async () => {
            try {
                setAtendentes((await api.get<Atendente[]>(`/atendentes`)).data);
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

        fetchAtendentes();
    }, []);

    const columns = useMemo<ColumnDef<Atendente>[]>(
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
                accessorKey: "email_login",
                header: "Email",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "data_nascimento",
                header: "Data Nascimento",
                cell: (info) =>
                    format(parseISO(info.getValue() as string), "dd/MM/yyyy"),
            },
            {
                accessorKey: "telefone",
                header: "Telefone",
                cell: (info) => info.getValue(),
            },
        ],
        []
    );

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: atendentes,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (loading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    return (
        <div className="configuracoes-page">
            {/* Cabeçalho */}
            <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-semibold color-primary">
                        <FontAwesomeIcon icon={faGear} /> Configurações
                    </h1>
                    <Button
                        text="Novo Usuário"
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
                    placeholder="Nome usuário"
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
    )
}

export default Configuracoes
