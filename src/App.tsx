import { Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./Pages/Layout/Layout";
import Loader from "./Components/Loader/Loader";

const Login = lazy(() => import("./Pages/Login/Login"));
const Consultas = lazy(() => import("./Pages/Consultas/Consultas"));
const Pacientes = lazy(() => import("./Pages/Pacientes/Pacientes"));
const Medicos = lazy(() => import("./Pages/Dentistas/Dentistas"));
const Financeiro = lazy(() => import("./Pages/Financeiro/Financeiro"));
const Configuracoes = lazy(() => import("./Pages/Configuracoes/Configuracoes"));

const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
