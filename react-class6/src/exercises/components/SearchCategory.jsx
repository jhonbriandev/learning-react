// Componente de búsqueda.
// Recibe el valor actual y la función para actualizarlo desde Categories.
export default function SearchCategory({ value, onChange }) {
  return <input name="buscar" value={value} onChange={onChange} />;
}
