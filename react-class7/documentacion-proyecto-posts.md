# Documentación de desarrollo — Proyecto de Posts (React + Django REST Framework)

**Fecha:** 16-17 de julio, 2026
**Stack:** React (frontend) + Django REST Framework (backend) + JWT para autenticación

## Índice

1. [Arquitectura general](#1-arquitectura-general)
2. [Problema 1: Error 403 en `getAll` (token no enviado)](#2-problema-1-error-403-en-getall-token-no-enviado)
3. [Problema 2: Diferencia entre endpoints públicos y privados](#3-problema-2-diferencia-entre-endpoints-públicos-y-privados)
4. [Problema 3: `token is not defined`](#4-problema-3-token-is-not-defined)
5. [Problema 4: Objeto renderizado como hijo de React](#5-problema-4-objeto-renderizado-como-hijo-de-react)
6. [Problema 5: Select de categorías y doble fetch](#6-problema-5-select-de-categorías-y-doble-fetch)
7. [Problema 6: Error 405 Method Not Allowed](#7-problema-6-error-405-method-not-allowed)
8. [Problema 7: Error 500 por `author_id` nulo](#8-problema-7-error-500-por-author_id-nulo)
9. [Problema 8: Validación de status en el formulario](#9-problema-8-validación-de-status-en-el-formulario)
10. [Problema 9: `setValores is not a function`](#10-problema-9-setvalores-is-not-a-function)
11. [Problema 10: Error 400 al editar (categoría vacía)](#11-problema-10-error-400-al-editar-categoría-vacía)
12. [Problema 11: Errores del backend no visibles en la UI](#12-problema-11-errores-del-backend-no-visibles-en-la-ui)
13. [Problema 12: Badge de status no disponible en la API](#13-problema-12-badge-de-status-no-disponible-en-la-api)
14. [Conceptos clave: eventos, `onChange` y formularios controlados](#14-conceptos-clave-eventos-onchange-y-formularios-controlados)
15. [Lecciones generales aprendidas](#15-lecciones-generales-aprendidas)

---

## 1. Arquitectura general

El proyecto consiste en un frontend en React que consume una API REST construida con Django REST Framework. Los archivos principales trabajados fueron:

- `postsService.js` — centraliza todas las llamadas HTTP a la API de posts.
- `AuthContext.jsx` — contexto global de autenticación (guarda `token` y `usuario`).
- `CategoriesContext.jsx` — contexto global de categorías (evita fetch duplicado).
- `MyPosts.jsx` — página que lista, crea, edita y elimina posts del usuario autenticado.
- `PostDetail.jsx` — página de detalle de un post individual.
- `FormPost.jsx` — formulario reutilizable para crear/editar posts.
- `CardPost.jsx` — tarjeta visual de cada post en la lista.
- `Login.jsx` — formulario de inicio de sesión.
- `useForm.js` — hook reutilizable para manejar el estado de cualquier formulario.

**Patrón de autenticación:** JWT (JSON Web Token). El token se guarda en `localStorage` y se envía en el header `Authorization: Bearer <token>` en cada petición que lo requiera.

---

## 2. Problema 1: Error 403 en `getAll` (token no enviado)

### Síntoma
Al listar los posts propios (`/my-posts/`), la API respondía **403 Forbidden**, mientras que crear posts sí funcionaba.

### Causa raíz
El método `getAll` del servicio no recibía ni enviaba el parámetro `token`:

```javascript
// Antes (incorrecto)
getAll: () => request("/my-posts/"),
```

Como `request()` tiene `token = null` por defecto, si no se pasa explícitamente, el header `Authorization` nunca se agrega, y el backend rechaza la petición a un endpoint privado.

### Solución
```javascript
// Después (correcto)
getAll: (token) => request("/my-posts/", {}, token),
```

Y en el componente que lo llama:
```javascript
const data = await postsService.getAll(token);
```

### Lección
Cada método del servicio que apunte a un endpoint protegido debe **declarar** el parámetro `token` y **pasarlo** a `request()`. Olvidar cualquiera de los dos pasos rompe la autenticación silenciosamente (sin error de sintaxis, solo un 403 en tiempo de ejecución).

---

## 3. Problema 2: Diferencia entre endpoints públicos y privados

### Contexto
Al probar el mismo tipo de petición contra `/posts/` (en vez de `/my-posts/`), sí se obtenía código 200 sin enviar token.

### Explicación
Esto no era una inconsistencia, sino la confirmación del diagnóstico anterior:

| Endpoint | Requiere token | Motivo |
|---|---|---|
| `/posts/` | No | Endpoint público (`AllowAny`), cualquiera puede listar posts |
| `/my-posts/` | Sí | Endpoint privado (`IsAuthenticated` / `IsOwner`), necesita saber quién es el usuario |

### Lección
Antes de asumir que un fetch "está roto", conviene identificar si el endpoint es público o privado en el backend. Un 403 en un endpoint privado sin token es el comportamiento **esperado**, no un bug.

---

## 4. Problema 3: `token is not defined`

### Síntoma
La pantalla mostraba el texto `Error: token is not defined` (visible en la UI, no en la consola del navegador).

### Proceso de diagnóstico
Se descartaron uno por uno los archivos candidatos:
- `FormPost.jsx` — no usaba `token`.
- `CardPost.jsx` — no usaba `token`.
- `useForm.js` — no usaba `token`.
- `Login.jsx` — usaba `access` (nombre correcto), no `token`.

Finalmente se encontró en `postsService.js`:

```javascript
// Incorrecto: token no está declarado como parámetro de la función
getAll: () => request("/my-posts/", {}, token),
```

`getAll` no declaraba `token` como parámetro, pero lo usaba igual dentro del cuerpo de la función. Como esa variable no existía en ningún alcance accesible, JavaScript lanzaba `ReferenceError: token is not defined`. Ese error era capturado por el `try/catch` de `MyPosts.jsx` y mostrado en pantalla vía `setError(err.message)`.

### Solución
```javascript
getAll: (token) => request("/my-posts/", {}, token),
```

### Lección
Un mensaje de error visible en pantalla (no en consola) casi siempre significa que fue **capturado por un `try/catch`** y guardado en un estado (`error`) que luego se renderiza. Para depurarlo, hay que rastrear de dónde viene ese `err.message`, no asumir que es un error "en vivo" no controlado.

---

## 5. Problema 4: Objeto renderizado como hijo de React

### Síntoma
```
Uncaught Error: Objects are not valid as a React child (found: object with keys {id, name, slug}).
```

### Causa raíz
El campo de categoría llegaba desde la API como un **objeto completo** (`{id, name, slug}`), pero en algún punto del código se intentaba mostrar ese objeto directamente en el JSX (por ejemplo `{post.category}` en vez de `{post.category.name}`), o se guardaba el objeto completo en el estado del formulario, causando conflictos al usarlo como `value` de un `<select>`.

### Solución
Extraer explícitamente la propiedad necesaria en vez del objeto completo:

```javascript
// Al cargar un post para editar:
setValores({
  ...postInicial,
  category: postInicial.category_name?.id ?? "",
});
```

React solo puede renderizar strings, números o elementos JSX — nunca un objeto "crudo". Cualquier dato compuesto debe desestructurarse antes de mostrarse.

### Lección
Cuando un backend devuelve relaciones anidadas (por ejemplo, una categoría completa dentro de un post), siempre hay que decidir explícitamente **qué parte de ese objeto se usa** en cada contexto: el `id` para guardarlo/enviarlo, el `name` para mostrarlo.

---

## 6. Problema 5: Select de categorías y doble fetch

### Contexto
El formulario de creación/edición de posts (`FormPost.jsx`) necesitaba mostrar un `<select>` con las categorías disponibles, pero el componente `Categories.jsx` ya las pedía por separado con su propio fetch.

### Problema de diseño
Cada componente pedía las categorías de forma independiente, generando peticiones duplicadas a la API cada vez que se montaba un componente distinto.

### Solución: Context compartido
Se creó `CategoriesContext.jsx`, siguiendo el mismo patrón que `AuthContext.jsx`:

```javascript
export function CategoriesProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories/");
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setCategorias(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categorias, cargando, error }}>
      {children}
    </CategoriesContext.Provider>
  );
}
```

Envuelto en `main.jsx`/`App.jsx` junto al `AuthProvider`. Cualquier componente accede a las categorías con `useCategories()`, sin volver a pedirlas.

### Lección
Cuando un mismo dato (categorías, usuario autenticado, configuración global) es necesario en varios componentes no relacionados directamente entre sí, un **Context** es la solución más común para evitar peticiones duplicadas y mantener una única fuente de verdad.

---

## 7. Problema 6: Error 405 Method Not Allowed

### Síntoma
```
Request Method: POST
Status Code: 405 Method Not Allowed
```
al intentar crear un post.

### Diagnóstico
El frontend mandaba correctamente el método `POST`, confirmando que el problema estaba en el backend, no en React.

### Causa raíz
El `ViewSet` de Django (`MyPostViewSet`) no tenía habilitado el método POST (estaba comentado o restringido).

### Solución
```python
class MyPostViewSet(ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsOwner]
    lookup_field = 'slug'
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
```

### Lección
Un 405 con el método correcto enviado desde el cliente indica, casi siempre, que la **vista del backend** no tiene ese método habilitado (`http_method_names`, o el tipo de vista genérica usada, ej. `ListAPIView` vs `ListCreateAPIView`).

---

## 8. Problema 7: Error 500 por `author_id` nulo

### Síntoma
```
django.db.utils.IntegrityError: el valor nulo en la columna «author_id» de la relación «blog_post» viola la restricción "not-null"
```

### Causa raíz
Al crear un post, el frontend no manda (ni debe mandar) el autor — esa información debe asignarla el backend a partir del usuario autenticado. El `ViewSet` no tenía sobreescrito `perform_create`, así que Django intentaba guardar el post sin autor, violando la restricción `NOT NULL` de la base de datos.

### Solución
```python
class MyPostViewSet(ModelViewSet):
    ...
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
```

`self.request.user` es el usuario autenticado, extraído automáticamente por Django REST Framework a partir del token JWT enviado en el header `Authorization`.

### Lección
Los campos que dependen de la identidad del usuario (autor, propietario) **nunca deben venir del cliente** — se asignan del lado del servidor por razones de seguridad (evita que un usuario cree contenido a nombre de otro) y de integridad de datos.

---

## 9. Problema 8: Validación de status en el formulario

### Duda planteada
¿El `<select>` de `status` en `FormPost.jsx` realmente envía un valor real, o es solo texto visual?

### Explicación
El `<select>` sí envía un valor real. La diferencia entre el texto visible y el valor real:

```javascript
<option value="draft">Borrador</option>
```
- `"Borrador"` (texto entre etiquetas) → solo se muestra al usuario, es decorativo.
- `value="draft"` → es el dato real que se guarda en el estado y se envía a la API.

### Decisión de arquitectura
Se confirmó que, intencionalmente, el backend siempre fuerza `status = "draft"` al crear un post (regla de negocio: todo post nuevo nace como borrador). Por lo tanto, aunque el frontend sí manda el valor elegido, el backend lo ignora en la creación.

### Recomendación aplicada
Ocultar el selector de `status` en el modo de creación, y mostrarlo solo en modo edición:

```javascript
{postInicial && (
  <select name="status" value={valores.status} onChange={manejarCambio}>
    <option value="draft">Borrador</option>
    <option value="published">Publicado</option>
  </select>
)}
```

### Lección
Es importante distinguir entre **lo que el frontend envía** y **lo que el backend efectivamente procesa**. Mostrar controles que no tienen efecto real puede confundir al usuario; conviene alinear la UI con las reglas de negocio reales del backend.

---

## 10. Problema 9: `setValores is not a function`

### Síntoma
```
Uncaught TypeError: setValores is not a function
    at FormPost.jsx:57:7
```

### Causa raíz
El hook `useForm.js` definía `setValores` internamente (vía `useState`), pero no lo incluía en el objeto que retorna:

```javascript
// Antes (incompleto)
return {
  valores,
  errores,
  enviando,
  setEnviando,
  manejarCambio,
  validarFormulario,
  resetear,
};
```

Como `setValores` no estaba en el `return`, cualquier componente que lo desestructurara del hook recibía `undefined`.

### Solución
```javascript
return {
  valores,
  errores,
  enviando,
  setEnviando,
  setValores, // agregado
  manejarCambio,
  validarFormulario,
  resetear,
};
```

### Lección
Un hook personalizado solo expone lo que explícitamente incluye en su `return`. Cualquier variable interna que no se agregue ahí es inaccesible desde afuera, aunque exista dentro del hook.

---

## 11. Problema 10: Error 400 al editar (categoría vacía)

### Síntoma
```
PATCH /api/my-posts/oraculo/ HTTP/1.1" 400 44
```
Solo ocurría cuando no se elegía una categoría manualmente al editar.

### Diagnóstico
Se confirmó, inspeccionando `postInicial` en consola, que el campo de categoría llegaba bajo la clave `category_name` (no `category`):

```javascript
{
  category_name: { id: 10, name: 'ca', slug: 'c' },
  // no existe la clave "category"
}
```

El código anterior buscaba `postInicial.category`, que siempre era `undefined`, por lo que el `<select>` quedaba sin selección real, y al enviar el formulario sin categoría, el backend rechazaba la petición con 400 (campo requerido).

### Solución
```javascript
useEffect(() => {
  if (postInicial) {
    setValores({
      ...postInicial,
      category: postInicial.category_name?.id ?? "",
    });
  }
}, [postInicial]);
```

### Lección
Un error 400 sin mensaje visible en la terminal de Django no significa que no haya detalle — el cuerpo de la respuesta (visible en la pestaña **Network → Response** del navegador) siempre trae la razón exacta del rechazo. Además, hay que verificar que los nombres de las claves que devuelve el backend coincidan exactamente con los que se usan en el frontend (`category` vs `category_name` no son intercambiables).

---

## 12. Problema 11: Errores del backend no visibles en la UI

### Síntoma
El login fallaba silenciosamente: el error de "credenciales incorrectas" solo se veía con `console.error`, nunca en pantalla.

### Causa raíz
```javascript
} catch (err) {
  console.error(err.message); // solo visible en devtools
}
```

No existía ningún estado de React conectado a ese error, por lo que nunca se renderizaba nada en el JSX.

### Solución
Se agregó un estado dedicado para errores de login (separado de los errores de validación por campo del hook `useForm`):

```javascript
const [errorLogin, setErrorLogin] = useState(null);

// ...
} catch (err) {
  setErrorLogin(err.message);
}

// en el JSX:
{errorLogin && <p className="error">{errorLogin}</p>}
```

### Lección
`console.error` es útil para depuración durante el desarrollo, pero nunca sustituye la necesidad de informar errores al usuario final a través de la interfaz. Todo error que el usuario deba conocer necesita un estado de React que controle su renderizado.

---

## 13. Problema 12: Badge de status no disponible en la API

### Contexto
`CardPost.jsx` intentaba mostrar el estado del post:

```javascript
<span className={`badge ${post.status}`}>{post.status}</span>
```

pero no se veía ningún estilo ni valor.

### Causa raíz
La API no exponía el campo `status` en la respuesta de los posts.

### Solución
Se reemplazó por un dato que sí existe en la respuesta (`created_at`), formateado para ser legible:

```javascript
<span className="badge">
  {new Date(post.created_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}
</span>
```

### Lección
Antes de depurar estilos o lógica de renderizado, conviene confirmar que el dato que se intenta mostrar realmente existe en la respuesta de la API (verificable en la pestaña Network → Response, o con un `console.log` del objeto completo).

---

## 14. Conceptos clave: eventos, `onChange` y formularios controlados

Esta sección resume la explicación conceptual trabajada sobre cómo React maneja los formularios, ya que es la base de `useForm.js`, `FormPost.jsx` y `Login.jsx`.

### ¿Qué es un evento?

Un **evento** es algo que el navegador detecta automáticamente cuando el usuario interactúa con la página: un clic, una tecla presionada, un envío de formulario, etc. El navegador genera un objeto con toda la información de "qué pasó", y se lo entrega a la función que se haya conectado a ese evento.

### ¿Qué es `onChange`?

Es un atributo especial de React que se coloca en un input, textarea o select, indicando qué función ejecutar cada vez que el valor de ese campo cambia:

```javascript
<input name="username" value={valores.username} onChange={manejarCambio} />
```

Esto significa: *"cada vez que el usuario escriba o borre algo acá, ejecutá `manejarCambio`"*.

### El objeto evento (`e`)

Cuando React llama a la función conectada al `onChange`, le pasa automáticamente un objeto evento (por convención llamado `e`), que contiene:

- `e.target`: el elemento HTML exacto donde ocurrió el evento.
- `e.target.name`: el atributo `name` de ese input.
- `e.target.value`: el valor actual escrito por el usuario.

```javascript
function manejarCambio(e) {
  const { name, value } = e.target;
  ...
}
```

### Una sola función para todos los campos

En vez de escribir una función distinta por cada input, se usa **una función genérica** que identifica el campo gracias al atributo `name`:

```javascript
function manejarCambio(e) {
  const { name, value } = e.target;
  setValores((prev) => ({ ...prev, [name]: value }));
}
```

Los corchetes `[name]` permiten usar el **valor** de la variable `name` (por ejemplo `"title"`) como el nombre de la propiedad del objeto, en vez de crear literalmente una propiedad llamada `"name"`.

### Por qué usar `(prev) => ({...})`

```javascript
setValores((prev) => ({ ...prev, [name]: value }));
```

Usar una función que recibe el estado anterior (`prev`) en vez de referenciar directamente la variable de estado garantiza que siempre se parte del valor más actualizado, evitando bugs cuando hay actualizaciones rápidas o encadenadas.

### El flujo completo de un input controlado

1. El usuario escribe una letra.
2. El navegador genera el evento y llama a `manejarCambio(e)`.
3. Se extraen `name` y `value` de `e.target`.
4. Se actualiza el estado `valores` con `setValores`, modificando solo el campo correspondiente.
5. React vuelve a renderizar el input, mostrando el nuevo valor a través de `value={valores.campo}`.

Este ciclo (el valor del input siempre proviene del estado, y el estado se actualiza a través de eventos) es lo que se conoce como **input controlado**, el patrón estándar de formularios en React.

---

## 15. Lecciones generales aprendidas

1. **Un 403 casi siempre significa "falta o es inválido el token"**; un 405 significa "el método HTTP no está permitido en esa vista del backend"; un 500 indica una excepción no controlada en el servidor; un 400 indica que los datos enviados no pasan la validación del backend. Distinguir estos códigos acelera mucho el diagnóstico.
2. **Revisar siempre la pestaña Network** (Payload/Request y Response) antes de asumir causas — la mayoría de estos errores se resolvieron confirmando ahí el dato real enviado o recibido, en vez de adivinar.
3. **Un hook personalizado solo expone lo que retorna explícitamente.** Si una función o variable no está en el `return`, no existe para quien lo consume.
4. **React nunca puede renderizar objetos directamente** — siempre hay que acceder a la propiedad específica (`objeto.propiedad`) que se quiere mostrar.
5. **Los datos sensibles a la identidad (autor, propietario) deben asignarse en el backend**, nunca confiarse al valor que manda el cliente.
6. **Cuando un mismo dato se usa en varios componentes no relacionados, un Context evita peticiones duplicadas** y mantiene consistencia.
7. **Los nombres de las claves que devuelve la API deben verificarse explícitamente** (`category` vs `category_name`), no asumirse por el nombre del campo en el modelo.
8. **Todo error que el usuario final deba conocer necesita un estado de React** conectado al JSX — `console.error` no es suficiente para comunicarse con el usuario.
