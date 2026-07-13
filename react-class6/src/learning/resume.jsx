// Sin custom hook — lógica repetida en cada componente
function Posts() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/posts/")
      .then((r) => r.json())
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  // ... mismo bloque en Categorias, Usuarios, etc.
}

// Con custom hook — una sola vez, reutilizable
function Posts() {
  const { data, cargando, error } = useFetch("/api/posts/");
  // Tres líneas en lugar de quince
}

// Reglas de los custom hooks
// Las mismas reglas de todos los hooks aplican aquí:

// 1. El nombre DEBE empezar con "use"
function useFetch() {} // ✅
function fetchData() {} // ❌ — React no lo trata como hook

// 2. Solo se pueden llamar en el nivel superior de un componente
//    o de otro custom hook — nunca dentro de if, for, o callbacks

// 3. Pueden usar cualquier hook de React internamente
//    useState, useEffect, useContext, useReducer, etc.

// 4. Pueden recibir parámetros y retornar cualquier cosa
//    — objetos, arrays, funciones, valores primitivos
