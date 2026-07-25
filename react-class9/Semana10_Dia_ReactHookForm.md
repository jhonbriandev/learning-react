# 📘 Semana 10 — React Hook Form (RHF)
**Proyecto:** Blog full stack (React + Django REST Framework)
**Fecha:** 24 de julio, 2026

---

## 🎯 Objetivo del día

Aprender a manejar formularios en React de forma eficiente usando **react-hook-form**, aplicarlo en `FormPost`, y conectar el envío de datos con el backend en Django REST Framework usando `fetch` (sin axios) y autenticación por token.

---

## 1. Concepto central: ¿por qué React Hook Form y no `useState` + `onChange`?

**Analogía:** con `useState` + `onChange` por cada campo, es como tener una persona parada en cada input avisando "¡cambió algo!" en cada tecla presionada → esto provoca un **re-render** en cada pulsación.

RHF usa un enfoque de **inputs no controlados** (basados en `ref`, no en `useState`): un solo "secretario" que anota todo en su libreta y solo entrega el reporte completo cuando se le pide (al hacer submit). Resultado: menos re-renders, menos código repetitivo, validaciones integradas.

---

## 2. Piezas fundamentales de `useForm()`

| Pieza | Qué hace |
|---|---|
| `register(nombre, reglas)` | Conecta un input/select/textarea al formulario. Devuelve `{ name, onChange, onBlur, ref }`, que se insertan con el spread `{...register(...)}`. |
| `handleSubmit(onValid)` | Envuelve la función de envío: valida todos los campos antes de ejecutarla. Si algo falla, no llama a `onValid`. |
| `formState: { errors }` | Objeto con los errores de validación, indexado por nombre de campo (`errors.title`, `errors.category`, etc.). Cada error es un **objeto** (`{ type, message, ref }`), por eso siempre se muestra `.message`, nunca el objeto completo. |
| `reset()` | Limpia el formulario (típicamente tras un envío exitoso). |
| `watch(nombre)` | "Espía" el valor de un campo en tiempo real y provoca re-render al cambiar. Útil para comparar valores mientras el usuario escribe (ej. confirmar contraseña). |
| `setError(campo, { message })` | Inyecta un error manualmente en un campo (o en `"root"` para errores generales), útil para mapear errores que vienen del backend. |
| `formState: { isSubmitting }` | `true` automáticamente mientras la función `onSubmit`/`onValid` está en ejecución (útil para deshabilitar el botón y evitar doble envío). |
| `defaultValues` (opción de `useForm`) | Valores iniciales de los campos al montar el formulario. Útil a futuro para formularios de edición. |
| `errors.root` | "Carpeta" de errores generales del formulario que no pertenecen a un campo específico (ej. error de conexión, credenciales incorrectas). |

---

## 3. Regla de oro: nunca mezclar `register` con `value` + `onChange` manual

