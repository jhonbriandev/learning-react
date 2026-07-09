/*
  SEMANA 9 - DÍA 5 (REFUERZO)
  Nivel 1 de 3: useReducer explicado desde CERO

  --------------------------------------------------------------
  Vamos a ir MUY despacio. Antes de meter posts, notificaciones
  o carritos, veamos useReducer con lo más simple que existe:
  un contador de "Me gusta" en un post de tu blog.

  Primero lo hacemos como YA SABES (con useState).
  Después lo hacemos EXACTAMENTE IGUAL, pero con useReducer.
  La idea es que veas que useReducer no hace nada "mágico" ni
  nuevo — solo organiza lo mismo de otra forma.
  --------------------------------------------------------------
*/

import { useState, useReducer } from "react";

/* ================================================================
   PARTE A — El contador CON useState (esto ya lo dominas)
   ================================================================
*/
export function ContadorConUseState() {
  const [likes, setLikes] = useState(0);

  function sumarUno() {
    setLikes(likes + 1);
  }

  return (
    <div style={{ padding: 10, border: "1px solid #ccc", marginBottom: 20 }}>
      <h4>Versión con useState</h4>
      <p>Likes: {likes}</p>
      <button onClick={sumarUno}>+1 like</button>
    </div>
  );
}

/* ================================================================
   PARTE B — EXACTAMENTE lo mismo, pero con useReducer
   ================================================================

   Piensa useReducer como una MÁQUINA con 3 piezas:

     1. estadoInicial → con qué número empieza el contador (0)
     2. reducer       → la "receta" que dice CÓMO cambia el número
                        según lo que le pidas
     3. dispatch      → el botón que usas para PEDIRLE algo al reducer
                        (nunca cambias el número directamente, se lo
                        pides al reducer y él decide)

   Analogía: useState es como escribir tú mismo el número en un
   papel. useReducer es como llamar por teléfono a una persona
   (el reducer) y decirle "súmale uno", y ELLA escribe el número
   nuevo en el papel. Tú nunca tocas el papel directamente.
*/

// 1. Estado inicial: el contador empieza en 0.
//    Nota que aquí NO es un objeto, es solo un número. Así de
//    simple puede ser el estado.
const estadoInicial = 0;

// 2. El reducer: una función que SIEMPRE recibe dos cosas:
//    - estado:  el valor actual (el número que hay ahora)
//    - accion:  un objeto que dice QUÉ se quiere hacer
//    Y SIEMPRE devuelve el nuevo valor.
function contadorReducer(estado, accion) {
  // accion.type es como el "nombre" de la orden que estás dando.
  // Piensa en el switch como una lista de opciones de un menú
  // telefónico: "si dice SUMAR, haz esto. Si dice RESTAR, haz esto otro."
  switch (accion.type) {
    case "SUMAR":
      return estado + 1;

    case "RESTAR":
      return estado - 1;

    case "REINICIAR":
      return 0;

    default:
      return estado;
  }
}

export function ContadorConUseReducer() {
  // 3. useReducer nos da DOS cosas:
  //    - likes:    el valor actual (reemplaza al "likes" de useState)
  //    - dispatch: la función para "llamar por teléfono" al reducer
  const [likes, dispatch] = useReducer(contadorReducer, estadoInicial);

  function sumarUno() {
    // En vez de decir "likes = likes + 1" (como con setLikes),
    // le mandamos un MENSAJE al reducer describiendo qué queremos.
    dispatch({ type: "SUMAR" });
  }

  return (
    <div style={{ padding: 10, border: "1px solid #ccc" }}>
      <h4>Versión con useReducer</h4>
      <p>Likes: {likes}</p>
      <button onClick={sumarUno}>+1 like</button>
      <button onClick={() => dispatch({ type: "RESTAR" })}>-1 like</button>
      <button onClick={() => dispatch({ type: "REINICIAR" })}>Reiniciar</button>
    </div>
  );
}

// export default function App() {
//   return (
//     <div style={{ fontFamily: "sans-serif", padding: 20 }}>
//       <ContadorConUseState />
//       <ContadorConUseReducer />
//     </div>
//   );
// }

/*
  PREGUNTAS PARA TI (respóndelas en voz alta o por escrito,
  sin ver el código, antes de pasar al Nivel 2):

  1. ¿Qué hace dispatch({ type: 'SUMAR' })? ¿A dónde va ese mensaje?
  2. ¿Por qué el reducer tiene un "switch" en vez de un "if"?
  3. Si agregara un botón "+10", ¿qué tendría que escribir?
     (Pista: con lo que sabes hasta ahora, tendrías que crear un
      nuevo case, por ejemplo 'SUMAR_DIEZ'. En el Nivel 2 vas a
      ver una forma más elegante de resolver esto con "payload".)

  RESUMEN EN UNA FRASE:
  useReducer = useState + una función que decide CÓMO cambia
  el valor, en vez de cambiarlo tú mismo directamente.
*/
