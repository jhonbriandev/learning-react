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
// Ejemplo 2 — limpiar un intervalo
useEffect(() => {
  const intervalo = setInterval(() => {
    console.log("Tick cada segundo");
  }, 1000);

  return () => {
    clearInterval(intervalo); // limpia el intervalo al desmontar
  };
}, []);

// 1. React monta el componente (primera vez)
//    → useEffect corre
//    → se crea controller #1
//    → empieza fetch #1 (pidiendo datos al servidor)

// 2. React decide desmontar el componente (esto es automático en Strict Mode, solo para probar)
//    → se ejecuta la función de limpieza: controller #1.abort()
//    → fetch #1 queda CANCELADO (nunca va a completar su respuesta)

// 3. React vuelve a montar el componente (segunda vez, la que se queda)
//    → useEffect corre OTRA VEZ
//    → se crea controller #2 (uno nuevo, distinto al anterior)
//    → empieza fetch #2

// 4. fetch #2 termina exitosamente → se guardan los datos → esto es lo que ves en pantalla
