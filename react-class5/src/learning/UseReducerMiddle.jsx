/*
  SEMANA 9 - DÍA 5 (REFUERZO)
  Nivel 2 de 3: useReducer + payload

  --------------------------------------------------------------
  En el Nivel 1 dejamos una pregunta pendiente: ¿cómo sumar
  una cantidad DIFERENTE cada vez (+1, +5, +10) sin crear un
  "case" nuevo para cada número?

  La respuesta es el "payload": información EXTRA que viaja
  junto con la acción.

  ANALOGÍA: si dispatch({ type: 'SUMAR' }) es como llamar y decir
  "suma", el payload es como decir "suma... 5". Es la orden MÁS
  el detalle de esa orden.
  --------------------------------------------------------------
*/

import { useReducer } from "react";

const estadoInicial = 0;

function contadorReducer(estado, accion) {
  switch (accion.type) {
    case "SUMAR":
      // Antes: return estado + 1  (siempre sumaba exactamente 1)
      // Ahora: sumamos lo que venga en accion.payload.
      // accion.payload es simplemente "la cantidad a sumar",
      // un dato que nosotros decidimos mandar.
      return estado + accion.payload;

    case "RESTAR":
      return estado - accion.payload;

    case "REINICIAR":
      return 0;

    default:
      return estado;
  }
}

export function ContadorConPayload() {
  const [likes, dispatch] = useReducer(contadorReducer, estadoInicial);

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ccc",
        fontFamily: "sans-serif",
      }}
    >
      <h4>Likes: {likes}</h4>

      {/*
              Fíjate cómo cambia el objeto que mandamos:
              antes { type: 'SUMAR' }
              ahora { type: 'SUMAR', payload: 1 }  ← agregamos el dato extra
            */}
      <button onClick={() => dispatch({ type: "SUMAR", payload: 1 })}>
        +1
      </button>
      <button onClick={() => dispatch({ type: "SUMAR", payload: 5 })}>
        +5
      </button>
      <button onClick={() => dispatch({ type: "SUMAR", payload: 10 })}>
        +10
      </button>
      <button onClick={() => dispatch({ type: "RESTAR", payload: 1 })}>
        -1
      </button>
      <button onClick={() => dispatch({ type: "REINICIAR" })}>Reiniciar</button>
    </div>
  );
}

// export default function App() {
//   return <ContadorConPayload />;
// }

/*
  COMPARA CON EL NIVEL 1:

  Nivel 1:  dispatch({ type: 'SUMAR' })
            reducer:  return estado + 1        (número fijo, "quemado" en el código)

  Nivel 2:  dispatch({ type: 'SUMAR', payload: 5 })
            reducer:  return estado + accion.payload   (número que TÚ decides al llamar)

  Esa es la única diferencia. El "payload" no es una palabra
  mágica de React — es solo el NOMBRE que la comunidad usa por
  convención para "la información extra que va con la acción".
  Podrías llamarlo "cantidad" o "dato" y funcionaría igual, pero
  usar "payload" es lo más común en proyectos reales, así que
  ya te vas acostumbrando al vocabulario estándar.

  PREGUNTA PARA TI antes de pasar al Nivel 3:
  ¿Qué pasaría si haces dispatch({ type: 'SUMAR' }) SIN payload,
  usando el reducer de este archivo? (Pista: prueba en el
  navegador y mira qué da estado + undefined)
*/
