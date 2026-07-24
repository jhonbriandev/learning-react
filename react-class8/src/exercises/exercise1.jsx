function Dashboard() {
  const [tema, setTema] = useState("claro");
  const [usuarios, setUsuarios] = useState([]);

  // ⚠️ Función normal: se crea NUEVA en cada render de Dashboard
  function saludar(nombre) {
    alert(`Hola ${nombre}`);
  }

  return (
    <div>
      {/* Al cambiar el tema, Dashboard se re-renderiza completo */}
      <button onClick={() => setTema(tema === "claro" ? "oscuro" : "claro")}>
        Cambiar tema
      </button>
      {/* onSaludar={saludar} le pasa una referencia NUEVA cada vez */}
      <ListaUsuarios usuarios={usuarios} onSaludar={saludar} />
    </div>
  );
}

// memo compara props anteriores vs nuevos, pero...
const ListaUsuarios = memo(function ListaUsuarios({ usuarios, onSaludar }) {
  console.log("Renderizando lista");
  // ⚠️ ...como onSaludar SIEMPRE llega "distinta", memo nunca detecta
  // que sea igual, y re-renderiza en cada cambio de tema (bug)
  return usuarios.map((u) => (
    <div key={u.id} onClick={() => onSaludar(u.nombre)}>
      {u.nombre}
    </div>
  ));
});
