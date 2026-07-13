import useForm from "../hooks/useForm";
import { useAuth } from "../context/UseContext";
import { useNavigate } from "react-router-dom";

function validarLogin(valores) {
  const errores = {};
  if (!valores.username.trim()) errores.username = "Usuario obligatorio";
  if (valores.password.length < 8) errores.password = "Mínimo 8 caracteres";
  return errores;
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    valores,
    errores,
    enviando,
    setEnviando,
    manejarCambio,
    validarFormulario,
  } = useForm({ username: "", password: "" }, validarLogin);

  async function manejarSubmit(e) {
    e.preventDefault();
    if (!validarFormulario()) return;

    setEnviando(true);
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valores),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const { access } = await response.json();
      login({ username: valores.username }, access);
      navigate("/");
    } catch (err) {
      console.error(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={manejarSubmit}>
      <input
        name="username"
        value={valores.username}
        onChange={manejarCambio}
        placeholder="Usuario"
      />
      {errores.username && <p className="error">{errores.username}</p>}

      <input
        type="password"
        name="password"
        value={valores.password}
        onChange={manejarCambio}
        placeholder="Contraseña"
      />
      {errores.password && <p className="error">{errores.password}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
