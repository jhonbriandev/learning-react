/*EJERCICIO 1
import Badge from "./learning/07-exercises.jsx";
import "./App.css";

function App() {
  return <Badge estado="publicado" />;
}

export default App;*/

// ─────────────────────────────────────────────
// ARCHIVO PRINCIPAL: App.jsx
// Punto de entrada de la aplicación
// ─────────────────────────────────────────────

// Importa el componente CardPost desde el otro archivo
// Las llaves {} son obligatorias porque allá usamos "export function" (no "export default")
import { CardPost } from "./learning/07-exercises.jsx";

// Importa los estilos globales (aquí deben estar "color-publicado" y "color-borrador")
import "./App.css";

// Componente principal que React busca para arrancar la app
function App() {
  return (
    // Usa CardPost pasándole los datos como atributos (props)
    <CardPost
      titulo="Carro"
      autor="Juan"
      fecha="13/06/2026"
      estado="publicado"
    />
  );
}

// "export default" → exporta App como el componente principal del archivo
export default App;
