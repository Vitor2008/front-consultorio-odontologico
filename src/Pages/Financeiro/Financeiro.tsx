import React, { useState, useEffect } from "react";
import "../Consultas/Consultas.css";
import './Financeiro.css'
import { faDollarSign, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Components/Button/Button";
import Loader from "../../Components/Loader/Loader";
import api from "../../api/api";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Swal from "sweetalert2";
import type { Agendamentos } from "../../models/Agendamento";

const Financeiro: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [dadosRelatorio, setDadosRelatorio] = useState<Agendamentos[]>([]);

    useEffect(() => {
        const fetchRelatorio = async () => {
            try {
                const response = await api.get<Agendamentos[]>("/agendamentos");
                setDadosRelatorio(response.data);
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

        fetchRelatorio();
    }, []);

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    const listaStatusAgendamento = dadosRelatorio.map(agendamento => agendamento.status_agendamento);
    const listaValorAgendamento = dadosRelatorio.map(agendamento => agendamento.valor_consulta);


    const coresPorStatus: Record<string, string> = {
        "Agendado": "oklch(79.5% 0.184 86.047)",
        "Confirmado": "oklch(48.8% 0.243 264.376)",
        "Cancelado Pelo Paciente": "oklch(57.7% 0.245 27.325)",
        "Realizado": "oklch(44.8% 0.119 151.328)"
    };

    const listaCores = listaStatusAgendamento.map(status => coresPorStatus[status] || "#999999");

    const dadosGrafico = {
        labels: listaStatusAgendamento,
        datasets: [
            {
                label: 'Valor Consulta',
                data: listaValorAgendamento,
                backgroundColor: listaCores
            },
        ]
    };

    const opcoesGrafico = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Consultas' }
        }
    };


    // const totalRecebido = dadosRelatorio
    //     .filter(a => a.status_pagamento === "Pendente" && a.valor_consulta)
    //     .reduce((acc, curr) => {
    //         const valor = typeof curr.valor_consulta === "string"
    //             ? parseFloat(curr.valor_consulta.replace(",", "."))
    //             : curr.valor_consulta ?? 0;
    //         return acc + valor;
    //     }, 0);

    const totalRecebido = dadosRelatorio
        .reduce((acc, curr) => {
            const valor = typeof curr.valor_consulta === "string"
                ? parseFloat(curr.valor_consulta.replace(",", "."))
                : curr.valor_consulta ?? 0;
            return acc + valor;
        }, 0);

    const numeroAgendamentos = dadosRelatorio.length;
    const ticketMedio = numeroAgendamentos > 0 ? (totalRecebido / numeroAgendamentos) : 0;

    if (loading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    return (
        <div className="financeiro-page">
            {/* Cabeçalho */}
            <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-semibold color-primary">
                        <FontAwesomeIcon icon={faDollarSign} /> Financeiro
                    </h1>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex max-w-7xl mx-auto mt-6 gap-4 pb-4">
                <input
                    type="date"
                    // value={dataInicioInput}
                    // onChange={(e) => setDataInicioInput(e.target.value)}
                    className="border px-3 py-2 rounded input-filtro bg-white"
                />
                <input
                    type="date"
                    // value={dataFimInput}
                    // onChange={(e) => setDataFimInput(e.target.value)}
                    className="border px-3 py-2 rounded input-filtro bg-white"
                />
                <Button
                    text="Filtrar"
                    icon={faFilter}
                    color="bg-color-primary"
                //   onClick={handlePesquisar}
                />
            </div>

            <div className="relatorio flex mt-4 gap-4">
                <div className="card-resumo flex flex-col gap-4">
                    <div className="card flex gap-2 bg-white px-2 py-3 shadow justify-start items-center">
                        <div className="icon">
                            <FontAwesomeIcon icon={faFilter} />
                        </div>
                        <div className="info-resumo flex flex-col">
                            <span className="font-bold">Total:</span>
                            <span className="color-primary font-bold">R$ {totalRecebido.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="card flex gap-2 bg-white px-2 py-3 shadow justify-start items-center">
                        <div className="icon">
                            <FontAwesomeIcon icon={faFilter} />
                        </div>
                        <div className="info-resumo flex flex-col">
                            <span className="font-bold">Nº Agendamentos</span>
                            <span className="color-primary font-bold">{numeroAgendamentos}</span>
                        </div>
                    </div>
                    <div className="card flex gap-2 bg-white px-2 py-3 shadow justify-start items-center">
                        <div className="icon">
                            <FontAwesomeIcon icon={faFilter} />
                        </div>
                        <div className="info-resumo flex flex-col">
                            <span className="font-bold">Ticket Médio:</span>
                            <span className="color-primary font-bold">R$ {ticketMedio.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="grafico">
                    <div className="card bg-white px-3">
                        <Bar data={dadosGrafico} options={opcoesGrafico} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Financeiro
