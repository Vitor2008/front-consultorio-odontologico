import React, { useState, useEffect } from "react";
import axios from "axios";
import type { Dentistas } from "../../models/Dentistas"; // Ajuste o caminho se necessário

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
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
