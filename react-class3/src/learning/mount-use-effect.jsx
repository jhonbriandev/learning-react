/*Ciclo de vida del componente

React tiene tres momentos importantes en la vida de un componente:

MONTAR   → el componente aparece en la pantalla por primera vez
ACTUALIZAR → el estado o props cambian, el componente re-renderiza
DESMONTAR → el componente desaparece de la pantalla*/

useEffect(() => {
  console.log("Componente montado"); // se ejecuta al montar

  return () => {
    console.log("Componente desmontado"); // se ejecuta al desmontar
    // Esto es la función de cleanup
  };
}, []);

/*Fetch de datos al montar — el uso más común
Este es el patrón que usarás en casi todos tus componentes:*/

function ListaPosts() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarPosts() {
      try {
        const response = await fetch("http://localhost:8000/api/posts/");

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarPosts();
  }, []); // [] — solo carga una vez al montar

  if (cargando) return <p>Cargando posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {posts.map((post) => (
        <CardPost key={post.id} post={post} />
      ))}
    </div>
  );
}
// ¿Por qué la función async va dentro del useEffect y no directamente?
// Incorrecto — useEffect no puede recibir función async directamente
useEffect(async () => {
  const data = await fetch("http://localhost:8000/api/posts/");
}, []);
// useEffect espera que la función retorne una función de cleanup o nada
// async siempre retorna una Promise — eso rompe el cleanup

// Correcto — definir la función async dentro y llamarla
useEffect(() => {
  async function cargar() {
    const data = await fetch("http://localhost:8000/api/posts/");
  }
  cargar(); // llamar sin await
}, []);
