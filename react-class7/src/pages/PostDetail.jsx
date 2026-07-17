import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { postsService } from "../services/postsService";

export default function PostDetail() {
  // --- BLOQUE 1: datos de sesión y de la URL ---
  // token: lo necesitamos porque este detalle apunta a /my-posts/:slug/,
  // un endpoint privado (solo el dueño del post puede verlo).
  // slug: viene de la URL, ej. /posts/mi-primer-post -> slug = "mi-primer-post"
  const { token } = useAuth();
  const { slug } = useParams();

  // --- BLOQUE 2: estado local del componente ---
  const [post, setPost] = useState(null); // acá guardamos el post una vez cargado
  const [cargando, setCargando] = useState(true); // true mientras esperamos la respuesta
  const [error, setError] = useState(null); // mensaje de error, si algo falla

  // --- BLOQUE 3: petición a la API ---
  // Se ejecuta cuando el componente se monta, y se vuelve a ejecutar si
  // cambia slug (el usuario navega a otro post) o token (el usuario
  // inicia/cierra sesión mientras está en la página).
  useEffect(() => {
    async function cargar() {
      try {
        // Importante: le pasamos slug Y token. Sin el token, el backend
        // responde 403 porque /my-posts/:slug/ es un endpoint privado
        // que necesita saber quién sos para verificar que el post es tuyo.
        const data = await postsService.getOne(slug, token);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        // finally se ejecuta siempre, haya salido bien o mal la petición,
        // así garantizamos que "cargando" se apague en cualquier caso.
        setCargando(false);
      }
    }
    cargar();
  }, [slug, token]);

  // --- BLOQUE 4: estados de carga y error ---
  // Cortamos el render acá si todavía no hay datos o si algo falló,
  // para no intentar mostrar post.title cuando post todavía es null.
  if (cargando) return <p>Cargando post...</p>;
  if (error) return <p>Error: {error}</p>;

  // --- BLOQUE 5: contenido del post ---
  return (
    <article>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
    </article>
  );
}
