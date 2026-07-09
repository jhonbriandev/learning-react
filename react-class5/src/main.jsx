import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// Orden importante: BrowserRouter afuera, AuthProvider adentro

// // Para probar createcontext.jsx
//import { AuthProvider } from "./learning/CreateContext";

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </BrowserRouter>,
// );

// Para probar usecontext.jsx
//import { AuthProvider } from "./learning/UseContext";

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </BrowserRouter>,
// );

// Para probar UseReducerEasy.jsx

//createRoot(document.getElementById("root")).render(<App />);

// Para probar UseReducerMiddle.jsx

// createRoot(document.getElementById("root")).render(<App />);

// Para probar UseReducerAdvanced.jsx

// createRoot(document.getElementById("root")).render(<App />);

// Para probar UseContextReducer.jsx

// import { NotificacionesProvider } from "./learning/UseContextReducer";

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <NotificacionesProvider>
//       <App />
//     </NotificacionesProvider>
//   </BrowserRouter>,
// );

// Para probar Ejercicios

import { AuthProvider } from "./exercises/AuthContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
