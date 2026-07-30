// ==========================================
// IMPORTACIONES
// ==========================================
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// (A) useForm: el hook principal de react-hook-form (RHF).
// Nota: de todos estos imports, hoy solo usamos "useState".
// El resto (useEffect, useCallback, useMemo, useRef) quedaron importados
// de sesiones anteriores de optimización, pero no se usan en este archivo.
// Buena práctica: limpiarlos si no se usan, para mantener el código ordenado.
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext"; // (B) nuestro contexto de autenticación
import { useCategories } from "../context/CategoriesContext"; // (C) contexto que ya trae las categorías desde la API
import { postsService } from "../services/postsService";

export function FormPost() {
  // ==========================================
  // BLOQUE 1: Datos externos (contexts)
  // ==========================================
  // En vez de hacer un fetch manual a /api/categories/ aquí mismo,
  // delegamos esa responsabilidad a un Context que ya se encarga de
  // pedirlas y compartirlas con cualquier componente que las necesite.
  // "cargando" nos avisa si la petición todavía está en curso.
  const { categorias, cargando: cargandoCategorias } = useCategories();

  // token: el token de autenticación del usuario logueado (formato JWT).
  const { token } = useAuth();

  // ==========================================
  // BLOQUE 2: Estado local para errores del servidor
  // ==========================================
  // Este NO es un campo del formulario, por eso no usamos register() aquí.
  // Es un estado aparte para mostrar mensajes cuando el fetch falla
  // (ej. error de red, error 400/403/500 desde Django).
  const [serverError, setServerError] = useState("");

  // ==========================================
  // BLOQUE 3: Configuración de React Hook Form
  // ==========================================
  const {
    register, // conecta cada input/select al "secretario" de RHF
    handleSubmit, // envuelve el submit: valida antes de ejecutar onValid
    formState: { errors }, // objeto con errores de validación por campo
    reset, // limpia el formulario tras un envío exitoso
  } = useForm();

  // ==========================================
  // BLOQUE 4: Función que se ejecuta SOLO si la validación pasó
  // ==========================================
  const onValid = async (data) => {
    // "data" ya viene armado por RHF con los valores de todos los
    // campos registrados: { title, content, category, status }
    try {
      await postsService.create(data, token);

      // Si todo salió bien, limpiamos el formulario para que el usuario
      // pueda crear otro post sin recargar la página.
      reset();
    } catch (error) {
      console.log(error);
      // Guardamos SOLO el texto (.message), no el objeto Error completo,
      // porque en el JSX no podemos renderizar un objeto directamente.
      setServerError(error.message);
    }
  };

  // ==========================================
  // BLOQUE 5: JSX del formulario
  // ==========================================
  return (
    <form onSubmit={handleSubmit(onValid)}>
      {/* --- Campo: título --- */}
      <input
        name="titulo"
        {...register("title", {
          required: "El título es obligatorio",
          minLength: {
            value: 5,
            message: "El título debe tener al menos 5 caracteres",
          },
        })}
      />
      {/* errors.title existe solo si la validación de arriba falló */}
      {errors.title && <span className="error">{errors.title.message}</span>}

      {/* --- Campo: contenido --- */}
      <textarea
        name="contenido"
        {...register("content", {
          required: "El contenido es obligatorio",
          minLength: {
            value: 20,
            message: "El contenido debe tener al menos 20 caracteres",
          },
        })}
      />
      {errors.content && (
        <span className="error">{errors.content.message}</span>
      )}

      {/* --- Campo: categoría (relación con el modelo Category en Django) --- */}
      <select
        name="category"
        {...register("category", {
          required: "La categoría es obligatoria",
          // Nota: minLength en un <select> con ids numéricos no aporta
          // demasiado valor real; más adelante puede revisarse si conviene
          // quitarlo o reemplazarlo por otra validación.
          minLength: {
            message: "El contenido debe tener al menos 5 caracteres",
          },
        })}
      >
        <option value="">
          {cargandoCategorias
            ? "Cargando categorías..."
            : "Seleccionar categoría"}
        </option>
        {/* .map() recorre el array "categorias" (traído del Context)
            y genera un <option> por cada una */}
        {categorias.map((cat) => (
          // key={cat.id}: React necesita una key única para optimizar el renderizado de listas
          // value={cat.id}: lo que se guarda y se envía al backend (el id numérico, el "pk")
          // {cat.name}: lo que el usuario ve en pantalla (el texto legible)
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* --- Campo: estado del post (published / draft) --- */}
      <select
        name="status"
        {...register("status", {
          required: "El estado es obligatorio",
          minLength: {
            message: "El contenido debe tener al menos 5 caracteres",
          },
        })}
      >
        <option value="published">Publicados</option>
        <option value="draft">Borradores</option>
      </select>

      <button type="submit">Crear Post</button>

      {/* Mensaje de error del servidor (fetch fallido), independiente de RHF */}
      {serverError && <span className="error">{serverError}</span>}
    </form>
  );
}
