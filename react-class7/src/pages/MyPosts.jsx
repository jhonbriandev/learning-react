import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { postsService } from "../services/postsService";
import { CardPost } from "../components/CardPost";
import { FormPost } from "../components/FormPost";

export function MyPosts() {
  // --- BLOQUE 1: datos de sesión y estado del componente ---
  const { token, estaAutenticado } = useAuth();
  const [posts, setPosts] = useState([]); // lista de posts traída de la API
  const [cargando, setCargando] = useState(true); // true mientras se pide la lista
  const [error, setError] = useState(null); // mensaje de error, si algo falla
  const [enviando, setEnviando] = useState(false); // true mientras se crea/edita un post

  // Este estado controla qué se muestra en el formulario:
  // null    -> formulario oculto
  // 'crear' -> formulario vacío, para un post nuevo
  // objeto  -> formulario con los datos de ESE post, para editarlo
  const [modoFormulario, setModoFormulario] = useState(null);

  // --- BLOQUE 2: cargar la lista de posts ---
  // Este efecto se ejecuta al montar el componente, y se repite cada
  // vez que "token" cambia (por ejemplo, cuando el usuario hace login
  // después de haber entrado a la página sin sesión).
  useEffect(() => {
    async function cargar() {
      try {
        const data = await postsService.getAll(token);
        // Django REST Framework, cuando pagina resultados, los envuelve
        // en un objeto { results: [...] }. Si no hay paginación, la
        // respuesta ya es el array directo. Esto cubre ambos casos.
        setPosts(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        // Se ejecuta siempre (haya salido bien o mal), así apagamos
        // el estado de carga sin importar el resultado.
        setCargando(false);
      }
    }
    cargar();
  }, [token]);

  // --- BLOQUE 3: crear un post nuevo ---
  async function manejarCrear(datos) {
    setEnviando(true);
    try {
      const nuevoPost = await postsService.create(datos, token);
      // Agregamos el post nuevo al principio de la lista, sin tener
      // que volver a pedir toda la lista de nuevo a la API.
      setPosts((prev) => [nuevoPost, ...prev]);
      setModoFormulario(null); // oculta el formulario tras crear
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  // --- BLOQUE 4: editar un post existente ---
  async function manejarEditar(datos) {
    setEnviando(true);
    try {
      const postActualizado = await postsService.update(
        modoFormulario.slug, // acá modoFormulario es el post que se está editando
        datos,
        token,
      );
      // Recorremos la lista y reemplazamos SOLO el post que coincide
      // con el slug editado, dejando los demás intactos.
      setPosts((prev) =>
        prev.map((p) => (p.slug === modoFormulario.slug ? postActualizado : p)),
      );
      setModoFormulario(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  // --- BLOQUE 5: eliminar un post ---
  async function manejarEliminar(slug) {
    // confirm() muestra el cuadro de diálogo nativo del navegador.
    // Si el usuario cancela, cortamos acá y no hacemos nada más.
    if (!confirm("¿Eliminar este post?")) return;
    try {
      await postsService.delete(slug, token);
      // Quitamos el post de la lista local con filter, que crea un
      // array nuevo con todos los elementos MENOS el que coincide.
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      setError(err.message);
    }
  }

  // --- BLOQUE 6: estados especiales de la pantalla ---
  // Antes de renderizar la lista completa, cortamos acá si todavía
  // está cargando o si hubo un error al pedir los datos.
  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  // --- BLOQUE 7: render principal ---
  return (
    <div className="container">
      <div className="posts-header">
        <h1>Posts</h1>
        {/* El botón "+ Nuevo post" solo aparece si el usuario está
            logueado Y no hay ya otro formulario abierto */}
        {estaAutenticado && modoFormulario === null && (
          <button onClick={() => setModoFormulario("crear")}>
            + Nuevo post
          </button>
        )}
      </div>

      {/* Formulario de creación: solo se muestra cuando modoFormulario
          vale exactamente el string "crear" */}
      {modoFormulario === "crear" && (
        <FormPost
          onSubmit={manejarCrear}
          onCancelar={() => setModoFormulario(null)}
          enviando={enviando}
        />
      )}

      {/* Lista de posts */}
      <div className="posts-grid">
        {posts.map((post) => (
          <CardPost
            key={post.id}
            post={post}
            // Esta card entra en modo edición SOLO si el slug guardado
            // en modoFormulario coincide con el slug de ESTE post.
            // Así, aunque tengas 20 posts, solo UNO muestra el
            // formulario de edición a la vez.
            modoEdicion={modoFormulario?.slug === post.slug}
            onEditar={() => setModoFormulario(post)}
            onCancelarEdicion={() => setModoFormulario(null)}
            onGuardarEdicion={manejarEditar}
            onEliminar={() => manejarEliminar(post.slug)}
            enviando={enviando}
            puedeEditar={estaAutenticado}
          />
        ))}
      </div>
    </div>
  );
}
