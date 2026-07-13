// En cualquier componente
import useLocalStorage from "../hooks/useLocalStorage";

export default function Preferences() {
  const [tema, setTema, eliminarTema] = useLocalStorage("tema", "claro");

  return (
    <div>
      <p>Tema actual: {tema}</p>
      <button onClick={() => setTema("oscuro")}>Modo oscuro</button>
      <button onClick={() => setTema("claro")}>Modo claro</button>
      <button onClick={eliminarTema}>Restablecer</button>
    </div>
  );
}
