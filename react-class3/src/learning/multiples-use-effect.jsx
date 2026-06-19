/*Múltiples useEffect en un componente
Puedes tener tantos como necesites — cada uno con su propia responsabilidad:*/

function PerfilUsuario({ userId }) {
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);

  // Efecto 1 — cargar el usuario
  useEffect(() => {
    async function cargarUsuario() {
      const data = await fetch(`/api/usuarios/${userId}/`);
      setUsuario(await data.json());
    }
    cargarUsuario();
  }, [userId]);

  // Efecto 2 — cargar los posts del usuario
  useEffect(() => {
    async function cargarPosts() {
      const data = await fetch(`/api/posts/?autor=${userId}`);
      const json = await data.json();
      setPosts(json.results || json);
    }
    cargarPosts();
  }, [userId]);

  // Efecto 3 — actualizar el título de la página
  useEffect(() => {
    if (usuario) {
      document.title = `Perfil de ${usuario.nombre}`;
    }
    return () => {
      document.title = "Mi Blog"; // restaurar al salir
    };
  }, [usuario]);

  return (
    <div>
      {usuario && <h1>{usuario.nombre}</h1>}
      {posts.map((post) => (
        <CardPost key={post.id} post={post} />
      ))}
    </div>
  );
}
