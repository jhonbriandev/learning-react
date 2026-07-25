import { Link } from "react-router-dom";
import { FormPost } from "../pages/FormPost";

export function CardPost({
  post,
  modoEdicion = false,
  onEditar,
  onCancelarEdicion,
  onGuardarEdicion,
  onEliminar,
  enviando,
  puedeEditar = false,
}) {
  // --- BLOQUE 1: modo edición ---
  // Si esta card está en modo edición, en vez de mostrar el post,
  // mostramos el formulario para modificarlo (edición "inline").
  if (modoEdicion) {
    return (
      <div className="card card-edicion">
        <FormPost
          postInicial={post}
          onSubmit={onGuardarEdicion}
          onCancelar={onCancelarEdicion}
          enviando={enviando}
        />
      </div>
    );
  }

  // --- BLOQUE 2: vista normal de la card ---
  return (
    <article className="card post-card">
      <h2>{post.title}</h2>
      <p className="post-autor">Por {post.author_name}</p>

      {/* Antes mostrábamos post.status, pero la API no lo expone.
          Usamos created_at, que sí viene en la respuesta, y lo
          formateamos para que sea legible (ej: "17 jul 2026" en vez
          del string ISO crudo "2026-07-17T00:29:53.391068Z"). */}
      <span className="badge">
        {new Date(post.created_at).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>

      {/* --- BLOQUE 3: acciones --- */}
      <div className="card-acciones">
        <Link to={`/posts/${post.slug}`}>Ver más</Link>

        {/* Solo se muestran los botones de editar/eliminar si el usuario
            autenticado es el dueño del post (puedeEditar viene de MyPosts,
            calculado a partir de estaAutenticado). */}
        {puedeEditar && (
          <>
            <button onClick={onEditar}>Editar</button>
            <button onClick={onEliminar} className="btn-danger">
              Eliminar
            </button>
          </>
        )}
      </div>
    </article>
  );
}
