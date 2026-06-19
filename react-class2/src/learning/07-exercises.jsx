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

// 5. Contador de caracteres para el campo contenido:
//    - Muestra "X / 500 caracteres"
//    - Si pasa de 500, el texto se pone rojo
//    - El textarea no debe permitir más de 500 caracteres (maxLength)

import { useState } from "react";

export function FormularioPost() {
  // Estado que almacena todos los campos del formulario.
  // Cada propiedad representa un input controlado.
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria: "tech",
    estado: "borrador",
  });

  // Se ejecuta cada vez que el usuario escribe en un input,
  // textarea o cambia una opción de un select.
  function manejarChange(e) {
    // "name" identifica qué campo cambió.
    // "value" contiene el nuevo valor escrito o seleccionado.
    const { name, value } = e.target;

    setForm({
      // Copiamos el estado actual para conservar
      // las demás propiedades del formulario.
      ...form,

      // Actualizamos únicamente el campo que cambió.
      // Los corchetes indican que el nombre de la propiedad
      // proviene de la variable "name".
      [name]: value,
    });
  }

  // Se ejecuta únicamente cuando se envía el formulario.
  function manejarSubmit(e) {
    // Evita que el navegador recargue la página.
    e.preventDefault();

    // Todos los datos ya se encuentran almacenados
    // dentro del estado "form".
    console.log(form.titulo, form.contenido, form.categoria, form.estado);

    // Ejemplo de validación antes de enviar.
    if (form.contenido.length < 3) {
      alert("Contenido muy corto");
      return;
    }

    alert("Formulario enviado correctamente.");
  }

  return (
    <>
      {/* onSubmit solamente se ejecuta cuando el usuario envía el formulario */}
      <form onSubmit={manejarSubmit}>
        {/* Input controlado.
            Su valor siempre proviene del estado. */}
        <input
          name="titulo"
          type="text"
          value={form.titulo}
          onChange={manejarChange}
          placeholder="Título"
        />

        {/* Textarea controlado.
            maxLength evita escribir más de 500 caracteres. */}
        <textarea
          name="contenido"
          value={form.contenido}
          onChange={manejarChange}
          placeholder="Contenido"
          maxLength={500}
        />

        {/* Select controlado para la categoría */}
        <select
          name="categoria"
          value={form.categoria}
          onChange={manejarChange}
        >
          <option value="tech">Tecnología</option>
          <option value="libros">Libros</option>
          <option value="database">Database</option>
        </select>

        {/* Select controlado para el estado */}
        <select name="estado" value={form.estado} onChange={manejarChange}>
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
        </select>

        <button type="submit">Ingresar</button>

        {/* Cuando queremos mostrar un valor usamos form.titulo porque necesitamos
        decirle a React "ve a buscar lo que hay guardado en titulo" Cuando
        queremos resetear usamos solo titulo: "" porque le estámos diciendo "crea un
        campo llamado titulo con valor vacío" — aquí no importa lo que había
        antes */}
        <button
          type="button"
          onClick={() =>
            setForm({
              titulo: "",
              contenido: "",
              categoria: "tech",
              estado: "borrador",
            })
          }
        >
          Limpiar
        </button>
      </form>

      <h2>PREVIEW</h2>

      <div>
        <h2>Título</h2>

        {/* Si el usuario no escribió un título,
            mostramos un texto por defecto. */}
        {form.titulo ? <h3>{form.titulo}</h3> : <h3>Sin título</h3>}

        <h2>Contenido</h2>

        {/* Solo mostramos los primeros 100 caracteres
            como vista previa. */}
        <p>{form.contenido.slice(0, 100)}</p>

        {/* Contador de caracteres.
            Gracias a maxLength nunca superará los 500. */}
        <h4>{form.contenido.length} / 500 caracteres</h4>

        {/* Información adicional del formulario */}
        <p>
          Categoría: {form.categoria} | Estado: {form.estado}
        </p>
      </div>
    </>
  );
}
