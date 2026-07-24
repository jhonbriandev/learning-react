import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { postsService } from "../services/postsService";
import { CardPost } from "../components/CardPost";
import { FormPost } from "../components/FormPost";

export function MyPosts() {
  const { token, estaAutenticado } = useAuth();
  const [posts, setPosts] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [error, setError] = useState(null); // mensaje de error, si algo falla
  const [enviando, setEnviando] = useState(false);

  // useRef para el input de búsqueda
  const inputBusquedaRef = useRef(null);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await postsService.getAll(token);
        setPosts(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [token]);

  // useMemo — solo recalcula cuando cambian posts, busqueda o filtroEstado
  const postsFiltrados = useMemo(() => {
    return posts
      .filter((p) => p.title.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((p) => filtroEstado === "todos" || p.status === filtroEstado);
  }, [posts, busqueda, filtroEstado]);

  // useCallback — funciones estables que se pasan a CardPost
  const manejarEliminar = useCallback(
    async (slug) => {
      if (!confirm("¿Eliminar este post?")) return;
      try {
        await postsService.delete(slug, token);
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
      } catch (err) {
        console.error(err.message);
      }
    },
    [token],
  );

  const manejarEditar = useCallback((post) => {
    setModoFormulario(post);
  }, []);

  async function manejarCrear(datos) {
    setEnviando(true);
    try {
      const nuevoPost = await postsService.create(datos, token);
      setPosts((prev) => [nuevoPost, ...prev]);
      setModoFormulario(null);
      // Enfocar input de búsqueda después de crear
      inputBusquedaRef.current?.focus();
    } finally {
      setEnviando(false);
    }
  }

  async function manejarGuardarEdicion(datos) {
    setEnviando(true);
    try {
      const actualizado = await postsService.update(
        modoFormulario.slug,
        datos,
        token,
      );
      setPosts((prev) =>
        prev.map((p) => (p.slug === modoFormulario.slug ? actualizado : p)),
      );
      setModoFormulario(null);
    } finally {
      setEnviando(false);
    }
  }

  console.log("Renderizando MyPosts (padre)");

  if (cargando) return <p>Cargando posts...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container">
      <div className="posts-header">
        <h1>Posts ({postsFiltrados.length})</h1>
        {estaAutenticado && !modoFormulario && (
          <button onClick={() => setModoFormulario("crear")}>
            + Nuevo post
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="filtros">
        <input
          ref={inputBusquedaRef}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar posts..."
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="published">Publicados</option>
          <option value="draft">Borradores</option>
        </select>
      </div>

      {/* Formulario crear */}
      {modoFormulario === "crear" && (
        <FormPost
          onSubmit={manejarCrear}
          onCancelar={() => setModoFormulario(null)}
          enviando={enviando}
        />
      )}
      {/* Formulario editar */}
      {modoFormulario && modoFormulario !== "crear" && (
        <FormPost
          post={modoFormulario}
          onSubmit={manejarGuardarEdicion}
          onCancelar={() => setModoFormulario(null)}
          enviando={enviando}
        />
      )}

      {/* Lista */}
      <div className="posts-grid">
        {postsFiltrados.map((post) => (
          <CardPost
            key={post.id}
            post={post}
            puedeEditar={estaAutenticado}
            onEliminar={manejarEliminar}
            onEditar={manejarEditar}
          />
        ))}
      </div>
    </div>
  );
}
