// CORREGIR

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

<form onSubmit={handleSubmit(onValid)}>
  <select {...register("category")}>
    <option value="tech">Tecnología</option>
    <option value="life">Vida</option>
  </select>
</form>;

// Se retira onChange={(e) => console.log(e.target.value)}
// Porque register ya maneja el onchange
