import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { postsService } from "../services/postsService";
import { FeedbackEstado } from "../components/feedback/FeedbackEstado";
import { CardPost } from "../components/CardPost";
import { FormPost } from "./FormPost";
import "../index.css";

export function MyPost() {
  const { token, estaAutenticado } = useAuth();
  const { agregarToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [modoFormulario, setModoFormulario] = useState(null);

  // Carga inicial de posts.
  // NOTA: pendiente de revisión — ¿debe "token" estar en el array de dependencias?
  // Ver discusión: si el usuario puede hacer login SIN recargar esta página,
  // este efecto no se re-ejecutaría y cargarPosts seguiría usando un token viejo (closure obsoleto).
  useEffect(() => {
    console.log("Token usado en este fetch:", token);
    cargarPosts();
  }, [token]);

  async function cargarPosts() {
    setCargando(true);
    setError(null);
    try {
      const data = await postsService.getAll(token);
      setPosts(data.results || data); // soporta respuesta paginada o lista simple
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  // useMemo: evita recalcular el filtrado en cada render si posts/busqueda no cambiaron
  const postsFiltrados = useMemo(
    () =>
      posts.filter((p) =>
        p.title.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [posts, busqueda],
  );

  // useCallback: mantiene la misma referencia de función entre renders
  // (útil si CardPost está memoizado con React.memo)
  const manejarEliminar = useCallback(
    async (slug) => {
      if (!confirm("¿Eliminar este post?")) return;
      try {
        await postsService.delete(slug, token);
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        agregarToast("Post eliminado", "success");
      } catch {
        agregarToast("Error al eliminar", "error");
      }
    },
    [token, agregarToast],
  );

  // ⚠️ PRUEBA TEMPORAL del ErrorBoundary — quitar antes de continuar
  //throw new Error("");

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

      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar posts..."
      />

      {modoFormulario === "crear" && (
        <FormPost
          onSubmit={async (datos) => {
            const nuevo = await postsService.create(datos, token);
            setPosts((prev) => [nuevo, ...prev]);
            setModoFormulario(null);
            agregarToast("Post creado exitosamente", "success");
          }}
          onCancelar={() => setModoFormulario(null)}
        />
      )}

      {/* FeedbackEstado centraliza los 3 estados: cargando / error / vacío */}
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
              onEliminar={manejarEliminar}
            />
          ))}
        </div>
      </FeedbackEstado>
    </div>
  );
}
