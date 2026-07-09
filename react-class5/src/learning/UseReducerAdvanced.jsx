/*
  SEMANA 9 - DÍA 5 (REFUERZO)
  Nivel 3 de 3: useReducer con un OBJETO como estado

  --------------------------------------------------------------
  En los niveles 1 y 2, el estado era un solo número. Pero en
  la vida real, casi siempre el estado es un OBJETO con varias
  propiedades relacionadas.

  Ejemplo real: las reacciones de un post de tu blog.
  Un post no solo tiene "likes" — también tiene "dislikes".
  Ambos números viven JUNTOS, en el mismo estado, porque
  pertenecen a la misma "cosa" (las reacciones de ESE post).
  --------------------------------------------------------------
*/

import { useReducer } from "react";

/* ============================================================
   BLOQUE 1: Estado inicial — ahora es un OBJETO, no un número
   ============================================================
*/
const estadoInicial = {
  likes: 0,
  dislikes: 0,
};

/* ============================================================
   BLOQUE 2: El reducer
   ============================================================
   REGLA DE ORO que en los niveles 1 y 2 no se notaba tanto
   porque el estado era solo un número:

   Cuando el estado es un OBJETO, NUNCA modifiques el objeto
   original. SIEMPRE devuelve un objeto NUEVO.

   Por eso usamos "...estado" (el operador spread / "esparcir").
   Significa: "copia TODAS las propiedades que ya tenía estado,
   y después voy a pisar solo la que me interesa cambiar".

   Analogía: es como fotocopiar un documento completo y luego
   tachar y volver a escribir SOLO el campo que quieres cambiar,
   en vez de rayar el documento original.
*/
function reaccionesReducer(estado, accion) {
  switch (accion.type) {
    case "DAR_LIKE":
      return {
        ...estado, // copia { likes: X, dislikes: Y } tal cual
        likes: estado.likes + 1, // y PISA solo "likes" con el nuevo valor
      };
    // dislikes queda intacto porque el spread ya lo copió

    case "DAR_DISLIKE":
      return {
        ...estado,
        dislikes: estado.dislikes + 1,
      };

    case "QUITAR_LIKE":
      return {
        ...estado,
        // Math.max(0, ...) evita que el número baje de 0
        likes: Math.max(0, estado.likes - 1),
      };

    case "REINICIAR":
      return estadoInicial;

    default:
      return estado;
  }
}

/* ============================================================
   BLOQUE 3: Componente
   ============================================================
*/
export function ReaccionesPost() {
  const [reacciones, dispatch] = useReducer(reaccionesReducer, estadoInicial);

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ccc",
        fontFamily: "sans-serif",
      }}
    >
      <h4>"Cómo aprender useReducer" — reacciones del post</h4>

      <p>👍 Likes: {reacciones.likes}</p>
      <p>👎 Dislikes: {reacciones.dislikes}</p>

      <button onClick={() => dispatch({ type: "DAR_LIKE" })}>Dar like</button>
      <button onClick={() => dispatch({ type: "QUITAR_LIKE" })}>
        Quitar like
      </button>
      <button onClick={() => dispatch({ type: "DAR_DISLIKE" })}>
        Dar dislike
      </button>
      <button onClick={() => dispatch({ type: "REINICIAR" })}>Reiniciar</button>
    </div>
  );
}

// export default function App() {
//   return <ReaccionesPost />;
// }

/*
  ERROR MÁS COMÚN de principiantes (pruébalo tú mismo para
  verlo con tus propios ojos):

  Si en vez de:
      return { ...estado, likes: estado.likes + 1 }
  escribieras:
      return { likes: estado.likes + 1 }
                                          ^ olvidando el ...estado

  ... el "dislikes" DESAPARECERÍA del estado (quedaría undefined),
  porque estarías devolviendo un objeto nuevo que SOLO tiene la
  propiedad "likes". El spread (...estado) es lo que evita perder
  las demás propiedades que no tocaste.

  RESUMEN DE LOS 3 NIVELES:

  Nivel 1 → useReducer es como useState, pero cambias el valor
            a través de un "reducer" en vez de directamente.
  Nivel 2 → el "payload" es el dato extra que acompaña a la acción,
            para que una misma acción sirva para distintos casos
            (+1, +5, +10).
  Nivel 3 → cuando el estado es un objeto con varias propiedades,
            usa "...estado" para copiar lo que no cambia, y pisa
            solo la propiedad que sí necesitas actualizar.

  Con estos 3 niveles ya tienes TODO lo necesario para entender
  el ejemplo de notificaciones que vimos antes (que es exactamente
  esto, pero con un ARRAY de notificaciones en vez de un objeto
  con dos números).
*/
