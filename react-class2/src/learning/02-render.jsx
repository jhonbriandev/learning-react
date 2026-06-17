/*1. Componente se renderiza por primera vez
2. Usuario hace algo (click, escribe, etc.)
3. Se llama al setter: setCuenta(cuenta + 1)
4. React detecta que el estado cambió
5. React vuelve a ejecutar la función del componente
6. JSX nuevo se compara con el anterior (Virtual DOM)
7. Solo se actualiza en el DOM real lo que cambió*/

/*Analogía: React es como un fotógrafo eficiente. 
No reemplaza toda la foto cuando algo cambia — compara la foto anterior con la nueva y solo retoca 
la parte que es diferente.*/

// Cada vez que llamas setCuenta, React ejecuta esto de nuevo:
import { useState } from "react";

export function Count() {
  const [cuenta, setCuenta] = useState(0);
  // En el primer render: cuenta = 0
  // Después del click:   cuenta = 1
  // Después de otro click: cuenta = 2

  console.log("Componente renderizado, cuenta es:", cuenta);
  // Verás este log cada vez que el estado cambia

  return <p>{cuenta}</p>;
}

// NO TIENE EJECUCION SOLO LECTURA
