import "../Consultas/Consultas.css";
import './Financeiro.css'
import { faDollarSign, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Components/Button/Button";

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
            <div className="flex max-w-7xl mx-auto mt-6 gap-4">
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

            <div className="card-resumo">
                <div className="card flex gap-2 bg-white px-4 py-4 shadow justify-center items-center">
                    <div className="icon">
                        <FontAwesomeIcon icon={faFilter} />
                    </div>
                    <div className="info-resumo flex flex-col">
                        <span>Total</span>
                        <span>R$ 540,00</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Financeiro
