import "../Consultas/Consultas.css";
import './Financeiro.css'
import { faDollarSign, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Components/Button/Button";
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


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dadosGrafico = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    datasets: [
        {
            label: 'Faturamento',
            data: [1200, 1900, 800, 1500, 2200],
            backgroundColor: '#04B4EA'
        }
    ]
};

const opcoesGrafico = {
    responsive: true,
    plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'Faturamento' }
    }
};

const Financeiro = () => {

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
                            <span className="color-primary font-bold">R$ 540,00</span>
                        </div>
                    </div>
                    <div className="card flex gap-2 bg-white px-2 py-3 shadow justify-start items-center">
                        <div className="icon">
                            <FontAwesomeIcon icon={faFilter} />
                        </div>
                        <div className="info-resumo flex flex-col">
                            <span className="font-bold">Nº Agendamentos</span>
                            <span className="color-primary font-bold">20</span>
                        </div>
                    </div>
                    <div className="card flex gap-2 bg-white px-2 py-3 shadow justify-start items-center">
                        <div className="icon">
                            <FontAwesomeIcon icon={faFilter} />
                        </div>
                        <div className="info-resumo flex flex-col">
                            <span className="font-bold">Ticket Médio:</span>
                            <span className="color-primary font-bold">R$ 40,00</span>
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
