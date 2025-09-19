// import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
// import ScrollToTop from "./Helper/ScrollToTop"
// import { Suspense, lazy } from "react"
import { lazy } from "react";

const Login = lazy(() => import("./Components/Login/Login"));

// import Loader from "./Components/Loader/Loader";

// function DefaultLayout() {
//   return (
//     <>
//       <Login />

//     </>
//   );
// }

// function DetalhesLayout() {
//   return (
//     <>
//       <Login />
//     </>
//   );
// }

function App() {
  return (
    <Login />
  );
}

export default App;
