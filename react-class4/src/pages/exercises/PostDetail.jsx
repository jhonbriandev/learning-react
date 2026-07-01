import { Link, useParams, useNavigate } from "react-router-dom";
// useParams: lee el slug desde la URL. Link y useNavigate no se usan aquí.

import { useState, useEffect } from "react";

function PostDetail() {
  const { slug } = useParams();
  // Extrae el valor dinámico de la URL (ej: /post/mi-post -> slug = "mi-post")
  // Debe coincidir EXACTO con el nombre usado en la ruta (:slug)

  const navigate = useNavigate(); // Sin uso actual

  const [postDetail, setPostDetail] = useState();
  // undefined al inicio: la API devuelve UN objeto (no un array), por eso
  // no arrancamos con [] como en Post.jsx

  useEffect(() => {
    async function loadPostDetail() {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${slug}/`);
      const data = await response.json();
      console.log(data); // Revisa aquí la forma real del objeto que llega
      setPostDetail(data); // Sin ".results": pedimos un solo post, no una lista paginada
    }

    loadPostDetail();
  }, [slug]);
  // [slug] como dependencia: si el usuario navega a otro post
  // (ej: de /post/a a /post/b) sin recargar, vuelve a hacer fetch con el nuevo slug

  if (!postDetail) {
    return <p>Cargando...</p>;
  }
  // Mientras el fetch no termina, postDetail es undefined.
  // Sin esta validación, "postDetail.title" tiraría error
  // (no se puede leer una propiedad de algo que no existe todavía)

  return (
    <div>
      {/* postDetail ya es UN objeto (no un array), por eso accedemos
          directo a sus propiedades sin necesitar .map() */}
      <h1>{postDetail.title}</h1>
      <p>{postDetail.content}</p>
    </div>
  );
}

export default PostDetail;
