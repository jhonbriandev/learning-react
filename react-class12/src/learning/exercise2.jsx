// Encontrar por qué el contador no aumenta correctamente.

import { useState, useCallback } from "react";

export default function Contador() {
  const [count, setCount] = useState(0);

  // Version fallida
  //   const aumentar = useCallback(() => {
  //     setCount(count + 1);
  //   }, []);

  // Version Nueva
  const aumentar = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <h2>Contador: {count}</h2>
      <button onClick={aumentar}>Aumentar</button>
    </div>
  );
}
// Con [count]:
// La función se vuelve a crear cada vez que count cambia.
// Funciona correctamente porque siempre captura el count actualizado,
// pero la referencia de la función cambia.

// Con prev:
// La función permanece estable porque no depende de count.
// React le entrega el valor más reciente del estado mediante prev.

// No me importa el count de este render;
// solo necesito tomar el valor más reciente y calcular el nuevo estado.

// Esta misma idea aplica para:
// - favoritos
// - tareas
// - carritos de compra
// - likes
// - contadores
// - cualquier estado acumulativo en React.
