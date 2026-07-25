// 1( PARTES DEL HOOK USEFORM

import { useForm } from "react-hook-form";

function FormPost() {
  const {
    register, // (A)
    handleSubmit, // (B)
    formState: { errors }, // (C)
    reset, // (D)
  } = useForm();

  // ...
}

// (A) register — Es la función que "conecta" un input al secretario.
// Le dices el nombre del campo y opcionalmente las reglas de validación:
<input {...register("title", { required: "El título es obligatorio" })} />;
// El {...register("title", {...})} es un spread de props: register devuelve internamente un objeto como
// { name, onChange, onBlur, ref }, y el spread {...} los coloca todos en el <input> de una sola vez.
// Tú no tocas onChange manualmente — el secretario ya se encargó.

// (B) handleSubmit — Envuelve tu función de envío. Antes de ejecutarla, valida TODOS los campos.
// Si algo falla, no llama a tu función; si todo está bien, te entrega los datos ya limpios:
<form onSubmit={handleSubmit(onValid)}></form>;

// (C) formState: { errors } — Es un objeto que contiene los errores de validación,
// indexado por nombre de campo: errors.title, errors.content, etc.

// (D) reset — Limpia el formulario (útil después de crear un post exitosamente).

// 2) VALIDACIONES

register("title", {
  required: "El título es obligatorio",
  minLength: {
    value: 5,
    message: "El título debe tener al menos 5 caracteres",
  },
});

// 3) MOSTRANDO ERRORES

<input {...register("title", { required: "El título es obligatorio" })} />;
{
  errors.title && <span className="error">{errors.title.message}</span>;
}

//Por qué errors.title?.message y no errors.title: errors.title es un objeto completo ({ type, message }).
// Si intentas renderizar el objeto directo, React te tira un error.
// Necesitas la propiedad .message para mostrar el texto.
