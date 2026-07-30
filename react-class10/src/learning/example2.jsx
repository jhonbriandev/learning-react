function CardPostDetalle({ postId }) {
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/${postId}/`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setStatus("success");
      });
  }, [postId]);

  if (status === "loading") return <p>Cargando...</p>;
  return <h3>{post.titulo}</h3>;
}
// DETALLAR ERRORES

// Se define res y data como arrow functions no es error pero es algo dif a lo que uso,
// No se define nunca el response ok no tendriamos como saber los tipos de erroes silenciosos
// Si post fuera null no veriamos nunca su titulo
// Si se va el internet el status quedara en loading de manera eterna, nunca lo sabremos
// No se rompe el app pero no vamos a ver que paso hasta que veamos consola
