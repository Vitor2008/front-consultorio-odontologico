import "../Consultas/Consultas.css";
import type { Cliente } from "../../models/Cliente";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader/Loader";
import {
  faPlus,
  faSearch,
  faHospitalUser,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Components/Button/Button";

const Pacientes = () => {
  const [paciente, setPaciente] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setPaciente(
          (await axios.get<Cliente[]>("http://localhost:8888/clientes")).data
        );
      } catch (err) {
        setError("Não foi possível carregar a lista de dentistas.");
        console.error("Erro ao buscar dentistas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
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
          placeholder="Nome do Paciente"
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <input
          type="number"
          // value={dentistaInput}
          // onChange={(e) => setDentistaInput(e.target.value)}
          placeholder="Cpf do Paciente"
          className="border px-3 py-2 rounded input-filtro bg-white"
        />
        <Button
          text="Pesquisar"
          icon={faSearch}
          color="bg-color-primary"
          // onClick={handlePesquisar}
        />
      </div>

      <h2>Dentistas Cadastrados</h2>
      {paciente.length === 0 ? (
        <p>Nenhum dentista encontrado.</p>
      ) : (
        <ul className="p-4">
          {paciente.map((paciente) => (
            <li
              key={paciente.id_cliente}
              className="border-2 border-amber-50 p-8 mb-4"
            >
              <strong>{paciente.nome_completo}</strong>
              <p>data_cadastro: {paciente.data_cadastro}</p>
              <p>Telefone: {paciente.telefone}</p>
              <p>endereco: {paciente.endereco}</p>
              <p>data_nascimento: {paciente.data_nascimento}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Pacientes;
