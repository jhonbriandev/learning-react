// El mismo hook sirve para Posts, PostDetalle, Categorias, Usuarios —
// cualquier componente que necesite datos de la API.

import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export function PostDetail() {
  const { slug } = useParams();

  // La URL cambia con el slug — useFetch se re-ejecuta automáticamente
  const {
    data: post,
    cargando,
    error,
  } = useFetch(`http://127.0.0.1:8000/api/posts/${slug}/`);

  if (cargando) return <p>Cargando post...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <article>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
    </article>
  );
}
