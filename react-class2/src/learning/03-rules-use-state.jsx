// REGLA 1 — Solo en componentes funcionales o custom hooks
import { useState } from "react";

export function MiComponente() {
  const [valor, setValor] = useState(0); // ✅
}

// ❌ No en funciones normales fuera de componentes
function funcionNormal() {
  const [valor, setValor] = useState(0); // ❌ Error
}

// REGLA 2 — Siempre al nivel superior del componente
// No dentro de if, for, o funciones anidadas
function MiComponente2() {
  // ✅ Correcto — siempre en el mismo orden
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);

  // ❌ Incorrecto — condicional rompe el orden
  if (condicion) {
    const [algo, setAlgo] = useState("");
  }
}

// REGLA 3 — El setter reemplaza el valor, no lo modifica
const [lista, setLista] = useState([1, 2, 3]);

// ❌ Incorrecto — mutar el estado directamente
lista.push(4);
setLista(lista);

// ✅ Correcto — crear un nuevo array
setLista([...lista, 4]);

// Múltiples estados en un componente

function FormularioPost() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [estado, setEstado] = useState("borrador");
  const [enviando, setEnviando] = useState(false);

  return (
    <form>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título del post"
      />
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder="Contenido"
      />
      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="borrador">Borrador</option>
        <option value="publicado">Publicado</option>
      </select>
    </form>
  );
}
