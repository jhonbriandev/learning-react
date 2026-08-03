// src/pages/Registro.jsx
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

export function Register() {
  // useNavigate: hook de react-router-dom para redirigir al usuario
  // por código (sin que él haga clic en un link) después de una acción exitosa.
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch, // (A) NUEVO: "espía" el valor de un campo en tiempo real
    setError, // (B) NUEVO: permite inyectar errores manualmente (no solo por reglas)
    formState: { errors, isSubmitting }, // (C) NUEVO: isSubmitting
  } = useForm();

  // (A) watch("password") le pide a RHF: "avísame cada vez que el campo
  // 'password' cambie, y dame su valor actual". A diferencia de register,
  // que normalmente no causa re-renders, watch SÍ provoca un re-render
  // cada vez que ese campo cambia (es la excepción a la regla del "secretario
  // silencioso" que vimos hoy) — porque aquí sí necesitas ese valor disponible
  // para comparar contra "confirmarPassword" mientras el usuario escribe.
  const password = watch("password");

  async function onSubmit(datos) {
    try {
      const response = await fetch("http://localhost:8000/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Armamos el objeto que Django espera, tomando los campos
          // validados de "datos" (lo que RHF entrega tras pasar las reglas)
          username: datos.username,
          email: datos.email,
          password: datos.password,
          password2: datos.confirmarPassword, // Django suele llamarlo "password2"
        }),
      });

      if (!response.ok) {
        // (D) El backend devuelve un JSON con errores por campo, ej:
        // { "username": ["Este usuario ya existe"], "email": ["..."] }
        const erroresBackend = await response.json();

        // Object.entries convierte ese objeto en un array de pares [campo, mensajes]
        // para poder recorrerlo con forEach.
        Object.entries(erroresBackend).forEach(([campo, mensajes]) => {
          // (B) setError inyecta el error DIRECTO en el campo correspondiente
          // del formulario, como si RHF lo hubiera detectado él solo.
          // Así, errors.username se llena igual que si hubiera fallado el "required".
          setError(campo, {
            // El backend a veces manda el mensaje como array (["Mínimo 8 caracteres"])
            // y a veces como string plano. Este ternario cubre ambos casos.
            message: Array.isArray(mensajes) ? mensajes[0] : mensajes,
          });
        });
        return; // cortamos aquí: no navegamos a otra página si hubo error
      }

      // Si todo salió bien, redirigimos al login, y le pasamos un mensaje
      // "de regalo" a través del state de navegación (útil para mostrar
      // un aviso tipo "Registro exitoso" en la pantalla de Login).
      navigate("/login", {
        state: { mensaje: "Registro exitoso. Inicia sesión." },
      });
    } catch {
      // Este catch atrapa errores de RED (ej. el servidor no responde),
      // NO errores de validación del backend (esos ya se manejaron arriba).
      // "root" es un campo especial: un error que no pertenece a
      // ningún input concreto, sino al formulario en general.
      setError("root", { message: "Error de conexión." });
    }
  }

  return (
    <div className="auth-container">
      <h1>Crear cuenta</h1>

      {/* noValidate: le dice al navegador "no uses tu validación nativa
          de HTML (los globitos por defecto), yo (RHF) me encargo de todo" */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* errors.root: se muestra solo si hubo un error de conexión
            o un error general que no corresponde a un campo específico */}
        {errors.root && (
          <div className="error-general">{errors.root.message}</div>
        )}

        <div className="campo">
          <label>Usuario</label>
          <input
            {...register("username", {
              required: "Campo obligatorio",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              // (E) pattern: una expresión regular (regex) que el valor
              // debe cumplir. Aquí: solo letras, números y guión bajo.
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Solo letras, números y guión bajo",
              },
            })}
          />
          {errors.username && (
            <p className="error-msg">{errors.username.message}</p>
          )}
        </div>

        <div className="campo">
          <label>Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Campo obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // patrón básico de email
                message: "Email no válido",
              },
            })}
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>

        <div className="campo">
          <label>Contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: "Campo obligatorio",
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
            })}
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
        </div>

        <div className="campo">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            {...register("confirmarPassword", {
              required: "Campo obligatorio",
              // (F) validate: una regla CUSTOM, distinta a required/minLength/pattern.
              // Recibe el valor actual de este campo y debe devolver:
              // - true (o nada) si es válido
              // - un string (el mensaje de error) si es inválido
              // Aquí comparamos contra "password" (el valor que "watch" nos
              // dio en tiempo real) para saber si coinciden.
              validate: (valor) =>
                valor === password || "Las contraseñas no coinciden",
            })}
          />
          {errors.confirmarPassword && (
            <p className="error-msg">{errors.confirmarPassword.message}</p>
          )}
        </div>

        {/* (C) isSubmitting: true automáticamente mientras onSubmit
            está corriendo (o sea, mientras esperamos la respuesta del fetch).
            Se usa para deshabilitar el botón y evitar doble-clic/doble-envío. */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
