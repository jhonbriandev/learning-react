/*El patrón completo — estados + efecto + render condicional
Este es el patrón que vas a usar en casi todos los componentes que carguen datos:*/

function Posts() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function cargar() {
      try {
        setCargando(true);
        setError(null);

        const response = await fetch("/api/posts/", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        setPosts(data.results || data);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();

    return () => controller.abort();
  }, []);

  // Renderizado condicional según el estado
  if (cargando) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  if (posts.length === 0) {
    return <p>No hay posts disponibles.</p>;
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <CardPost key={post.id} post={post} />
      ))}
    </div>
  );
}

/*Conexión con lo que ya sabes
JS puro                              React con useEffect
──────────────────────────────       ────────────────────────────────
DOMContentLoaded → cargar datos      useEffect(() => { cargar() }, [])
Variable que depende de otra         useEffect(() => { ... }, [variable])
clearInterval al salir               return () => clearInterval(id)
AbortController para cancelar        return () => controller.abort()**/
