// Hacer que la lista conserve todas las tareas agregadas.

import { useState, useCallback } from "react";

export default function Tareas() {
  // Estado inicial:
  // tareas = []
  const [tareas, setTareas] = useState([]);

  // useCallback crea esta función una sola vez.
  // Como no dependemos directamente de "tareas",
  // podemos dejar las dependencias vacías [].
  const agregarTarea = useCallback((texto) => {
    // Usamos la actualización funcional.
    // React nos entrega el estado anterior más reciente en "prev".
    setTareas((prev) => {
      // Copiamos todas las tareas anteriores
      // y agregamos la nueva tarea al final.
      return [...prev, texto];
    });
  }, []);

  return (
    <div>
      <button onClick={() => agregarTarea("Estudiar React")}>
        Agregar Tarea 1
      </button>

      <button onClick={() => agregarTarea("Estudiar Python")}>
        Agregar Tarea 2
      </button>

      <button onClick={() => agregarTarea("Estudiar JS")}>
        Agregar Tarea 3
      </button>

      <ul>
        {tareas.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

// ======================================================
// EXPLICACIÓN
// ======================================================

// Al inicio:
// tareas = []

// Click 1:
// prev = []
// texto = "Estudiar React"
// nuevo estado = ["Estudiar React"]

// Click 2:
// prev = ["Estudiar React"]
// texto = "Estudiar Python"
// nuevo estado = [
//   "Estudiar React",
//   "Estudiar Python"
// ]

// Click 3:
// prev = [
//   "Estudiar React",
//   "Estudiar Python"
// ]
// texto = "Estudiar JS"
// nuevo estado = [
//   "Estudiar React",
//   "Estudiar Python",
//   "Estudiar JS"
// ]

// ======================================================
// IDEA CLAVE
// ======================================================

// ❌ Incorrecto:
// setTareas([...tareas, texto])

// Porque la función puede quedarse usando
// un valor viejo de tareas por closure.

// ✅ Correcto:
// setTareas(prev => [...prev, texto])

// Porque React entrega el estado anterior real
// y construimos el nuevo estado a partir de él.
