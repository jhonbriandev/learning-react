// Construye un componente PostsConBusqueda que:

// 1. Al montar, cargue los posts de tu API Django con useEffect y []
//    Maneja los tres estados: cargando, error, éxito

// 2. Tenga un input de búsqueda controlado con useState

// 3. Un segundo useEffect que se ejecute cuando cambie el texto
//    de búsqueda y filtre los posts localmente:
//    posts.filter(p => p.titulo.toLowerCase()
//        .includes(busqueda.toLowerCase()))
//    (no hace fetch nuevo — filtra lo que ya tiene)

// 4. Muestra cuántos posts coinciden con la búsqueda:
//    "Mostrando X de Y posts"

// 5. Cleanup: el componente debe cancelar el fetch
//    si se desmonta antes de que termine (AbortController)

import { useState, useEffect } from "react";

// Bloque 1: tarjeta individual — solo recibe un post y lo muestra,
// no sabe nada de búsqueda ni de la API
export function CardPost({ post }) {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
}

export function Posts() {
  // Bloque 2: estados
  // posts          -> el archivo maestro, llega una vez de la API y no se toca más
  // postsFiltrados -> lo que realmente se pinta en pantalla
  // cargando/error -> controlan qué mostrar mientras llega o falla la respuesta
  // busqueda       -> lo que el usuario escribe en el input
  const [posts, setPosts] = useState([]);
  const [postsFiltrados, setPostsFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Bloque 3: useEffect #1 — trae los datos de la API
  // El array vacío [] significa "ejecuta esto una sola vez, al montar"
  useEffect(() => {
    // AbortController: si el componente se desmonta antes de que
    // termine el fetch, esto cancela la petición a medias
    const controller = new AbortController();

    async function cargar() {
      try {
        setCargando(true);
        setError(null);

        const response = await fetch("http://127.0.0.1:8000/api/posts/", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        // Algunas APIs envuelven la lista en "results", otras la
        // devuelven directa. Esto cubre ambos casos.
        const listaPosts = data.results || data;

        setPosts(listaPosts);
        setPostsFiltrados(listaPosts); // al inicio, mostramos todo sin filtrar
      } catch (err) {
        // si el error es por cancelación intencional, lo ignoramos
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();

    // función de limpieza: corre si el componente desaparece
    return () => controller.abort();
  }, []);

  // Bloque 4: useEffect #2 — filtra localmente
  // Se dispara cada vez que "busqueda" o "posts" cambian.
  // No hace fetch nuevo, solo recorre lo que ya está en memoria.
  useEffect(() => {
    const resultado = posts.filter((p) =>
      p.title.toLowerCase().includes(busqueda.toLowerCase()),
    );
    setPostsFiltrados(resultado);
  }, [busqueda, posts]);

  // Bloque 5: JSX final
  // El input vive fuera de cualquier condición, para que siempre
  // esté visible y usable, sin importar el estado de carga/error
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar post..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* mientras se espera la respuesta de la API */}
      {cargando && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando posts...</p>
        </div>
      )}

      {/* si la petición falló */}
      {!cargando && error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}

      {/* si todo salió bien pero no hay posts en la API */}
      {!cargando && !error && posts.length === 0 && (
        <p>No hay posts disponibles.</p>
      )}

      {/* caso normal: ya cargó, no hay error, y sí hay posts */}
      {!cargando && !error && posts.length > 0 && (
        <>
          {/* contador: usa postsFiltrados.length (lo que se ve)
              sobre posts.length (el total real, sin filtrar) */}
          <p>
            Mostrando {postsFiltrados.length} de {posts.length} posts
          </p>
          <div className="posts-grid">
            {postsFiltrados.map((post) => (
              <CardPost key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
