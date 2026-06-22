/*Cleanup — limpiar cuando el componente se desmonta
El cleanup es la función que retorna useEffect. 
Se ejecuta antes de que el componente desaparezca o antes de que el efecto se ejecute de nuevo.*/

// Ejemplo 1 — cancelar una petición fetch
useEffect(() => {
  const controller = new AbortController();

  async function cargar() {
    try {
      const response = await fetch("/api/posts/", {
        signal: controller.signal, // vincula el fetch al controller
      });
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      if (err.name === "AbortError") return; // fue cancelado — no es error
      setError(err.message);
    }
  }

  cargar();

  return () => {
    controller.abort(); // cancela el fetch si el componente se desmonta
  };
}, []);

// ¿Por qué importa esto?
// Si el usuario navega a otra página mientras carga,
// el componente se desmonta. Sin cleanup, el fetch termina
// e intenta actualizar el estado de un componente que ya no existe.
// React lanza un warning y puede causar memory leaks.
jsx; // Ejemplo 2 — limpiar un intervalo
useEffect(() => {
  const intervalo = setInterval(() => {
    console.log("Tick cada segundo");
  }, 1000);

  return () => {
    clearInterval(intervalo); // limpia el intervalo al desmontar
  };
}, []);
