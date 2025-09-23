import "../Consultas/Consultas.css";
import './Financeiro.css'
import {
    faPlus,
    faSearch,
    faDollarSign
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        </div>
    )
}

export default Financeiro
