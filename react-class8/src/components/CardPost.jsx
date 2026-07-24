import { memo } from "react";
import { Link } from "react-router-dom";

export const CardPost = memo(function CardPost({
  post,
  onEliminar,
  onEditar,
  puedeEditar,
}) {
  console.log("Renderizando CardPost:", post.title);
  return (
    <article className="card post-card">
      <h2>{post.title}</h2>
      <p>Por {post.autor}</p>
      <span className={`badge ${post.status}`}>{post.status}</span>

      <div className="card-acciones">
        <Link to={`/posts/${post.slug}`}>Ver más</Link>
        {puedeEditar && (
          <>
            <button onClick={() => onEditar(post)}>Editar</button>
            <button onClick={() => onEliminar(post.slug)}>Eliminar</button>
          </>
        )}
      </div>
    </article>
  );
});

export default CardPost;
