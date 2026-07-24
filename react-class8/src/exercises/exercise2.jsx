import { useState, useCallback, memo } from "react";

export function Dashboard2() {
  const [tema, setTema] = useState("claro");
  const [usuarios, setUsuarios] = useState([]);

  // ✅ useCallback: esta función se crea UNA sola vez ([] = sin dependencias)
  // y se reutiliza la misma referencia en cada render de Dashboard2
  const saludar = useCallback((nombre) => {
    alert(`Hola ${nombre}`);
  }, []);

  return (
    <div>
      <button onClick={() => setTema(tema === "claro" ? "oscuro" : "claro")}>
        Cambiar tema
      </button>
      {/* onSaludar ahora es SIEMPRE la misma función en memoria */}
      <ListaUsuarios usuarios={usuarios} onSaludar={saludar} />
    </div>
  );
}

// ✅ memo ahora sí puede hacer su trabajo: compara props, ve que
// onSaludar es idéntica a la anterior, y NO re-renderiza al cambiar el tema
const ListaUsuarios = memo(function ListaUsuarios({ usuarios, onSaludar }) {
  console.log("Renderizando lista");
  return usuarios.map((u) => (
    <div key={u.id} onClick={() => onSaludar(u.nombre)}>
      {u.nombre}
    </div>
  ));
});
