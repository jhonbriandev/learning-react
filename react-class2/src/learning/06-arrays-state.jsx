//Estado con arrays — agregar y eliminar elementos

function ListaTareas() {
  const [tareas, setTareas] = useState([
    { id: 1, texto: "Aprender React", completada: false },
    { id: 2, texto: "Hacer ejercicio", completada: true },
  ]);
  const [nuevaTarea, setNuevaTarea] = useState("");

  // Agregar — crear nuevo array con el elemento nuevo
  function agregarTarea() {
    if (!nuevaTarea.trim()) return;

    const tarea = {
      id: Date.now(), // ID único basado en timestamp
      texto: nuevaTarea,
      completada: false,
    };

    setTareas([...tareas, tarea]); // nuevo array con la tarea agregada
    setNuevaTarea(""); // limpiar el input
  }

  // Eliminar — filtrar el array sin el elemento eliminado
  function eliminarTarea(id) {
    setTareas(tareas.filter((t) => t.id !== id));
  }

  // Actualizar — map que modifica el elemento específico
  function toggleCompletada(id) {
    setTareas(
      tareas.map((t) =>
        t.id === id ? { ...t, completada: !t.completada } : t,
      ),
    );
  }

  return (
    <div>
      <div>
        <input
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            <span
              style={{
                textDecoration: tarea.completada ? "line-through" : "none",
              }}
            >
              {tarea.texto}
            </span>
            <button onClick={() => toggleCompletada(tarea.id)}>
              {tarea.completada ? "Deshacer" : "Completar"}
            </button>
            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
