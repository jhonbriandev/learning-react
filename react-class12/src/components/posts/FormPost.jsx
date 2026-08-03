import { useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import { useCategories } from "../../context/CategoriesContext";

// Valores por defecto cuando el formulario se usa para CREAR un post nuevo.
// Si estuviéramos editando, estos valores se sobreescriben con el post real
// (ver el useEffect más abajo).
const VALORES_INICIALES = {
  title: "",
  content: "",
  category: "",
  status: "draft",
};

// Función de validación que recibe useForm.
// Se ejecuta cada vez que el usuario intenta enviar el formulario.
function validar(valores) {
  const errores = {};
  if (!valores.title.trim()) errores.title = "El título es obligatorio";
  if (valores.content.length < 10) errores.content = "Mínimo 10 caracteres";
  return errores;
}

export function FormPost({
  postInicial = null, // Si viene un post, el formulario entra en modo "editar"
  onSubmit,
  onCancelar,
  enviando,
}) {
  // --- BLOQUE 1: manejo del formulario ---
  // useForm centraliza el estado de los campos (valores), los errores de
  // validación y las funciones para modificarlos. Así evitamos escribir
  // un useState por cada input del formulario.
  const {
    valores,
    errores,
    manejarCambio,
    validarFormulario,
    resetear,
    setValores,
  } = useForm(postInicial || VALORES_INICIALES, validar);

  // --- BLOQUE 2: categorías desde el Context (sin fetch propio) ---
  // Antes, este componente pedía las categorías con su propio useFetch,
  // duplicando la misma petición que ya hace Categories.jsx.
  // Ahora simplemente "leemos" la lista que el CategoriesProvider ya cargó
  // una sola vez al iniciar la app. Analogía: en vez de llamar de nuevo
  // a la tienda para preguntar el precio, leemos el pizarrón compartido
  // de la oficina donde ya está anotado.
  const { categorias, cargando: cargandoCategorias } = useCategories();

  // --- BLOQUE 3: cargar datos si es modo edición ---
  // Cuando FormPost recibe un postInicial (por ejemplo, al hacer clic en
  // "Editar" desde CardPost), este efecto copia esos datos al formulario.
  useEffect(() => {
    if (postInicial) {
      setValores({
        ...postInicial,
        // El backend puede devolver category como un objeto completo
        // { id, name, slug }. React no puede "dibujar" un objeto en un
        // <select>, así que nos quedamos solo con el id (un número/string
        // simple), que es lo que el <select> y el backend esperan.
        category: postInicial.category_name?.id ?? "",
      });
    }
  }, [postInicial]);

  // --- BLOQUE 4: envío del formulario ---
  function manejarSubmit(e) {
    e.preventDefault(); // Evita que el navegador recargue la página
    if (!validarFormulario()) return; // Si hay errores, no continúa
    onSubmit(valores); // Le pasa los datos al componente padre (MyPosts)
  }
  console.log("postInicial completo:", postInicial);
  return (
    <form onSubmit={manejarSubmit}>
      {/* --- BLOQUE 5: campo título --- */}
      <div>
        <input
          name="title"
          value={valores.title}
          onChange={manejarCambio}
          placeholder="Título del post"
        />
        {errores.title && <p className="error">{errores.title}</p>}
      </div>

      {/* --- BLOQUE 6: campo contenido --- */}
      <div>
        <textarea
          name="content"
          value={valores.content}
          onChange={manejarCambio}
          placeholder="Contenido"
          rows={6}
        />
        {errores.content && <p className="error">{errores.content}</p>}
      </div>

      {/* --- BLOQUE 7: select de categorías --- */}
      {/* Mientras cargandoCategorias sea true, mostramos un solo option
          deshabilitado para que el usuario sepa que todavía se están
          trayendo los datos, en vez de ver un select vacío sin explicación. */}
      <select name="category" value={valores.category} onChange={manejarCambio}>
        <option value="">
          {cargandoCategorias
            ? "Cargando categorías..."
            : "Seleccionar categoría"}
        </option>
        {categorias.map((cat) => (
          // value={cat.id}: lo que se guarda y se envía al backend (un id)
          // {cat.name}: lo que el usuario ve en pantalla (un texto)
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* --- BLOQUE 8: select de estado --- */}
      <select name="status" value={valores.status} onChange={manejarCambio}>
        <option value="draft">Borrador</option>
        <option value="published">Publicado</option>
      </select>

      {/* --- BLOQUE 9: botones de acción --- */}
      <div className="form-acciones">
        <button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : postInicial ? "Actualizar" : "Crear"}
        </button>
        {onCancelar && (
          <button type="button" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
