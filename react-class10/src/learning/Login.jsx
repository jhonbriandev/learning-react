import { useForm } from "../hooks/useForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Función de validación "de campos": revisa que username y password
// tengan formato correcto ANTES de siquiera intentar mandar la petición
// al backend. Esto ahorra viajes innecesarios a la API.
function validarLogin(valores) {
  const errores = {};
  if (!valores.username.trim()) errores.username = "Usuario obligatorio";
  if (valores.password.length < 8) errores.password = "Mínimo 8 caracteres";
  return errores;
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Este estado es DISTINTO a "errores" (que maneja useForm). Este
  // guarda el error que devuelve el SERVIDOR (credenciales incorrectas),
  // no errores de formato de los campos.
  const [errorLogin, setErrorLogin] = useState(null);

  const {
    valores,
    errores,
    enviando,
    setEnviando,
    manejarCambio,
    validarFormulario,
  } = useForm({ username: "", password: "" }, validarLogin);

  // --- Envío del formulario ---
  async function manejarSubmit(e) {
    // Sin esto, el navegador recargaría la página completa al enviar
    // el form (comportamiento HTML clásico), perdiendo todo el estado
    // de React. preventDefault() se lo impide.
    e.preventDefault();

    // Si hay errores de formato (campo vacío, contraseña corta),
    // cortamos acá y ni siquiera llamamos a la API.
    if (!validarFormulario()) return;

    setEnviando(true);
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valores),
      });

      if (!response.ok) {
        // Si el backend rechaza las credenciales, cortamos la
        // ejecución acá mismo lanzando un error, que el catch de
        // abajo va a atrapar.
        throw new Error("Las credenciales no son correctas");
      }

      // Si la respuesta fue exitosa, extraemos el access token del
      // JSON de respuesta (Django SimpleJWT lo devuelve así).
      const { access } = await response.json();

      // Guardamos la sesión en el contexto global (esto persiste el
      // token en localStorage y actualiza "estaAutenticado" en toda
      // la app).
      login({ username: valores.username }, access);

      // Redirige al usuario a la página principal tras loguearse.
      navigate("/");
    } catch (err) {
      // Guardamos el mensaje de error en el estado, para que se
      // muestre en pantalla (antes solo se veía en consola).
      setErrorLogin(err.message);
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

      {/* Se muestra solo si el servidor rechazó las credenciales */}
      {errorLogin && <p className="error">{errorLogin}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
