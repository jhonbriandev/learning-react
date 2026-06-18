// Construye un componente FormularioPost que tenga:

// 1. Estado para estos campos con useState:
//    - titulo (string vacío inicial)
//    - contenido (string vacío inicial)
//    - categoria (string "tech" inicial)
//    - estado del post ("borrador" inicial)

// 2. Todos los inputs deben ser controlados:
//    - Input de texto para titulo
//    - Textarea para contenido
//    - Select para categoria con opciones: tech, libros, database
//    - Select para estado con opciones: borrador, publicado

// 3. Un párrafo de PREVIEW en tiempo real debajo del formulario:
//    - Muestra el titulo en un h3
//    - Muestra los primeros 100 caracteres del contenido
//    - Muestra la categoria y estado con texto:
//      "Categoría: tech | Estado: borrador"
//    - Si el titulo está vacío, muestra "Sin título" en el h3

// 4. Botón limpiar que restablezca todos los campos a sus valores iniciales
import { useState } from "react";

export function FormularioPost() {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria: "tech",
    estado: "borrador",
  });

  function manejarChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form, // copiar los campos actuales
      [name]: value,
    });
  }

  function manejarSubmit(e) {
    e.preventDefault();
    // Los datos ya están en el estado — no necesitas querySelector
    console.log(form.titulo, form.contenido, form.categoria, form.estado);
    // Puedes validar antes de enviar
    if (form.contenido.length < 3) {
      alert("Contenido muy corto");
      return;
    }
  }

  return (
    <form onSubmit={manejarSubmit}>
      <input
        name="titulo"
        type="text"
        value={form.titulo}
        onChange={manejarChange}
        placeholder="titulo"
      />
      <textarea
        name="contenido"
        value={form.contenido}
        onChange={manejarChange}
        placeholder="contenido"
      />
      <select name="categoria" value={form.categoria} onChange={manejarChange}>
        <option value="tech">Tecnología</option>
        <option value="libros">Libros</option>
        <option value="database">Database</option>
      </select>
      <select name="estado" value={form.estado} onChange={manejarChange}>
        <option value="borrador">Borrador</option>
        <option value="publicado">Publicado</option>
      </select>
      <button type="submit">Ingresar</button>
    </form>
  );
}

// 5. Contador de caracteres para el campo contenido:
//    - Muestra "X / 500 caracteres"
//    - Si pasa de 500, el texto se pone rojo
//    - El textarea no debe permitir más de 500 caracteres (maxLength)
