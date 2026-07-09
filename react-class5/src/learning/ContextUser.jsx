/*
  SEMANA 9 - DÍA 5
  Archivo 4 de 5: Context + useReducer combinados
  (el patrón profesional, sin instalar Redux)


  --------------------------------------------------------------
  PROBLEMA REAL: en el archivo 3, las notificaciones solo
  las podía disparar el componente App, porque el
  useReducer vivía ahí adentro.

  Pero en tu blog real, quien necesita disparar una
  notificación de "post guardado" está en Posts.jsx, y
  quien necesita disparar "login fallido" está en Login.jsx.
  Son componentes completamente distintos.

  Solución: sacamos el useReducer del componente y lo
  metemos DENTRO de un Provider de Context. Así, cualquier
  componente de la app puede hacer dispatch() sin importar
  en qué archivo esté.

  Este es EXACTAMENTE el mismo patrón que usa Redux por
  detrás, solo que aquí lo armamos nosotros mismos con
  herramientas nativas de React.
  --------------------------------------------------------------
*/

import { createContext, useContext, useReducer } from "react";

/* ============================================================
   BLOQUE 1: Contexto + reducer (igual que en el archivo 3,
   pero ahora vive fuera de cualquier componente visual)
   ============================================================
*/
const NotificacionesContext = createContext(null);

const estadoInicial = { notificaciones: [] };

function notificacionesReducer(estado, accion) {
  switch (accion.type) {
    case "AGREGAR":
      return {
        ...estado,
        notificaciones: [
          { id: Date.now(), ...accion.payload },
          ...estado.notificaciones,
        ],
      };
    case "ELIMINAR":
      return {
        ...estado,
        notificaciones: estado.notificaciones.filter(
          (n) => n.id !== accion.payload,
        ),
      };
    default:
      return estado;
  }
}

/* ============================================================
   BLOQUE 2: El Provider — combina Context + useReducer
   ============================================================
   Nota la diferencia con el archivo 1: ahí el Provider tenía
   useState. Aquí tiene useReducer. La estructura es la misma,
   solo cambia CÓMO se maneja el estado adentro.

   Además, en vez de exponer "dispatch" en crudo, exponemos
   funciones con nombres claros (notificarExito, notificarError).
   Esto es más fácil de usar y de entender para quien consume
   el contexto — no necesita saber los "type" exactos del reducer.
*/
function NotificacionesProvider({ children }) {
  const [estado, dispatch] = useReducer(notificacionesReducer, estadoInicial);

  function notificarExito(mensaje) {
    dispatch({ type: "AGREGAR", payload: { mensaje, tipo: "exito" } });
  }

  function notificarError(mensaje) {
    dispatch({ type: "AGREGAR", payload: { mensaje, tipo: "error" } });
  }

  function eliminar(id) {
    dispatch({ type: "ELIMINAR", payload: id });
  }

  const valor = {
    notificaciones: estado.notificaciones,
    notificarExito,
    notificarError,
    eliminar,
  };

  return (
    <NotificacionesContext.Provider value={valor}>
      {children}
    </NotificacionesContext.Provider>
  );
}

function useNotificaciones() {
  const contexto = useContext(NotificacionesContext);
  if (!contexto) {
    throw new Error(
      "useNotificaciones debe usarse dentro de NotificacionesProvider",
    );
  }
  return contexto;
}

/* ============================================================
   BLOQUE 3: Componente que MUESTRA las notificaciones
   ============================================================
   En un proyecto real, esto se pondría UNA sola vez en
   Layout.jsx, para que aparezca en todas las páginas.
*/
function ListaNotificaciones() {
  const { notificaciones, eliminar } = useNotificaciones();

  return (
    <div style={{ position: "fixed", top: 10, right: 10 }}>
      {notificaciones.map((n) => (
        <div
          key={n.id}
          onClick={() => eliminar(n.id)}
          style={{
            padding: 10,
            marginBottom: 5,
            color: "white",
            cursor: "pointer",
            background: n.tipo === "error" ? "crimson" : "seagreen",
          }}
        >
          {n.mensaje}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   BLOQUE 4: Componentes SIN NINGUNA RELACIÓN entre sí que
   disparan notificaciones — simulando Login.jsx y Posts.jsx
   de tu proyecto real
   ============================================================
*/
function SimulacionLogin() {
  const { notificarError } = useNotificaciones();
  // Este componente NO conoce a ListaNotificaciones ni a Posts.
  // Solo conoce el contexto.
  return (
    <button onClick={() => notificarError("Usuario o contraseña incorrectos")}>
      Simular login fallido
    </button>
  );
}

function SimulacionPosts() {
  const { notificarExito } = useNotificaciones();
  return (
    <button onClick={() => notificarExito("Post publicado con éxito")}>
      Simular guardar post
    </button>
  );
}

/* ============================================================
   BLOQUE 5: Armado final
   ============================================================
*/
export default function App() {
  return (
    <NotificacionesProvider>
      <ListaNotificaciones />
      <div style={{ padding: 20 }}>
        <SimulacionLogin />
        <SimulacionPosts />
      </div>
    </NotificacionesProvider>
  );
}

/*
  RESUMEN — para explicar con tus palabras:

  - Context resuelve el "¿cómo llego hasta ahí?" (acceso desde
    cualquier componente).
  - useReducer resuelve el "¿cómo organizo la lógica cuando hay
    varias acciones posibles?".
  - Juntos, Context + useReducer permiten que CUALQUIER
    componente de tu blog (Login, Posts, Navbar, etc.) dispare
    una notificación global, sin que se conozcan entre sí y sin
    pasar nada por props.
  - Esta combinación es el "patrón profesional" que reemplaza
    a Redux en proyectos medianos, sin instalar ninguna
    librería extra.
*/
