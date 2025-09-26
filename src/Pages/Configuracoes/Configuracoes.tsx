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

    const [nomeInput, setNomeInput] = useState("");

    const [filtros, setFiltros] = useState({
        nome: "",
    });

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

    const usuariosFiltrados = useMemo(() => {
        return atendentes.filter((d) => {
            const matchNome = filtros.nome
                ? d.nome_completo.toLowerCase().includes(filtros.nome.toLowerCase())
                : true;

            return matchNome;
        });
    }, [atendentes, filtros]);

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
                accessorKey: "data_cadastro",
                header: "Data Cadastro",
                cell: (info) =>
                    format(parseISO(info.getValue() as string), "dd/MM/yyyy"),
            },
            {
                accessorKey: "admin",
                header: "Tipo Usuário",
                cell: (info) =>
                    info.getValue() == true ? "Administrativo" : "Operador",
            },
            {
                accessorKey: "ativo",
                header: "Status",
                cell: (info) =>
                    info.getValue() == true ? "Ativo" : "Inativo",
            },
        ],
        []
    );

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: usuariosFiltrados,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handlePesquisar = () => {
        setFiltros({
            nome: nomeInput,
        });
    };

    const abrirModal = (dadosAtendente: Partial<Atendente> = {}) => {
        const isEditMode = !!dadosAtendente.id_atendente;

        Swal.fire({
            title: isEditMode ? "Editar Usuário" : "Novo Usuário",
            html: `
                <div class="modal grid grid-cols-1 gap-4 text-left">
                <div>
                    <label for="nomeUsuario" class="block font-medium text-gray-700">Nome Completo:*</label>
                    <input type="text" id="nomeUsuario" class="border rounded-md p-2 w-full" />
                </div>
                <div class="flex items-center gap-4">
                    <div>
                    <label for="campoCpfUsuario" class="block font-medium text-gray-700">CPF:*</label>
                    <input type="text" id="campoCpfUsuario" class="border rounded-md p-2 w-full" />
                    </div>
                    <div class="input-data">
                    <label for="dataNascimentoUsuario" class="block font-medium text-gray-700">Data Nascimento:*</label>
                    <input type="date" id="dataNascimentoUsuario" class="border rounded-md p-2 w-full" />
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div>
                    <label for="campoTelefoneUsuario" class="block font-medium text-gray-700">Telefone:*</label>
                    <input type="number" id="campoTelefoneUsuario" class="border rounded-md p-2 w-full" />
                    </div>
                    <div class="input-data">
                    <label for="dataCadastroUsuario" class="block font-medium text-gray-700">Data Cadastro:*</label>
                    <input type="date" id="dataCadastroUsuario" class="border rounded-md p-2 w-full" disabled />
                    </div>
                </div>
                <div>
                    <label for="campoEmailUsuario" class="block font-medium text-gray-700">Email:*:</label>
                    <input type="email" id="campoEmailUsuario" class="border rounded-md p-2 w-full" />
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
                    (document.getElementById("nomeUsuario") as HTMLSelectElement).value =
                        String(dadosAtendente.nome_completo || "");
                    (document.getElementById("campoCpfUsuario") as HTMLSelectElement).value =
                        String(dadosAtendente.cpf || "");
                    (
                        document.getElementById(
                            "campoTelefoneUsuario"
                        ) as HTMLSelectElement
                    ).value = dadosAtendente.telefone || "";
                    (
                        document.getElementById(
                            "campoEmailUsuario"
                        ) as HTMLSelectElement
                    ).value = dadosAtendente.email_login || "";
                    (
                        document.getElementById(
                            "dataNascimentoUsuario"
                        ) as HTMLInputElement
                    ).value = format(
                        parseISO(dadosAtendente.data_nascimento!),
                        "yyyy-MM-dd"
                    );
                    (
                        document.getElementById("dataCadastroUsuario") as HTMLInputElement
                    ).value = format(
                        parseISO(dadosAtendente.data_cadastro!),
                        "yyyy-MM-dd"
                    );
                }
            },
            preConfirm: async () => {
                // 6. Lógica de confirmação para enviar os dados corretos para a API
                const nome_completo = (
                    document.getElementById("nomeUsuario") as HTMLSelectElement
                ).value;
                const cpf = (document.getElementById("campoCpfUsuario") as HTMLSelectElement)
                    .value;
                const telefone = (
                    document.getElementById("campoTelefoneUsuario") as HTMLInputElement
                ).value;
                const email = (
                    document.getElementById("campoEmailUsuario") as HTMLInputElement
                ).value;
                const data_nascimento = (
                    document.getElementById("dataNascimentoUsuario") as HTMLInputElement
                ).value;
                const data_cadastro = (
                    document.getElementById("dataCadastroUsuario") as HTMLSelectElement
                ).value;

                if (
                    !nome_completo ||
                    !cpf ||
                    !data_nascimento ||
                    !telefone ||
                    !email
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
                    telefone,
                    email,
                    data_nascimento,
                    data_cadastro,
                };

                try {
                    if (isEditMode) {
                        // Lógica de ATUALIZAÇÃO (PUT/PATCH)
                        await api.post(`/atendentes/${dadosAtendente.id_atendente}`, payload);
                    } else {
                        // Lógica de CRIAÇÃO (POST)
                        await api.post(`/atendentes`, payload);
                    }
                    const response = await api.get(`/atendentes`);
                    setAtendentes(response.data || []);
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
                    placeholder="Nome usuário"
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
    )
}

export default Configuracoes
