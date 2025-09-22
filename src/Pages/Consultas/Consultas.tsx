import "./Consultas.css";
import { useState, useMemo, useEffect } from "react";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Components/Button/Button";
import type { ColumnDef } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { isAfter, isBefore, parseISO } from "date-fns";
import axios from "axios";
import { formatarData } from "../../Helper/FormatarData";

interface Consulta {
  id: number;
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

const abrirModal = (dadosConsulta: Partial<Consulta> = {}) => {

  const modalContent = document.createElement("div");
  var titleModal = "";

  if (dadosConsulta.id > 0) {
    titleModal = "Editar consulta";
  } else {
    titleModal = "Nova consulta";
  };
  modalContent.innerHTML = `
  <div class="modal grid grid-cols-1 gap-4 text-left">
      <!-- Nome do Paciente -->
      <div>
        <label for="campoPaciente" class="block font-medium text-gray-700">Paciente:*</label>
        <select id="campoPaciente" class="border rounded-md p-2 w-full">
          <option value="">Selecione o paciente</option>
        </select>
        <p id="erroPaciente" class="text-error text-sm hidden">Campo obrigatório!</p>
      </div>

      <!-- Nome do Dentista -->
      <div>
        <label for="campoDentista" class="block font-medium text-gray-700">Dentista:*</label>
        <select id="campoDentista" class="border rounded-md p-2 w-full">
          <option value="">Selecione o dentista</option>
        </select>
        <p id="erroDentista" class="text-error text-sm hidden">Campo obrigatório!</p>
      </div>

      <!-- Data da Consulta -->
      <div>
        <label for="campoData" class="block font-medium text-gray-700">Data da consulta:*</label>
        <input type="date" id="campoData" class="border rounded-md p-2 w-full cursor-pointer" />
        <p id="erroData" class="text-error text-sm hidden">Campo obrigatório!</p>
      </div>

      <!-- Hora Início e Hora Fim -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="campoHoraInicio" class="block font-medium text-gray-700">Hora início:*</label>
          <input type="time" id="campoHoraInicio" class="border rounded-md p-2 w-full cursor-pointer" />
          <p id="erroHoraInicio" class="text-error text-sm hidden">Campo obrigatório!</p>
        </div>
        <div>
          <label for="campoHoraFim" class="block font-medium text-gray-700">Hora fim:*</label>
          <input type="time" id="campoHoraFim" class="border rounded-md p-2 w-full cursor-pointer" />
          <p id="erroHoraFim" class="text-error text-sm hidden">Campo obrigatório!</p>
        </div>
      </div>

      <div>
        <label for="campoObervacao" class="block font-medium text-gray-700">Observação:</label>
        <textarea id="campoObervacao" class="swal2-textarea border rounded-md p-1 m-0 w-full"></textarea>
      </div>

      <!-- Status da Consulta -->
      <div>
        <label for="campoStatus" class="block font-medium text-gray-700">Status:*</label>
        <select id="campoStatus" class="border rounded-md p-2 w-full">
          <option value="">Selecione o status</option>
          <option value="agendada">Agendada</option>
          <option value="realizada">Realizada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <p id="erroStatus" class="text-error text-sm hidden">Campo obrigatório!</p>
      </div>
    </div>
    `;

  Swal.fire({
    title: titleModal,
    showCancelButton: true,
    confirmButtonText: "Agendar",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: 'bg-color-primary',
      cancelButton: 'bg-color-secondary'
    },
    html: modalContent,
    didOpen: () => {
      if (dadosConsulta.id > 0) {
        const campoPaciente = document.getElementById("campoPaciente") as HTMLSelectElement;
        const campoDentista = document.getElementById("campoDentista") as HTMLSelectElement;
        const campoData = document.getElementById("campoData") as HTMLInputElement;
        const campoHoraInicio = document.getElementById("campoHoraInicio") as HTMLInputElement;
        const campoHoraFim = document.getElementById("campoHoraFim") as HTMLInputElement;
        // const campoStatus = document.getElementById("campoStatus") as HTMLSelectElement;
        const campoObservacao = document.getElementById("campoObervacao") as HTMLTextAreaElement;

        if (campoPaciente) campoPaciente.value = dadosConsulta.paciente || "";
        if (campoDentista) campoDentista.value = dadosConsulta.medico || "";
        if (campoData) campoData.value = formatarData(dadosConsulta.data) || "";
        if (campoHoraInicio) campoHoraInicio.value = dadosConsulta.hora_inicio?.slice(0, 5) || "";
        if (campoHoraFim) campoHoraFim.value = dadosConsulta.hora_fim?.slice(0, 5) || "";
        // if (campoStatus) campoStatus.value = dadosConsulta.status?.toLowerCase() || "";
        if (campoObservacao) campoObservacao.value = dadosConsulta.observacoes || "";
      }
    },
    preConfirm: async () => {
      const campoPaciente = document.getElementById("campoPaciente") as HTMLSelectElement;
      const campoDentista = document.getElementById("campoDentista") as HTMLSelectElement;
      const campoData = document.getElementById("campoData") as HTMLInputElement;
      const campoHoraInicio = document.getElementById("campoHoraInicio") as HTMLInputElement;
      const campoHoraFim = document.getElementById("campoHoraFim") as HTMLInputElement;
      const campoStatus = document.getElementById("campoStatus") as HTMLSelectElement;

      let valid = true;

      // if (campoPaciente && !campoPaciente.value) {
      //   document.getElementById("erroPaciente")?.classList.remove("hidden");
      //   valid = false;
      // } else {
      //   document.getElementById("erroPaciente")?.classList.add("hidden");
      // }
      // if (campoDentista && !campoDentista.value) {
      //   document.getElementById("erroDentista")?.classList.remove("hidden");
      //   valid = false;
      // }
      // else {
      //   document.getElementById("erroDentista")?.classList.add("hidden");
      // }
      if (campoData && !campoData.value) {
        document.getElementById("erroData")?.classList.remove("hidden");
        valid = false;
      }
      else {
        document.getElementById("erroData")?.classList.add("hidden");
      }
      if (campoHoraInicio && !campoHoraInicio.value) {
        document.getElementById("erroHoraInicio")?.classList.remove("hidden");
        valid = false;
      }
      else {
        document.getElementById("erroHoraInicio")?.classList.add("hidden");
      }
      if (campoHoraFim && !campoHoraFim.value) {
        document.getElementById("erroHoraFim")?.classList.remove("hidden");
        valid = false;
      }
      else {
        document.getElementById("erroHoraFim")?.classList.add("hidden");
      }
      if (campoStatus && !campoStatus.value) {
        document.getElementById("erroStatus")?.classList.remove("hidden");
        valid = false;
      }

      const dados = {
        paciente: "Paciente Teste",
        medico: "Médico Teste",
        data: campoData.value,
        hora_inicio: campoHoraInicio.value,
        hora_fim: campoHoraFim.value
        // status: campoStatus.value,
      };

      const response = await axios.post("http://localhost:8888/consultas", { dados });

      console.log(response);

    }
  });
};

const Consultas = () => {

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
            onClick={abrirModal}
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
                onClick={() => abrirModal(row.original)}
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
    </div>
  );
};

export default Consultas;
