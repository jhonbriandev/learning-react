/*El patrón completo — estados + efecto + render condicional
Este es el patrón que vas a usar en casi todos los componentes que carguen datos:*/

// Traemos dos "hooks" (funciones especiales de React) que vamos a necesitar:
// - useState: para crear variables que React "vigila", y cuando cambian,
//   vuelve a dibujar el componente automáticamente.
// - useEffect: para ejecutar tareas que no tienen que ver con dibujar HTML
//   directamente, como pedir datos a un servidor.
import { useState, useEffect } from "react";

// ---------------------------------------------------------
// COMPONENTE 1: CardPost
// Su único trabajo es dibujar la tarjeta de UN solo post.
// Recibe ese post como prop (entre llaves: { post }).
// ---------------------------------------------------------
export function CardPost({ post }) {
  return (
    <div>
      {/* post.title y post.content existen porque "post" es un objeto
          con esa forma, por ejemplo: { id: 1, title: "Hola", content: "..." } */}
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
}

// ---------------------------------------------------------
// COMPONENTE 2: Posts
// Su trabajo es: pedir la lista de posts al servidor, guardar
// el estado de la carga (cargando, error) y mostrar cada post
// usando el componente CardPost.
// ---------------------------------------------------------
export function Posts() {
  // Estado 1: la lista de posts. Empieza vacía hasta que llegue la respuesta.
  const [posts, setPosts] = useState([]);

  // Estado 2: si está cargando o no. Empieza en "true" porque, al abrir
  // la página, lo primero que pasa es justamente "estamos cargando".
  const [cargando, setCargando] = useState(true);

  // Estado 3: si hubo un error. Empieza en "null" (sin error).
  const [error, setError] = useState(null);

  // useEffect: la "nota adhesiva" que le dice al componente
  // "cuando aparezcas en pantalla, haz esto otro" (en este caso, pedir los datos).
  useEffect(() => {
    // AbortController es como un "botón de cancelar" para el fetch.
    // Sirve para que, si el componente desaparece de pantalla ANTES de
    // que termine de llegar la respuesta, podamos cancelar esa petición
    // y evitar errores o actualizaciones de estado innecesarias.
    const controller = new AbortController();

    // No podemos poner "async" directamente en la función de arriba
    // (la de useEffect), así que creamos esta función aparte, y a
    // ESTA sí la marcamos como async.
    async function cargar() {
      try {
        // Antes de pedir los datos, nos aseguramos de mostrar "cargando"
        // y de limpiar cualquier error viejo que hubiera quedado de un intento anterior.
        setCargando(true);
        setError(null);

        // Pedimos los datos al servidor. Le pasamos "signal: controller.signal"
        // para que este fetch "escuche" si debe cancelarse.
        const response = await fetch("http://127.0.0.1:8000/api/posts/", {
          signal: controller.signal,
        });

        // fetch no lanza error automáticamente si el servidor responde
        // con un código de error (como 404 o 500). Por eso lo chequeamos
        // a mano: si la respuesta no es "ok", lanzamos nuestro propio error.
        if (!response.ok) throw new Error(`Error ${response.status}`);

        // Convertimos la respuesta en datos que JavaScript puede usar.
        const data = await response.json();

        // Esto lo agregaste para revisar en la consola del navegador
        // exactamente qué forma tiene la respuesta del servidor. Muy útil
        // para depurar, puedes quitarlo cuando ya no lo necesites.
        console.log(data);

        // Guardamos los posts en el estado. El "|| data" es un respaldo:
        // si la respuesta NO tiene una propiedad "results", usamos toda
        // la respuesta como si fuera directamente la lista de posts.
        setPosts(data.results || data);
      } catch (err) {
        // Si el error fue justamente por haber cancelado la petición
        // (con el AbortController), no lo tratamos como un error real,
        // simplemente salimos de la función sin hacer nada más.
        if (err.name === "AbortError") return;

        // Cualquier otro error sí lo guardamos, para mostrarlo en pantalla.
        setError(err.message);
      } finally {
        // "finally" se ejecuta SIEMPRE, haya error o no.
        // Avisamos que ya terminó de cargar (haya salido bien o mal).
        setCargando(false);
      }
    }

    // Crear la función "cargar" no la ejecuta sola; hay que llamarla.
    cargar();

    // Esta función de "limpieza" se ejecuta si el componente desaparece
    // de pantalla antes de que termine la petición. Cancela el fetch
    // usando el AbortController que creamos arriba.
    return () => controller.abort();

    // Array de dependencias vacío: este efecto se ejecuta una sola vez,
    // cuando el componente aparece por primera vez en pantalla.
  }, []);

  // --------- A partir de aquí: qué dibujar según el estado actual ---------

  // Si todavía está cargando, mostramos un mensaje/spinner y no seguimos
  // ejecutando el resto del código de abajo (el "return" corta aquí).
  if (cargando) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando posts...</p>
      </div>
    );
  }

  // Si hubo un error, lo mostramos junto con un botón para reintentar
  // (recargando toda la página).
  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  // Si ya terminó de cargar, no hubo error, pero la lista vino vacía,
  // mostramos un mensaje en vez de una lista en blanco.
  if (posts.length === 0) {
    return <p>No hay posts disponibles.</p>;
  }

  // Si llegamos hasta aquí: ya cargó, no hubo error, y SÍ hay posts.
  // Recorremos la lista completa con .map(), y por cada post individual
  // (variable "post", singular) creamos una tarjeta <CardPost />,
  // pasándole ese post como prop.
  return (
    <div className="posts-grid">
      {posts.map((post) => (
        // "key" es obligatorio en listas de React: es como el DNI de
        // cada elemento, para que React distinga uno de otro si la
        // lista cambia (se agrega, borra o reordena algo).
        <CardPost key={post.id} post={post} />
      ))}
    </div>
  );
}

/*Conexión con lo que ya sabes
JS puro                              React con useEffect
──────────────────────────────       ────────────────────────────────
DOMContentLoaded → cargar datos      useEffect(() => { cargar() }, [])
Variable que depende de otra         useEffect(() => { ... }, [variable])
clearInterval al salir               return () => clearInterval(id)
AbortController para cancelar        return () => controller.abort()**/
