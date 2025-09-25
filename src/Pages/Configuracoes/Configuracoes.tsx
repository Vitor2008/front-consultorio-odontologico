import "../Consultas/Consultas.css";
import './Configuracoes.css'
import {
    faPlus,
    faGear,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Components/Button/Button";


const Configuracoes = () => {

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
        </div>
    )
}

export default Configuracoes
