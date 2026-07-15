import useFetch from "../hooks/useFetch";
import CardCategory from "../components/CardCategory";
import SearchCategory from "../components/SearchCategory";
import useForm from "../hooks/useForm";

export default function Categories() {
  // Maneja el estado del buscador
  const { valores, manejarCambio } = useForm({ buscar: "" });

  // Obtiene las categorías desde la API
  const { data, cargando, error } = useFetch(
    "http://127.0.0.1:8000/api/categories/",
  );

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  // La API paginada devuelve los datos dentro de results
  const categories = data?.results || data || [];

  // Filtra categorías según el texto ingresado
  const categoriasFiltradas = categories.filter((category) =>
    category.name.toLowerCase().includes(valores.buscar.toLowerCase()),
  );

  return (
    // <ul>
    //   {/*map() recorre el arreglo categories y, por cada categoría, crea un <li> mostrando su nombre.</li>*/}
    //   {categories.map((category) => (
    //     <li key={category.id}>{category.name}</li>
    //   ))}
    // </ul>
    <>
      {/* Input de búsqueda controlado por useForm */}
      <SearchCategory value={valores.buscar} onChange={manejarCambio} />

      <ul>
        {/* Renderiza únicamente las categorías que coinciden con la búsqueda */}
        {categoriasFiltradas.map((category) => (
          <CardCategory key={category.id} category={category} />
        ))}
      </ul>
    </>
  );
}
