import { Link } from "react-router-dom";
// Sin Outlet: Post no tiene rutas hijas anidadas

import { useState, useEffect } from "react";

function Post() {
  const [posts, setPosts] = useState([]); // Lista completa de posts (array)

  useEffect(() => {
    async function loadPosts() {
      const response = await fetch("http://127.0.0.1:8000/api/posts/");
      const data = await response.json();
      setPosts(data.results); // "results": la API pagina la respuesta
    }

    loadPosts();
  }, []); // [] = se ejecuta solo al montar el componente

  return (
    <div>
      {posts.map((post) => (
        // posts = la lista completa | post = un elemento individual, generado por .map()
        // Por eso post SÍ tiene .id, .title, .slug (son datos de un post específico)
        <Link key={post.slug} to={`/post/${post.slug}`}>
          <p>{post.title}</p>
        </Link>
      ))}
    </div>
  );
}

export default Post;
