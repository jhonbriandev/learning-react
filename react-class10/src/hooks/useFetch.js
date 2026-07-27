// Hook personalizado que centraliza peticiones a la API,
// manejando datos, carga, errores y cancelación de solicitudes.

import { useState, useEffect } from "react";

function useFetch(url) {
  // Estados de la petición:
  // data: respuesta recibida
  // cargando: controla el estado de carga
  // error: almacena errores de la petición
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Se ejecuta cuando cambia la URL recibida.
  useEffect(() => {
    // Reinicia estados para una nueva petición.
    setData(null);
    setCargando(true);
    setError(null);

    // Permite cancelar la petición si el componente se desmonta
    // o si cambia la URL antes de terminar.
    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        // Controla respuestas HTTP incorrectas.
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        // Convierte la respuesta en JSON y guarda los datos.
        const json = await response.json();
        setData(json);
      } catch (err) {
        // Ignora errores producidos por cancelación.
        if (err.name === "AbortError") return;

        setError(err.message);
      } finally {
        // Finaliza el estado de carga.
        setCargando(false);
      }
    }

    fetchData();

    // Cleanup: cancela la petición pendiente.
    return () => controller.abort();
  }, [url]);

  // Devuelve todo lo necesario para consumir la API.
  return { data, cargando, error };
}

export default useFetch;
