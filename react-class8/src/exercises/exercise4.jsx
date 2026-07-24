import { useState, useRef } from "react";

export function Buscador() {
  const [texto, setTexto] = useState("");
  const timerRef = useRef(null); // 👈 guarda el ID del timer sin causar re-render

  function buscar(valor) {
    console.log("Buscando:", valor);
  }

  function manejarCambio(e) {
    const valor = e.target.value; // 1. leer directo del evento (siempre fresco)
    setTexto(valor); // 2. actualizar el estado, para que el input se vea bien

    // 3. cancelar el timer anterior si el usuario sigue escribiendo
    if (timerRef.current) clearTimeout(timerRef.current);

    // 4. programar la búsqueda 500ms después de la última tecla
    timerRef.current = setTimeout(() => {
      buscar(valor); // usa la variable LOCAL, no el estado (evita el bug del closure viejo)
    }, 500);
  }

  return <input value={texto} onChange={manejarCambio} />;
}
