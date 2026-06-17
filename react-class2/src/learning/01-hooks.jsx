// INCORRECTO — variable normal

/*El problema: React no sabe que cuenta cambió. Para React, 
esa variable es solo un valor que se calculó cuando el componente se renderizó por primera vez. 
React no tiene forma de saber que debe volver a renderizar el componente.*/

export function Contador() {
  let cuenta = 0; // variable normal

  function incrementar() {
    cuenta++; // modifica la variable
    console.log(cuenta); // el valor cambia en consola...
  }

  return (
    <div>
      <p>{cuenta}</p> {/* ...pero esto siempre muestra 0 */}
      <button onClick={incrementar}>+1</button>
    </div>
  );
}

// Aunque en consola si se vea el cambio, en pantalla no, no se renderiza para eso usaremos
// Use State resuelve exactamente eso — le dice a React "este valor puede cambiar,
// y cuando cambie necesito que vuelvas a renderizar

import { useState } from "react";

export function ContadorUseState() {
  // useState devuelve dos cosas en un array
  const [cuenta, setCuenta] = useState(0);
  //     ↑          ↑                  ↑
  //  el valor   función para       valor inicial
  //  actual     actualizarlo

  function incrementar() {
    setCuenta(cuenta + 1); // actualiza el estado
    // React detecta el cambio y re-renderiza el componente
  }

  return (
    <div>
      <p>{cuenta}</p>
      <button onClick={incrementar}>+1</button>
    </div>
  );
}

// EJEMPLOS

// useState devuelve exactamente esto:
// [valorActual, funcionParaActualizar]

// Por convención el setter se llama set + NombreDelEstado
// const [nombre, setNombre] = useState("");
// const [posts, setPosts] = useState([]);
// const [cargando, setCargando] = useState(false);
// const [usuario, setUsuario] = useState(null);
