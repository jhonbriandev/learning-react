// Dependencias — cuándo usar cada una

function BuscadorPosts({ autorId }) {
  const [posts, setPosts] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Se ejecuta cuando autorId cambia — props como dependencia
  useEffect(() => {
    async function cargar() {
      const data = await fetch(`/api/posts/?autor=${autorId}`);
      const json = await data.json();
      setPosts(json.results || json);
    }
    cargar();
  }, [autorId]); // cada vez que el padre cambia autorId, recarga

  // Se ejecuta cuando busqueda cambia — estado como dependencia
  useEffect(() => {
    if (!busqueda.trim()) return;

    async function buscar() {
      const data = await fetch(`/api/posts/?search=${busqueda}`);
      const json = await data.json();
      setPosts(json.results || json);
    }
    buscar();
  }, [busqueda]); // cada vez que el usuario escribe, busca

  return (
    <div>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar posts..."
      />
      {posts.map((post) => (
        <CardPost key={post.id} post={post} />
      ))}
    </div>
  );
}
