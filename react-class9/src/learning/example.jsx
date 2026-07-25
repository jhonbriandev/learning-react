// AGREGAR LO QUE FALTABA

// Importacion
import { useForm } from "react-hook-form";
import { useState } from "react";

export function FormPost() {
  const [title, setTitle] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    //Agregamos lo que faltaba
    reset,
  } = useForm();

  const onValid = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("title", { required: "Obligatorio" })}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {errors.title && <span>{errors.title.message}</span>}

      <button type="submit">Publicar</button>
    </form>
  );
}
// Explicar por que no conviven value y register ademas porque errors.title.message
// No es necesario, register ya lo tiene incluido
// Errors title es un objeto completo, en cambio .message es una parte del objeto que podria ser un array o string
