import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./Pages/Layout/Layout";
import Consultas from "./Pages/Consultas/Consultas";
import Pacientes from "./Pages/Pacientes/Pacientes";
import Medicos from "./Pages/Dentistas/Dentistas";
import Financeiro from "./Pages/Financeiro/Financeiro";
import Configuracoes from "./Pages/Configuracoes/Configuracoes";
import Loader from "./Components/Loader/Loader";

const Login = lazy(() => import("./Pages/Login/Login"));

function App() {
  return (
    <Suspense fallback={<div><Loader/></div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/consultas"
          element={
            <Layout>
              <Consultas />
            </Layout>
          }
        />
        <Route
          path="/pacientes"
          element={
            <Layout>
              <Pacientes />
            </Layout>
          }
        />
        <Route
          path="/medicos"
          element={
            <Layout>
              <Medicos />
            </Layout>
          }
        />
        <Route
          path="/financeiro"
          element={
            <Layout>
              <Financeiro />
            </Layout>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <Layout>
              <Configuracoes />
            </Layout>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
