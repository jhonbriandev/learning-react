import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { postsService } from "../services/postsService";
import { CardPost } from "../components/CardPost";
import { FormPost } from "../components/FormPost";
import { Feedback } from "../learning/Feedback";

export function MyPosts() {
  const { token, estaAutenticado } = useAuth();

  // ============================
  // Estados
  // ============================

  const [posts, setPosts] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Estado de carga
  const [cargando, setCargando] = useState(true);

  // Estado de error
  const [error, setError] = useState(null);

  // Estado del formulario
  const [modoFormulario, setModoFormulario] = useState(null);

  // Estado del botón enviar
  const [enviando, setEnviando] = useState(false);

  // Referencia al input de búsqueda
  const inputBusquedaRef = useRef(null);

  // ============================
  // Estado derivado
  // ============================
  // No hace falta guardarlo en un useState.
  // Se calcula automáticamente según cargando y error.

  const status = cargando ? "loading" : error ? "error" : "success";

  // ============================
  // Cargar posts
  // ============================

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

  // ============================
  // useMemo
  // Solo recalcula cuando cambian
  // posts, búsqueda o filtro.
  // ============================

  const postsFiltrados = useMemo(() => {
    return posts
      .filter((p) => p.title.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((p) => filtroEstado === "todos" || p.status === filtroEstado);
  }, [posts, busqueda, filtroEstado]);

  // ============================
  // Eliminar
  // ============================

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

  // ============================
  // Editar
  // ============================

  const manejarEditar = useCallback((post) => {
    setModoFormulario(post);
  }, []);

  // ============================
  // Crear
  // ============================

  async function manejarCrear(datos) {
    setEnviando(true);

    try {
      const nuevoPost = await postsService.create(datos, token);

      setPosts((prev) => [nuevoPost, ...prev]);

      setModoFormulario(null);

      // Después de crear un post
      // vuelve a enfocar el buscador

      inputBusquedaRef.current?.focus();
    } finally {
      setEnviando(false);
    }
  }

  // ============================
  // Guardar edición
  // ============================

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

  // =====================================================
  // PROBAR EL ERROR BOUNDARY
  // =====================================================
  // Descomenta estas líneas para comprobar que funciona.
  //
  //throw new Error("Probando ErrorBoundary");
  //
  // También puedes probar:
  //
  // const post = null;
  // console.log(post.title);
  //
  // o
  //
  // const post = null;
  // return <h1>{post.title}</h1>;
  //
  // Si ErrorBoundary está bien configurado,
  // debería aparecer la pantalla de error
  // en lugar de romper toda la aplicación.
  // =====================================================

  // ============================
  // Feedback
  // ============================

  // Mientras carga...

  if (status === "loading") {
    return <Feedback status={status} loadingText="Cargando tus posts..." />;
  }

  // Si hubo un error de la API...

  if (status === "error") {
    return <Feedback status={status} errorMsg={error} />;
  }

  console.log("Renderizando MyPosts");

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

      {/* ============================
          Filtros
      ============================ */}

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

      {/* ============================
          Formulario Crear
      ============================ */}

      {modoFormulario === "crear" && (
        <FormPost
          onSubmit={manejarCrear}
          onCancelar={() => setModoFormulario(null)}
          enviando={enviando}
        />
      )}

      {/* ============================
          Formulario Editar
      ============================ */}

      {modoFormulario && modoFormulario !== "crear" && (
        <FormPost
          post={modoFormulario}
          onSubmit={manejarGuardarEdicion}
          onCancelar={() => setModoFormulario(null)}
          enviando={enviando}
        />
      )}

      {/* ============================
          Lista de Posts
      ============================ */}

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
