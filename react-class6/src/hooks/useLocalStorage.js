import { useState } from "react";

function useLocalStorage(clave, valorInicial) {
  // Inicializar con lo que hay en localStorage o el valor inicial
  const [valor, setValor] = useState(() => {
    try {
      const item = localStorage.getItem(clave);
      return item ? JSON.parse(item) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  // Actualizar estado Y localStorage al mismo tiempo
  function guardar(nuevoValor) {
    try {
      setValor(nuevoValor);
      localStorage.setItem(clave, JSON.stringify(nuevoValor));
    } catch (err) {
      console.error("Error guardando en localStorage:", err);
    }
  }

  function eliminar() {
    localStorage.removeItem(clave);
    setValor(valorInicial);
  }

  return [valor, guardar, eliminar];
}

export default useLocalStorage;
