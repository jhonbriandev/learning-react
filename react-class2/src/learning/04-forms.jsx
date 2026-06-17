// Formularios controlados — el concepto más importante del día
// En HTML normal, el input maneja su propio valor internamente.
// En React, tú controlas el valor del input con el estado — por eso se llama componente controlado.

// Input NO controlado — el DOM maneja el valor
<input type="text" />;
// Para leer el valor necesitas ref o querySelector — no es el patrón React

// Input CONTROLADO — React maneja el valor
function InputControlado() {
  const [valor, setValor] = useState("");

  return (
    <input
      type="text"
      value={valor} // React controla qué muestra el input
      onChange={(e) => setValor(e.target.value)} // actualiza el estado
    />
  );
}
// ¿Por qué formularios controlados?

function FormularioLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function manejarSubmit(e) {
    e.preventDefault();
    // Los datos ya están en el estado — no necesitas querySelector
    console.log(username, password);
    // Puedes validar antes de enviar
    if (username.length < 3) {
      alert("Usuario muy corto");
      return;
    }
    // enviar al backend...
  }

  return (
    <form onSubmit={manejarSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}
// La ventaja sobre JS puro: no necesitas document.querySelector('#username').value —
// el valor siempre está en el estado, disponible en cualquier parte del componente.
