import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { postsService } from "../services/postsService";
import { FeedbackEstado } from "../components/feedback/FeedbackEstado";
import { CardPost } from "../components/posts/CardPost";
import { FormPost } from "./FormPost";
import "../index.css";

export function MyPost() {
  const { token, estaAutenticado } = useAuth();
  const { agregarToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // null = cerrado
  // {} = editando ese post
  // "crear" = creando
  const [modoFormulario, setModoFormulario] = useState(null);

  // Cargar posts al iniciar o cuando cambie el token
  useEffect(() => {
    cargarPosts();
  }, [token]);

  async function cargarPosts() {
    setCargando(true);
    setError(null);

    try {
      const data = await postsService.getAll(token);

      // Soporta lista simple o respuesta paginada
      setPosts(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  // Filtrado memoizado
  const postsFiltrados = useMemo(
    () =>
      posts.filter((p) =>
        p.title.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [posts, busqueda],
  );

  // Eliminar post
  const manejarEliminar = useCallback(
    async (slug) => {
      if (!confirm("¿Eliminar este post?")) return;

      try {
        await postsService.delete(slug, token);

        // Quita el post del estado local
        setPosts((prev) => prev.filter((p) => p.slug !== slug));

        agregarToast("Post eliminado", "success");
      } catch {
        agregarToast("Error al eliminar", "error");
      }
    },
    [token, agregarToast],
  );

  // Abrir formulario en modo edición
  const manejarEditar = useCallback((post) => {
    setModoFormulario(post);
  }, []);

  return (
    <div className="container">
      <div className="posts-header">
        <h1>Posts</h1>

        {estaAutenticado && (
          <button onClick={() => setModoFormulario("crear")}>
            + Nuevo post
          </button>
        )}
      </div>

      {/* Buscador */}
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar posts..."
      />

      {/* Crear o editar usando el mismo formulario */}
      {modoFormulario && (
        <FormPost
          // Si es crear enviamos null
          post={modoFormulario === "crear" ? null : modoFormulario}
          onSubmit={async (datos) => {
            try {
              // EDITAR
              if (modoFormulario !== "crear") {
                const actualizado = await postsService.update(
                  modoFormulario.slug,
                  datos,
                  token,
                );

                // Reemplaza solo el post editado
                setPosts((prev) =>
                  prev.map((p) => (p.id === actualizado.id ? actualizado : p)),
                );

                agregarToast("Post actualizado", "success");
              } else {
                // CREAR
                const nuevo = await postsService.create(datos, token);

                // Agrega el nuevo al inicio
                setPosts((prev) => [nuevo, ...prev]);

                agregarToast("Post creado", "success");
              }

              // Cierra el formulario
              setModoFormulario(null);
            } catch (err) {
              agregarToast(err.message || "Error al guardar", "error");
            }
          }}
          onCancelar={() => setModoFormulario(null)}
        />
      )}

      {/* Estados: carga / error / vacío */}
      <FeedbackEstado
        cargando={cargando}
        error={error}
        vacio={postsFiltrados.length === 0}
        mensajeCarga="Cargando posts..."
        mensajeError={error}
        mensajeVacio={
          busqueda
            ? `No hay posts que coincidan con "${busqueda}"`
            : "No hay posts publicados aún"
        }
        onReintentar={cargarPosts}
        accionVacio={estaAutenticado ? () => setModoFormulario("crear") : null}
        textoAccionVacio="Crear el primer post"
      >
        <div className="posts-grid">
          {postsFiltrados.map((post) => (
            <CardPost
              key={post.id}
              post={post}
              puedeEditar={estaAutenticado}
              onEditar={manejarEditar}
              onEliminar={manejarEliminar}
            />
          ))}
        </div>
      </FeedbackEstado>
    </div>
  );
}
