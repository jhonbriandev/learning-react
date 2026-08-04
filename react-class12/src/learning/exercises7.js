// 5. Escritura desde cero (corto):
// Escribe un hook personalizado useToggle(valorInicial) que devuelva [estado, alternar],
// donde alternar cambia el booleano de true a false y viceversa.
// Pista: piensa en qué hook necesitas para el valor y cuál para la función que no cambie en cada render.

import { useState, useCallback } from "react";

export function useToggle(valorInicial = false) {
  // 1. Guardamos el valor actual (true o false) en "estado".
  //    "setEstado" es la función que React nos da automáticamente
  //    para poder cambiar ese valor.
  //    valorInicial define con qué arranca (por defecto: false).
  const [estado, setEstado] = useState(valorInicial);

  // 2. Creamos la función que invierte el valor de "estado".
  //    Usamos "prev" (el valor anterior) en vez de "!estado" directo,
  //    porque así siempre trabajamos con el dato más actualizado,
  //    incluso si hay varios cambios muy seguidos.
  //
  //    useCallback envuelve esta función para que React NO la vuelva
  //    a crear de nuevo en cada render (útil si la pasas a componentes hijos).
  //    El array vacío [] significa: "esta función nunca necesita recrearse".
  const alternar = useCallback(() => {
    setEstado((prev) => !prev);
  }, []);

  // 3. Devolvemos un array [valor, función], igual que hace useState.
  //    Así, quien use este hook puede ponerle el nombre que quiera
  //    a cada parte, por ejemplo: const [toggle, setToggle] = useToggle();
  return [estado, alternar];
}