```jsx
// ❌ MAL — mezcla input controlado (useState) con RHF (no controlado)
<input
  {...register("title", { required: "Obligatorio" })}
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

**Por qué falla:** `register` devuelve internamente `{ onChange, ref, ... }`. Como en JSX **las props que aparecen después sobrescriben a las anteriores**, el `onChange` manual reemplaza al de `register`, y RHF nunca se entera de lo que el usuario escribe. El campo llega vacío/undefined al hacer submit, aunque visualmente se vea texto (porque ese texto lo controla el `useState`, no RHF).

```jsx
// ✅ BIEN
<input {...register("title", { required: "Obligatorio" })} />
{errors.title && <span>{errors.title.message}</span>}
```

Mismo problema se repitió con un `<select>` que tenía `onChange` manual además de `register` — la solución fue quitar el `onChange` manual.

---

## 4. Validaciones comunes

```jsx
register("title", {
  required: "El título es obligatorio",
  minLength: { value: 5, message: "Mínimo 5 caracteres" },
  pattern: {
    value: /^[a-zA-Z0-9_]+$/,
    message: "Solo letras, números y guión bajo",
  },
  validate: (valor) => valor === password || "Las contraseñas no coinciden",
})
```

- `required`, `minLength`, `pattern` → reglas declarativas estándar.
- `validate` → función custom para reglas que no encajan en las anteriores (ej. comparar dos campos entre sí usando `watch`).

**Pendiente de reflexión:** `minLength` no tiene sentido real en un `<select>` (el valor no varía en "longitud útil"). Queda como ejercicio pensar qué validación sería más apropiada ahí (ej. usar `validate` para chequear que el valor no sea `""`).

---

## 5. Conectando con Django (sin axios, con `fetch` nativo)

```jsx
const onValid = async (data) => {
  try {
    const response = await fetch("http://localhost:8000/api/my-posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // fetch NO serializa el body solo
        Authorization: `Bearer ${token}`,     // ver sección de bug JWT abajo
      },
      body: JSON.stringify(data), // convierte el objeto JS en texto JSON
    });

    if (!response.ok) throw new Error("Error al crear el post");
    reset();
  } catch (error) {
    setError.message; // guardar SOLO error.message (string), nunca el objeto Error completo
  }
};
```

Diferencias clave entre `fetch` y `axios` (motivo del primer error diagnosticado en el Ejercicio 1):
- `fetch` **no** serializa el `body` automáticamente → hace falta `JSON.stringify(data)`.
- `fetch` **no** agrega el header `Content-Type` automáticamente → hay que declararlo a mano.

---

## 6. 🐛 Bugs reales encontrados y resueltos hoy (bitácora de diagnóstico)

### Bug 1 — Error 403 "Authentication credentials were not provided"
- **Síntoma:** el POST a `/api/my-posts/` devolvía 403 aunque el token se veía bien en consola.
- **Diagnóstico:** el token tenía formato de **3 partes separadas por puntos** (`xxxxx.yyyyy.zzzzz`), típico de **JWT** (`djangorestframework-simplejwt`), no de `TokenAuthentication` clásico (string plano de 40 caracteres hex).
- **Causa raíz:** se enviaba el header como `Authorization: Token ${token}`, pero JWT espera el prefijo `Bearer`, no `Token`.
- **Fix:** `Authorization: Bearer ${token}`.
- **Aprendizaje importante:** la memoria del proyecto tenía registrado "token-based authentication" clásico, pero el backend en algún punto migró a JWT. Diferencias clave:

| | `TokenAuthentication` clásico | `JWTAuthentication` (SimpleJWT) |
|---|---|---|
| Formato | String plano, 40 caracteres hex | 3 partes separadas por puntos (Base64) |
| Prefijo en header | `Token <valor>` | `Bearer <valor>` |
| Expiración | No expira | Sí expira (campo `exp` en el payload) |
| Refresh token | No existe | Sí existe |

- **Pendiente a futuro:** implementar renovación automática del token usando el refresh token antes de que expire (`AuthContext`).

### Bug 2 — Error 400 "Incorrect type. Expected pk value, received str."
- **Síntoma:** tras resolver el 403, el POST devolvía 400 al crear un post.
- **Diagnóstico:** el campo `category` del serializer de Django espera una **pk** (id numérico de un registro `Category`, relación `ForeignKey`), pero se enviaba un string arbitrario (`"published"` / `"draft"`).
- **Causa raíz doble:**
  1. Las categorías reales nunca se traían desde el API — el `<select>` tenía opciones hardcodeadas que en realidad correspondían al campo `status` del modelo `Post` (copiadas por error del `queryset` de `PostViewSet`: `filter(status='published')`).
  2. **Cruce de nombres:** al crear el segundo `<select>` (con las categorías reales desde `CategoriesContext`), quedaron invertidos los atributos `name` y el argumento de `register(...)` entre los dos selects — el que tenía "Publicados/Borradores" estaba registrado como `"category"`, y el que tenía las categorías reales estaba registrado como `"status"`.
- **Fix:**
  - Se creó un `CategoriesContext` que trae las categorías reales desde la API.
  - Se generaron las `<option>` dinámicamente con `.map()`, usando `cat.id` como `value` y `cat.name` como texto visible.
  - Se corrigieron los nombres cruzados: cada `<select>` con el `name` y `register(...)` que le corresponde según su contenido real (no según su posición en el JSX — el orden visual nunca afecta a RHF).

---

## 7. Formularios adicionales revisados: Register y Login

Se analizaron dos formularios ya construidos (`Register.jsx`, `Login.jsx`) que introdujeron piezas nuevas de RHF no cubiertas en la teoría base del día:

- **`watch("password")`** — usado en `Register` para comparar en tiempo real contra `confirmarPassword` mediante `validate`.
- **`setError(campo, { message })`** — usado para mapear errores devueltos por el backend (`erroresBackend`, un JSON tipo `{ "username": ["Este usuario ya existe"] }`) directamente a los campos del formulario, y también para errores generales en `errors.root` (fallo de conexión, credenciales incorrectas en Login con status 401).
- **`isSubmitting`** — usado para deshabilitar el botón de submit y cambiar su texto mientras se espera la respuesta del servidor.
- **`defaultValues`** — usado en `Login` para inicializar `username` y `password` como strings vacíos (relevante a futuro para formularios de edición pre-rellenados).
- **`location.state?.from?.pathname`** (de `react-router-dom`) — usado en `Login` para redirigir al usuario de vuelta a la página protegida a la que intentaba acceder antes de loguearse.

---

## 8. Buenas prácticas reforzadas hoy

- Nunca mezclar inputs controlados (`useState`) con `register` de RHF en el mismo campo.
- Siempre acceder a `errors.campo.message`, nunca al objeto de error completo.
- Guardar en estado solo el `.message` (string) de un objeto `Error`, nunca el objeto completo.
- El **orden visual** de los elementos en el JSX no tiene ningún efecto sobre a qué campo se registra un valor — lo que importa es el string que se le pasa a `register(...)`.
- Verificar errores reales del backend (pestaña Network → Response) antes de asumir la causa de un error HTTP — el mensaje de detalle (`detail`) suele ser la pista más directa.
- Diferenciar claramente entre errores de **autenticación** (401/403 por token) y errores de **validación de datos** (400 por tipo/formato incorrecto).

---

## 9. Preguntas abiertas / próximos pasos

1. ¿Qué validación reemplaza mejor a `minLength` en un `<select>` para asegurar que no quede en la opción vacía?
2. Limpiar imports no usados (`useEffect`, `useCallback`, `useMemo`, `useRef`) en `FormPost.jsx`.
3. Investigar/implementar renovación automática del JWT usando el refresh token antes de que expire.
4. Revisar `Controller` de RHF para el caso de componentes de selección custom (ej. `react-select`, `DatePicker`) — no vistos en código hoy, pero discutidos en el Ejercicio 3.

---

## 10. Ejercicios resueltos hoy

| Ejercicio | Resultado |
|---|---|
| Laboratorio (bug value + register) | ✅ Corregido — identificado el sobrescrito de `onChange` |
| Ejercicio 1 — Diagnóstico (fetch sin JSON.stringify/token) | ✅ Correcto |
| Ejercicio 2 — Corrección (onChange redundante en select) | ✅ Correcto |
| Ejercicio 3 — Caso de decisión (`register` vs `Controller`) | ✅ Correcto, razonamiento validado |
| Ejercicio 4 — Escritura desde cero (`FormPost` completo) | ✅ Completado con guía — bugs reales 403 y 400 diagnosticados y resueltos en el proceso |

---

*Documento generado como cierre de la sesión de estudio del día, siguiendo la metodología de reporte diario del roadmap.*
