// Estado con objetos — un solo useState para múltiples campos

// En lugar de un useState por campo
const [nombre, setNombre] = useState("");
const [email, setEmail] = useState("");
const [bio, setBio] = useState("");

// Puedes usar un solo objeto
function FormularioPerfil() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    bio: "",
  });

  // Actualizar un campo sin perder los demás
  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form, // copiar los campos actuales
      [name]: value, // actualizar solo el que cambió
    });
    // [name] es computed property — usa el valor de la variable name como clave
  }

  return (
    <form>
      <input
        name="nombre" // debe coincidir con la clave del objeto
        value={form.nombre}
        onChange={manejarCambio}
      />
      <input name="email" value={form.email} onChange={manejarCambio} />
      <textarea name="bio" value={form.bio} onChange={manejarCambio} />
    </form>
  );
}
