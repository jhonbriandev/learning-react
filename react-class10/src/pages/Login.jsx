// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export function Login() {
  // login: función que probablemente viene de tu AuthContext y que
  // guarda el token/usuario en el estado global (y quizás en localStorage)
  const { login } = useAuth();
  const navigate = useNavigate();

  // useLocation: nos da información sobre la URL actual, incluyendo el
  // "state" que otra página nos haya pasado al redirigirnos aquí
  // (por ejemplo, "desde dónde" venía el usuario antes de tener que loguearse)
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    // (G) defaultValues: valores INICIALES de cada campo cuando el
    // formulario se monta por primera vez. Útil cuando quieres que el
    // input no empiece en "undefined" (por ejemplo, si en algún momento
    // decides pre-rellenar el username desde algún dato guardado).
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(datos) {
    // datos = { username: "jhon", password: "12345678" }
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos), // aquí datos ya tiene EXACTAMENTE
        // los nombres que Django espera (username, password), por eso
        // se manda directo sin reconstruir el objeto (a diferencia de Register)
      });

      if (response.status === 401) {
        // 401 = credenciales incorrectas (usuario/contraseña no coinciden)
        // Usamos "root" porque este error no pertenece a un campo específico
        // (no sabemos si falló el username o el password, Django no distingue)
        setError("root", {
          message: "Usuario o contraseña incorrectos",
        });
        return;
      }

      if (!response.ok) throw new Error("Error del servidor");

      // Desestructuramos "access" del JSON de respuesta — este es el
      // JWT que identificamos hoy (el que necesita prefijo "Bearer")
      const { access } = await response.json();

      // Guardamos el usuario y el token en el contexto global de auth
      login({ username: datos.username }, access);

      // (H) Si el usuario había intentado entrar a una página protegida
      // ANTES de loguearse (ej. /mis-posts), location.state.from.pathname
      // guarda esa ruta para regresarlo ahí después del login.
      // Si no venía de ningún lado, lo mandamos al home ("/").
      const destino = location.state?.from?.pathname || "/";
      navigate(destino, { replace: true }); // replace: no deja el login en el historial
    } catch (err) {
      // Atrapa errores de red o el "throw new Error" de arriba
      setError("root", { message: "Error de conexión. Intenta de nuevo." });
    }
  }

  return (
    <div className="auth-container">
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root && (
          <div className="error-general">{errors.root.message}</div>
        )}

        <div className="campo">
          <label htmlFor="username">Usuario</label>
          <input
            id="username" // conecta con htmlFor del label (accesibilidad)
            {...register("username", {
              required: "El usuario es obligatorio",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
            })}
            // (I) Clase condicional: si hay error, agregamos una clase CSS
            // extra para resaltar el input visualmente (ej. borde rojo)
            className={errors.username ? "input-error" : ""}
            autoComplete="username" // ayuda al navegador a autocompletar/gestores de contraseñas
          />
          {errors.username && (
            <p className="error-msg">{errors.username.message}</p>
          )}
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
            })}
            className={errors.password ? "input-error" : ""}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting} // evita doble envío mientras se espera la respuesta
          className="btn btn-primario"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
}
