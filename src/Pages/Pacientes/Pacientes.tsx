import "./Pacientes.css";
import type { Cliente } from "../../models/Cliente";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader/Loader";

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
