import "./Consultas.css";
import { useState, useMemo, useEffect } from "react";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Components/Button/Button";
import type { ColumnDef } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Modal from "react-modal";
import { format } from "date-fns";
import { isAfter, isBefore, parseISO } from "date-fns";
import axios from "axios";

interface Consulta {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  paciente: string;
  medico: string;
  observacoes?: string;
}

const columns: ColumnDef<Consulta>[] = [
  {
    accessorKey: "data",
    header: "Data",
    cell: (info) => format(parseISO(info.getValue() as string), "dd/MM/yyyy"),
  },
  { accessorKey: "hora_inicio", header: "Início" },
  { accessorKey: "hora_fim", header: "Término" },
  { accessorKey: "paciente", header: "Paciente" },
  { accessorKey: "medico", header: "Médico" },
  { accessorKey: "acoes", header: "Ações" },
];

const Consultas = () => {
  const [modalDetalhes, setModalDetalhes] = useState<Consulta | null>(null);
  const [modalNovo, setModalNovo] = useState(false);

  const [dataInicioInput, setDataInicioInput] = useState("");
  const [dataFimInput, setDataFimInput] = useState("");
  const [pacienteInput, setPacienteInput] = useState("");
  const [medicoInput, setMedicoInput] = useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [filtroMedico, setFiltroMedico] = useState("");
  const [consultas, setConsultas] = useState<Consulta[]>([]); // Estado para guardar as consultas

  useEffect(() => {
    const buscarConsultas = async () => {
      try {
        const response = await axios.get("http://localhost:8888/consultas");
        setConsultas(response.data.data || []);
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
      }
    };

    buscarConsultas();
  }, []);

  const consultasFiltradas = useMemo(() => {
    return consultas.filter((consulta) => {
      const dataConsulta = parseISO(consulta.data);

      const dentroDoIntervalo =
        (!dataInicio || isAfter(dataConsulta, parseISO(dataInicio))) &&
        (!dataFim || isBefore(dataConsulta, parseISO(dataFim)));

      const pacienteMatch = consulta.paciente
        .toLowerCase()
        .includes(filtroPaciente.toLowerCase());
      const medicoMatch = consulta.medico
        .toLowerCase()
        .includes(filtroMedico.toLowerCase());

      return dentroDoIntervalo && pacienteMatch && medicoMatch;
    });
  }, [consultas, dataInicio, dataFim, filtroPaciente, filtroMedico]);

  //   const hoje = new Date();
  //   const consultasHoje = mockConsultas.filter(consulta =>
  //     isSameDay(parseISO(consulta.data), hoje)
  //   )

  //   const table = useReactTable({
  //     data: consultasHoje,
  //     columns,
  //     getCoreRowModel: getCoreRowModel()
  //   })

  const table = useReactTable({
    data: consultasFiltradas,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="consultas-page">
      {/* Cabeçalho */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-dental-blue">Consultas</h1>
          <Button
            text="Novo Agendamento"
            icon={faPlus}
            color="bg-color-primary"
            onClick={() => setModalNovo(true)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="date"
          value={dataInicioInput}
          onChange={(e) => setDataInicioInput(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={dataFimInput}
          onChange={(e) => setDataFimInput(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          value={pacienteInput}
          onChange={(e) => setPacienteInput(e.target.value)}
          placeholder="Paciente"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          value={medicoInput}
          onChange={(e) => setMedicoInput(e.target.value)}
          placeholder="Médico"
          className="border px-3 py-2 rounded"
        />
        <Button
          text="Pesquisar"
          icon={faSearch}
          color="bg-color-primary"
          onClick={() => {
            setDataInicio(dataInicioInput);
            setDataFim(dataFimInput);
            setFiltroPaciente(pacienteInput);
            setFiltroMedico(medicoInput);
          }}
        />
      </div>

      {/* Tabela */}
      <div className="max-w-7xl mx-auto mt-6 overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 bg-color-secondary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setModalDetalhes(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm text-gray-800">
                    {cell.getValue() as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={!!modalDetalhes}
        onRequestClose={() => setModalDetalhes(null)}
        className="modal"
        overlayClassName="overlay"
      >
        {modalDetalhes && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Detalhes da Consulta</h2>
            <p>
              <strong>Data:</strong>{" "}
              {format(new Date(modalDetalhes.data), "dd/MM/yyyy")}
            </p>
            <p>
              <strong>Horário:</strong> {modalDetalhes.hora_inicio} -{" "}
              {modalDetalhes.hora_fim}
            </p>
            <p>
              <strong>Paciente:</strong> {modalDetalhes.paciente}
            </p>
            <p>
              <strong>Médico:</strong> {modalDetalhes.medico}
            </p>
            <p>
              <strong>Observações:</strong> {modalDetalhes.observacoes || "—"}
            </p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setModalDetalhes(null)}
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      {/* Modal de Novo Agendamento */}
      <Modal
        isOpen={modalNovo}
        onRequestClose={() => setModalNovo(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Novo Agendamento</h2>
          {/* Aqui você pode integrar com React Hook Form */}
          <form className="space-y-4">
            <input type="date" className="w-full border px-3 py-2 rounded" />
            <input
              type="time"
              className="w-full border px-3 py-2 rounded"
              placeholder="Hora Início"
            />
            <input
              type="time"
              className="w-full border px-3 py-2 rounded"
              placeholder="Hora Fim"
            />
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="Paciente"
            />
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="Médico"
            />
            <textarea
              className="w-full border px-3 py-2 rounded"
              placeholder="Observações"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setModalNovo(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Consultas;
