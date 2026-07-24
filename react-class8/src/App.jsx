import { useState, useMemo } from "react";
import { AppConUseMemo } from "./pages/conUseMemo";
import { AppSinUseMemo } from "./pages/sinUseMemo";
import "./App.css";
// import { Dashboard } from "./exercises/exercise1";
// import { Dashboard2 } from "./exercises/exercise2";
import { Buscador } from "./exercises/exercise4";

// PARA PROBAR LAS DIFERENCIAS

// function App() {
//   return (
//     <>
//       <AppSinUseMemo></AppSinUseMemo>
//       <AppConUseMemo></AppConUseMemo>
//     </>
//   );
// }

//export default App;

// PARA PROBAR LOS EJERCICIOS

// function App() {
//   return (
//     <>
//       <Buscador></Buscador>
//     </>
//   );
// }

// export default App;

// PARA PROBAR LOS PRACTICA

import { Routes, Route } from "react-router-dom";
import { MyPosts } from "./pages/MyPosts";
import { Login } from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MyPosts />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
