// // PARA PROBAR CREATECONTEXT Y USECONTEXT

//import { Navbar, FormularioLogin } from "./learning/CreateContext.jsx";
// import {
//   Layout,
//   Navbar,
//   Seccion,
//   Panel,
//   Login,
// } from "./learning/UseContext.jsx";

//import { useReducer } from "react";

// function App() {
//   return (
//     <>
//       {/* Para probar el archivo createcontex.jsx*/}
//       {/* <Navbar />
//       <FormularioLogin /> */}
//       {/* Para probar el archivo usecontext.jsx*/}
//       {/* <Layout>
//         <Seccion>
//           <Panel>
//             <Navbar />
//             Navbar → UsuarioInfo, 4 niveles abajo de AuthProvider
//           </Panel>
//         </Seccion>
//         <Login />
//       </Layout> */}
//     </>
//   );
// }

//  PARA PROBAR USEREDUCEREASY
// import {
//   ContadorConUseReducer,
//   ContadorConUseState,
// } from "./learning/UseReducerEasy";
// function App() {
//   return (
//     <>
//       <ContadorConUseState />
//       <ContadorConUseReducer />
//     </>
//   );
// }
// export default App;

// PARA PROBAR USEREDUCERMIDDLE

// import { ContadorConPayload } from "./learning/UseReducerMiddle";
// function App() {
//   return (
//     <>
//       <ContadorConPayload />
//     </>
//   );
// }
// export default App;

// PARA PROBAR USEREDUCERADVANCED

// import { ReaccionesPost } from "./learning/UseReducerAdvanced";

// function App() {
//   return (
//     <>
//       <ReaccionesPost />
//     </>
//   );
// }
// export default App;

// PARA PROBAR USECONTEXTREDUCER

// import {
//   ListaNotificaciones,
//   SimulacionLogin,
//   SimulacionPosts,
// } from "./learning/UseContextReducer";
// function App() {
//   return (
//     <>
//       <ListaNotificaciones />
//       <div style={{ padding: 20 }}>
//         <SimulacionLogin />
//         <SimulacionPosts />
//       </div>
//     </>
//   );
// }

// export default App;

// PARA PROBAR EL EJERCICIO
import { MainLayout } from "./exercises/Layout";
import { Navbar } from "./exercises/Navbar";
import { Login } from "./exercises/Login";
import { Home } from "./exercises/Dashboard";
import { PrivateRoute } from "./exercises/PrivateRoute";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida: PrivateRoute revisa el token antes de renderizar Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
export default App;
