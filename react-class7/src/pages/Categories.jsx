import CardCategory from "../components/CardCategory";
import { useCategories } from "../context/CategoriesContext";

export default function Categories() {
  const { categorias, cargando, error } = useCategories();

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {categorias.map((category) => (
        <CardCategory key={category.id} category={category} />
      ))}
    </ul>
  );
}
