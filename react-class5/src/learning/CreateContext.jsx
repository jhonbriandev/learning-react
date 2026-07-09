/*
  SEMANA 9 - DÍA 5
  Archivo 1 de 5: createContext + Provider
  --------------------------------------------------------------
  EL PROBLEMA QUE RESOLVEMOS HOY 

  Piensa en el blog que ya construiste con Django + React.
  El usuario inicia sesión UNA vez, pero esa información
  ("¿quién soy?", "¿tengo sesión activa?") la necesitan
  componentes que están en partes MUY distintas del árbol:

    App
    └── Layout
        └── Navbar          ← necesita saber si hay sesión, para mostrar "Cerrar sesión"
    └── Posts
        └── CardPost
            └── BtnEditar   ← necesita saber si el usuario es el autor del post

  Sin Context, tendrías que pasar el usuario como prop
  atravesando TODOS los componentes intermedios, aunque
  Layout y CardPost no lo usen para nada. Eso se llama
  "prop drilling" (perforar con props).

  ANALOGÍA: el wifi de tu casa.
  Cualquier dispositivo (celular, laptop, smart TV) se conecta
  DIRECTAMENTE al router. Nadie tiene que pasar la señal de
  wifi mueble por mueble hasta llegar a tu cuarto.
  Context API es ese router: cualquier componente se "conecta"
  directamente al almacén de datos, sin importar qué tan
  profundo esté en el árbol.
  --------------------------------------------------------------
*/

import { createContext, useContext, useState } from "react";

/* ============================================================
   BLOQUE 1: createContext — crear el "almacén" vacío
   ============================================================
   Esto NO guarda datos todavía. Es solo la caja/router que
   vamos a usar para compartir información más adelante.
   El valor `null` es solo el valor por defecto si alguien
   intenta leer el contexto SIN estar dentro de un Provider.
*/
const AuthContext = createContext(null);

/* ============================================================
   BLOQUE 2: El Provider — quien "sirve" los datos
   ============================================================
   Un Provider es un componente que:
   1. Guarda el estado real (con useState, como siempre).
   2. Envuelve (rodea) a otros componentes con <AuthContext.Provider>.
   3. Comparte ese estado a TODOS los componentes que estén
      adentro de esa envoltura, sin importar qué tan anidados estén.

   `children` es una prop especial: representa "todo lo que
   pusiste ENTRE las etiquetas de apertura y cierre" de este
   componente. Ejemplo:
       <AuthProvider>
           <App />   ← esto es "children"
       </AuthProvider>
*/
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // Simulamos una llamada a Django
  // pero con un pequeño retraso, para que el ejemplo funcione
  // SIN necesitar el backend prendido.
  function login(username) {
    setTimeout(() => {
      setUsuario({ username });
    }, 500);
  }

  function logout() {
    setUsuario(null);
  }

  // `valor` es TODO lo que estará disponible para cualquier
  // componente que consuma este contexto: datos + funciones.
  const valor = {
    usuario,
    estaAutenticado: !!usuario, // !! convierte "algo o null" en true/false
    login,
    logout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

/* ============================================================
   BLOQUE 3: Componentes que CONSUMEN el contexto
   ============================================================
   useContext(AuthContext) es como decir:
   "conéctame al router que se llama AuthContext y dame
   lo último que esté transmitiendo".

   Fíjate que Navbar NO recibe ninguna prop desde su componente
   padre. Se conecta directo al contexto.
*/
export function Navbar() {
  const { usuario, estaAutenticado, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: 10, background: "#222", color: "white" }}>
      <strong>Mi Blog</strong>
      {" | "}
      {estaAutenticado ? (
        <span>
          Hola, {usuario.username} —{" "}
          <button onClick={logout}>Cerrar sesión</button>
        </span>
      ) : (
        <span>No hay sesión activa</span>
      )}
    </nav>
  );
}

export function FormularioLogin() {
  const { login } = useContext(AuthContext);

  function manejarClick() {
    login("oldstarz");
  }

  return (
    <div style={{ padding: 10 }}>
      <button onClick={manejarClick}>Iniciar sesión (simulado)</button>
    </div>
  );
}

/* ============================================================
   BLOQUE 4: Armado final — quién envuelve a quién
   ============================================================
   Esto simula tu main.jsx / App.jsx real.
   Todo lo que esté DENTRO de <AuthProvider> puede usar
   useContext(AuthContext). Lo que esté FUERA, no.
*/
// export default function App() {
//   return (
//     <AuthProvider>
//       <Navbar />
//       <FormularioLogin />
//     </AuthProvider>
//   );
//}

/*
  RESUMEN DEL BLOQUE — para que lo expliques con tus palabras:

  1. createContext(null)   → crea el "canal" o "router" vacío
  2. <AuthContext.Provider value={...}> → transmite datos por ese canal
  3. useContext(AuthContext)             → cualquier componente adentro
                                            "sintoniza" ese canal

  ¿Por qué esto es necesario en el mundo real?
  Cualquier app con login (redes sociales, bancos, tiendas online)
  necesita que MUCHOS componentes sepan "quién está logueado"
  sin repetir esa información por props en cada nivel.
*/
