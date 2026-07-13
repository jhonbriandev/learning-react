// Este hook encapsula toda la lógica de fetch, estados de carga y errores:

import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Resetear estados cuando cambia la URL
    setData(null);
    setCargando(true);
    setError(null);

    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [url]); // se vuelve a ejecutar si cambia la url

  return { data, cargando, error };
}

export default useFetch;
