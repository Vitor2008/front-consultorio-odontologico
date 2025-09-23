import React, { useState, useEffect } from "react";
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

const ListaDentistas: React.FC = () => {
  const [dentistas, setDentistas] = useState<Dentistas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDentistas = async () => {
      try {
        setDentistas(
          (await axios.get<Dentistas[]>("http://localhost:8888/dentistas")).data
        );
      } catch (err) {
        setError("Não foi possível carregar a lista de dentistas.");
        console.error("Erro ao buscar dentistas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDentistas();
  }, []);

  if (loading) {
    return <div><Loader /></div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
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

      <h2>Dentistas Cadastrados</h2>
      {dentistas.length === 0 ? (
        <p>Nenhum dentista encontrado.</p>
      ) : (
        <ul className="p-4">
          {dentistas.map((dentista) => (
            <li
              key={dentista.id_dentista}
              className="border-2 border-amber-50 p-8 mb-4"
            >
              <strong>{dentista.nome_completo}</strong>
              <p>CRO: {dentista.cro}</p>
              <p>Telefone: {dentista.telefone}</p>
              <p>endereco: {dentista.endereco}</p>
              <p>data_nascimento: {dentista.data_nascimento}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaDentistas;
