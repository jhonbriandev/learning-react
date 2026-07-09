/*
  SEMANA 9 - DÍA 5
  Archivo 2 de 5: useContext + hook personalizado (useAuth)
  --------------------------------------------------------------
  HOY MEJORAMOS DOS COSAS DEL ARCHIVO ANTERIOR:

  1. En vez de escribir `useContext(AuthContext)` en cada
     componente, creamos un HOOK PERSONALIZADO: useAuth().
     Esto es 100% opcional a nivel técnico, pero es la forma
     MÁS COMÚN de hacerlo en proyectos reales (React Router,
     librerías profesionales, etc. lo hacen así). Por eso lo
     vamos a adoptar como estándar desde hoy.

  2. Simulamos un árbol de componentes bien profundo, a
     propósito, para que veas con tus propios ojos que ya
     NO existe prop drilling.

  ANALOGÍA del hook personalizado:
  Es como tener un control remoto universal en vez de tener
  que buscar el control remoto original de cada aparato.
  `useAuth()` es tu control remoto para todo lo relacionado
  a sesión de usuario.
  --------------------------------------------------------------
*/

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  function login(username) {
    setUsuario({ username });
  }

  function logout() {
    setUsuario(null);
  }

  const valor = { usuario, estaAutenticado: !!usuario, login, logout };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

/* ============================================================
   BLOQUE 1: El hook personalizado
   ============================================================
   Reglas de un hook personalizado:
   - Su nombre SIEMPRE empieza con "use" (useAuth, useCarrito,
     useLoQueSea). React usa esa convención para saber que es
     un hook y aplicarle sus reglas internas.
   - Adentro puede usar otros hooks (aquí usa useContext).

   El "if" de abajo es una MUY buena práctica: si alguien usa
   useAuth() por error FUERA del AuthProvider, en vez de un
   error confuso de React, le mostramos un mensaje claro.
*/
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }

  return contexto;
}

/* ============================================================
   BLOQUE 2: Árbol de componentes profundo (a propósito)
   ============================================================
   App → Layout → Seccion → Panel → Navbar → UsuarioInfo

   UsuarioInfo está 5 niveles debajo de donde vive el estado
   (AuthProvider). Ningún componente intermedio conoce ni le
   importa el usuario. Eso es lo que Context soluciona.
*/
export function UsuarioInfo() {
  // Aquí está el "consumo" real. Un solo import, una sola línea.
  const { usuario, estaAutenticado, logout } = useAuth();

  if (!estaAutenticado) return <p>Sin sesión</p>;

  return (
    <div>
      <p>Conectado como: {usuario.username}</p>
      <button onClick={logout}>Salir</button>
    </div>
  );
}

export function Navbar() {
  // Navbar NO usa useAuth. Solo renderiza a su hijo.
  // Fíjate que no recibe ni pasa ninguna prop relacionada a usuario.
  return (
    <nav style={{ background: "#f92", color: "white", padding: 10 }}>
      <UsuarioInfo />
    </nav>
  );
}

export function Panel({ children }) {
  return (
    <div style={{ border: "1px solid gray", padding: 10 }}>{children}</div>
  );
}

export function Seccion({ children }) {
  return <section>{children}</section>;
}

export function Layout({ children }) {
  return <div>{children}</div>;
}

/* ============================================================
   BLOQUE 3: Login usando el hook
   ============================================================
*/
export function Login() {
  const { login } = useAuth();

  return <button onClick={() => login("oldstarz")}>Iniciar sesión</button>;
}

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Seccion>
//           <Panel>
//             <Navbar />
//             {/* Navbar → UsuarioInfo, 4 niveles abajo de AuthProvider */}
//           </Panel>
//         </Seccion>
//         <Login />
//       </Layout>
//     </AuthProvider>
//   );
// }

/*
  RESUMEN — para explicar con tus palabras:

  - useContext(AuthContext) funciona en cualquier archivo,
    pero repetirlo en cada componente es tedioso y fácil de
    olvidar el chequeo de errores.
  - useAuth() empaqueta ese useContext + validación en UNA
    sola función reutilizable. Esta es la forma MÁS COMÚN
    y recomendada para principiantes: un hook por contexto.
  - Layout, Seccion y Panel ni se enteran de que existe un
    usuario. Ese es el punto: solo quien lo NECESITA lo pide.
*/
