// RESPONDER DUDAS

const { register, handleSubmit } = useForm();

const onValid = (data) => {
  fetch("/api/posts/", {
    method: "POST",
    body: data,
  });
};

<form onSubmit={handleSubmit(onValid)}>
  <input {...register("title")} />
</form>;

// ¿Qué falla aquí cuando el fetch llegue a Django?
// (Pista: piensa en el Content-Type y en cómo fetch espera el body).

// Hay dos observaciones, primero se espera un .json no un objeto
// Ademas tambien se espera un token porque este es un fetch de POST
