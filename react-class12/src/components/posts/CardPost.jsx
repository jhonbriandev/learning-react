import { memo } from "react";
import { Link } from "react-router-dom";
import { Boton } from "../ui/Boton";

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
            <Boton onClick={() => onEditar(post)}>Editar</Boton>
            <Boton onClick={() => onEliminar(post.slug)}>Eliminar</Boton>
          </>
        )}
      </div>
    </article>
  );
});

export default CardPost;
