import config from "../config/env";
// URL base de tu API. Tenerla en una sola constante evita repetir
// "http://localhost:8000/api" en cada endpoint, y facilita cambiarla
// el día que subas esto a producción (solo cambiás esta línea).

// Antes — hardcodeado
//const BASE_URL = "http://localhost:8000/api";

// Después — desde variable de entorno
const BASE_URL = config.apiUrl;

// --- FUNCIÓN CENTRAL: request ---
// Todas las llamadas a la API pasan por acá. En vez de repetir fetch()
// con sus headers y manejo de errores en cada método, lo escribimos
// una sola vez y lo reutilizamos. Esto es "no te repitas" (DRY).
//
// Parámetros:
// - endpoint: la parte de la URL que cambia según el recurso, ej. "/my-posts/"
// - options: configuración extra de fetch (method, body, etc). Por defecto
//   un objeto vacío, para las peticiones GET simples que no necesitan nada más.
// - token: el token de autenticación del usuario logueado. Por defecto null,
//   para los endpoints públicos que no lo necesitan.
async function request(endpoint, options = {}, token = null) {
  // Toda petición manda que el contenido va en formato JSON.
  const headers = { "Content-Type": "application/json" };

  // Si hay token, agregamos el header Authorization. Si no hay token
  // (quedó en null), este bloque simplemente no se ejecuta, y la
  // petición sale sin esa credencial (para endpoints públicos).
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // fetch hace la petición real. El "..." (spread operator) copia todas
  // las propiedades de options (method, body, etc) dentro de este objeto,
  // y le agregamos los headers que armamos arriba.
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Un DELETE exitoso en Django suele responder 204 "No Content" (sin
  // cuerpo). Si intentáramos hacer response.json() ahí, fallaría porque
  // no hay nada que parsear. Por eso devolvemos true directamente.
  if (response.status === 204) return true;

  // response.ok es true solo para códigos 200-299. Si el backend
  // respondió con error (400, 403, 404, 500...), cortamos acá lanzando
  // una excepción, que después cada componente atrapa con try/catch.
  if (!response.ok) throw new Error(`Error ${response.status}`);

  // Si todo salió bien, convertimos la respuesta (que viene como texto)
  // a un objeto JavaScript utilizable.
  return response.json();
}

// --- OBJETO DE SERVICIO ---
// Agrupa todas las operaciones relacionadas a "posts" en un solo lugar.
// Cada método arma la URL y las opciones específicas, y delega el
// trabajo pesado (fetch, headers, manejo de errores) a request().
export const postsService = {
  // Trae todos los posts del usuario autenticado.
  // Necesita token porque /my-posts/ es un endpoint privado.
  getAll: (token) => request("/my-posts/", {}, token),

  // Trae el detalle de un post puntual del usuario (por su slug).
  getOne: (slug, token) => request(`/my-posts/${slug}/`, {}, token),

  // Crea un post nuevo. Manda method POST y el body con los datos
  // convertidos a texto JSON (JSON.stringify), porque fetch no acepta
  // objetos JavaScript "crudos" en el body, solo strings o binarios.
  create: (datos, token) =>
    request(
      "/my-posts/",
      {
        method: "POST",
        body: JSON.stringify(datos),
      },
      token,
    ),

  // Actualiza un post existente. PATCH significa "actualización parcial"
  // (solo mandás los campos que cambian), a diferencia de PUT que
  // normalmente reemplaza el recurso completo.
  update: (slug, datos, token) =>
    request(
      `/my-posts/${slug}/`,
      {
        method: "PATCH",
        body: JSON.stringify(datos),
      },
      token,
    ),

  // Elimina un post. No necesita body, solo el método DELETE y el token
  // para que el backend confirme que sos el dueño del post.
  delete: (slug, token) =>
    request(
      `/my-posts/${slug}/`,
      {
        method: "DELETE",
      },
      token,
    ),
};
