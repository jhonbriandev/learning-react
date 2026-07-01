# 📘 Guía de estudio: React Router en mi Mini-Blog

> Documento de repaso creado a partir del ejercicio de construcción de rutas para un mini-blog con React + React Router. Úsalo para repasar antes de un examen, una entrevista, o simplemente para refrescar la memoria en unos meses.

---

## 🗂️ Índice

1. [Estructura general del proyecto](#1-estructura-general-del-proyecto)
2. [`main.jsx` — El punto de entrada](#2-mainjsx--el-punto-de-entrada)
3. [`Outlet` — El concepto que más costó](#3-outlet--el-concepto-que-más-costó)
4. [Rutas anidadas vs. rutas hermanas](#4-rutas-anidadas-vs-rutas-hermanas)
5. [Arrays vs. objetos: `posts` vs `post`](#5-arrays-vs-objetos-posts-vs-post)
6. [Autenticación simple con `localStorage`](#6-autenticación-simple-con-localstorage)
7. [`PrivateRoute` y el patrón `children`](#7-privateroute-y-el-patrón-children)
8. [`useNavigate` vs `Link`](#8-usenavigate-vs-link)
9. [Checklist final del ejercicio](#9-checklist-final-del-ejercicio)
10. [Errores comunes que cometí (y cómo los detecté)](#10-errores-comunes-que-cometí-y-cómo-los-detecté)
11. [Glosario rápido](#11-glosario-rápido)

---

## 1. Estructura general del proyecto

```
src/
├── main.jsx                    # Punto de entrada. Aquí va BrowserRouter (una sola vez)
├── AppExercise.jsx             # Define TODAS las rutas de la app
└── pages/exercises/
    ├── Layout.jsx               # Header + Nav + Outlet + Footer (layout fijo)
    ├── Home.jsx                 # Página de inicio
    ├── Login.jsx                # Login simulado (guarda token en localStorage)
    ├── Post.jsx                 # Lista de posts (fetch a la API)
    ├── PostDetail.jsx           # Detalle de un post (usa useParams)
    ├── Dashboard.jsx            # Página protegida
    ├── PrivateRoute.jsx         # "Guardia de seguridad" para rutas privadas
    └── NotFound.jsx             # Página 404
```

**Analogía general:** piensa en tu app como un edificio. `main.jsx` es la base del edificio (los cimientos, se construye una sola vez). `AppExercise.jsx` es el directorio del edificio, que dice qué hay en cada piso. `Layout.jsx` es la estructura común a todos los pisos (ascensor, escaleras, recepción). Cada archivo dentro de `pages/` es una oficina distinta dentro de ese edificio.

---

## 2. `main.jsx` — El punto de entrada

```jsx
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### 🔑 Regla de oro
`BrowserRouter` va **una sola vez, en `main.jsx`**, envolviendo todo. Es como el **GPS del coche**: le da a React la capacidad de "saber en qué calle está" (la URL actual) y decidir qué mostrar.

- ❌ Si lo pones en dos archivos → error: *"You cannot render a `<Router>` inside another `<Router>`"* (dos GPS peleando por dar direcciones).
- ✅ Todo lo que esté **dentro** de `<BrowserRouter>` puede usar `<Link>`, `<Route>`, `useNavigate()`, `useParams()`, `useLocation()`.

---

## 3. `Outlet` — El concepto que más costó

### ❌ Mi error inicial
Pensaba que `Outlet` era como una caja normal donde metía contenido como children:

```jsx
// ❌ INCORRECTO — Outlet ignora sus children
<Outlet>
  {posts.map((post) => <p key={post.id}>{post.title}</p>)}
</Outlet>
```

### ✅ La realidad
`Outlet` **no muestra sus children**. Solo muestra lo que el sistema de rutas (`<Route>` anidadas) le indique.

> **Analogía:** `Outlet` es un **marco de fotos digital conectado a internet**. No le pegas una foto encima a mano — el marco se conecta solo a un servidor (el sistema de rutas) y muestra lo que corresponda. Si intentas pegarle algo físicamente, no se ve.

### La pregunta clave que resolvió todo
> "¿`Outlet` es para todo lo que cambia respecto al layout, o solo para cuando hay una ruta hija anidada?"

**Respuesta:** Solo para cuando hay una **ruta hija anidada de verdad**, definida en el archivo de rutas. Si un componente no tiene hijos anidados en las rutas, `Outlet` estará **siempre vacío** — no importa qué le pongas dentro.

```jsx
// ✅ CORRECTO — el contenido fijo va afuera del Outlet, como hijo normal del div
<div>
  {posts.map((post) => <p key={post.id}>{post.title}</p>)}
  <Outlet /> {/* Solo se llena si HAY una ruta hija anidada configurada */}
</div>
```

---

## 4. Rutas anidadas vs. rutas hermanas

Esta fue la segunda gran decisión del ejercicio: ¿`PostDetail` debía vivir **dentro** de `Post` (anidada, usando `Outlet`) o **al lado** de `Post` (hermana, reemplazándola)?

### Opción A — Anidada (con `Outlet`)
```jsx
<Route path="/post" element={<Post />}>
  <Route path=":slug" element={<PostDetail />} />
</Route>
```
La lista de posts sigue visible, y el detalle aparece **debajo**, dentro del `Outlet` de `Post`.

### Opción B — Hermana (sin `Outlet`) ← la que usamos
```jsx
<Route path="/post" element={<Post />} />
<Route path="/post/:slug" element={<PostDetail />} />
```
Al entrar al detalle, **reemplaza completamente** a la lista. No se necesita `Outlet` en `Post.jsx`.

> **Analogía:** anidada es como una **vitrina dentro de una habitación** (la habitación se sigue viendo). Hermana es como **cambiar de habitación completamente** (una puerta cierra, otra se abre).

**Decisión tomada:** Opción B, porque no queríamos ver la lista y el detalle al mismo tiempo.

---

## 5. Arrays vs. objetos: `posts` vs `post`

Este fue el segundo gran "aha moment" del ejercicio.

```jsx
const [posts, setPosts] = useState([]);   // ARRAY: varios posts
setPosts(data.results);                    // la API pagina la lista

{posts.map((post) => (                     // post = UN elemento del array
  <Link key={post.slug} to={`/post/${post.slug}`}>
    <p>{post.title}</p>                    // post SÍ tiene .title (es un objeto individual)
  </Link>
))}
```

### La analogía de la caja de chocolates 🍫

| | `posts` | `post` |
|---|---|---|
| ¿Qué es? | La **caja completa** (array) | **Un chocolate** individual (objeto) |
| ¿De dónde sale? | Lo creaste tú con `useState` + `fetch` | Lo entrega `.map()`, uno a la vez |
| ¿Tiene `.title`? | ❌ No — es una lista, no tiene un único título | ✅ Sí — es un objeto con datos propios |

- `posts.map((post) => ...)` → `.map()` es la **cinta transportadora** que saca chocolates de la caja uno por uno.
- `post` es solo el **nombre que tú eliges** para "el chocolate que está pasando por la cinta ahora mismo". Podrías llamarlo `x`, pero `post` (singular de `posts`) hace el código mucho más legible.

### Comparación con `PostDetail.jsx`

```jsx
const [postDetail, setPostDetail] = useState(); // objeto único, no array
setPostDetail(data);                              // SIN .results: la API entrega UN post directo

<h1>{postDetail.title}</h1>  // acceso directo, sin .map(), porque ya es UN objeto
```

**Regla de oro:** si tienes **varios** elementos juntos (array) → necesitas `.map()` para sacarlos uno por uno antes de leer sus propiedades. Si tienes **un solo** objeto → accedes directo con el punto (`.title`, `.content`).

---

## 6. Autenticación simple con `localStorage`

```jsx
// Guardar el "login"
localStorage.setItem("accessToken", "token-falso-para-demo-123");

// Revisar si existe
const token = localStorage.getItem("accessToken"); // null si no existe

// Cerrar sesión
localStorage.removeItem("accessToken");
```

> **Analogía:** `localStorage` es una **libreta que el navegador guarda**, incluso si cierras la pestaña o el navegador completo. Es la forma más simple para principiantes de simular "estar logueado" sin backend real todavía.

### El truco de `!!`
```jsx
const [hasToken, setHasToken] = useState(() => !!localStorage.getItem("accessToken"));
```
`!!` convierte cualquier valor en `true`/`false` puro. `!!null` → `false`. `!!"texto"` → `true`. Es como preguntar "¿hay algo aquí?" en vez de "¿qué hay exactamente?".

### ¿Por qué `() => ...` y no el valor directo en `useState`?
Para que React solo revise `localStorage` **una vez**, al montar el componente — no en cada render. Es la forma recomendada quando el valor inicial requiere "calcular algo" (leer del navegador), en vez de ser un valor fijo como `useState([])`.

---

## 7. `PrivateRoute` y el patrón `children`

```jsx
export function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

### Uso en las rutas:
```jsx
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
```

### Aclaraciones clave

- **`PrivateRoute`** es solo un nombre que **yo elegí** — no es una palabra reservada de React ni de React Router. Podría llamarse `Guardian` y funcionaría igual.
- **`children`** SÍ es una palabra especial de React. Cuando "envuelves" un componente entre las etiquetas de otro (`<PrivateRoute><Dashboard /></PrivateRoute>`), React automáticamente entrega ese contenido interior a través de la prop `children`.
- **`replace`**: evita que la redirección quede en el historial del navegador, para que el botón "atrás" no regrese a una página que nunca debió verse.
- **`state={{ from: location }}`**: guarda de dónde venía el usuario, para poder devolverlo ahí después del login (mejora futura).

> **Analogía:** `PrivateRoute` es un **guardia de seguridad genérico** que puedes poner en la puerta de cualquier "sala" (componente), sin tener que entrenar a un guardia distinto para cada una. El mismo guardia revisa el token, sin importar qué sala esté protegiendo.

---

## 8. `useNavigate` vs `Link`

| | `Link` | `navigate(...)` (de `useNavigate`) |
|---|---|---|
| ¿Cuándo se dispara? | Cuando el usuario hace clic directamente en él | Cuando TÚ lo llamas desde código |
| ¿Necesita interacción del usuario? | Sí, es el propio elemento clicable | No, puede ejecutarse como consecuencia de otra acción |
| Ejemplo de uso | Menú de navegación (`Home`, `Post`, `Login`) | Después de un `logout()`, o tras guardar un formulario |

```jsx
function logout() {
  localStorage.removeItem("accessToken");
  navigate("/login"); // redirige SIN que el usuario haga clic en un link
}
```

> **Analogía:** `Link` es una **puerta que el usuario abre él mismo**. `navigate()` es cuando **tú, desde atrás, empujas al usuario** hacia otra puerta, como consecuencia de algo que él hizo (como cerrar sesión).

⚠️ **Cuidado con los paréntesis:**
```jsx
onClick={logout}    // ✅ se ejecuta SOLO al hacer clic
onClick={logout()}  // ❌ se ejecuta INMEDIATAMENTE al dibujar la pantalla
```

---

## 9. Checklist final del ejercicio

- [x] `BrowserRouter` configurado una sola vez en `main.jsx`
- [x] `Home.jsx` — mensaje de bienvenida
- [x] `Post.jsx` — lista de posts con fetch real a la API
- [x] `PostDetail.jsx` — usa `useParams` para mostrar un post por slug
- [x] `Login.jsx` — simula login guardando token en `localStorage`
- [x] `NotFound.jsx` — página 404 con enlace de regreso al inicio
- [x] `Layout.jsx` — Navbar + `Outlet` + Footer
- [x] Rutas anidadas dentro de `Layout` en `AppExercise.jsx`
- [x] Ruta comodín `*` para `NotFound`
- [x] `PrivateRoute.jsx` — protege `/dashboard`, redirige a `/login` sin token
- [x] Navegación verificada: clics sin recargar, 404 funcional, ruta protegida funcional

**Resultado: ejercicio 100% funcional.** ✅

---

## 10. Errores comunes que cometí (y cómo los detecté)

| Error | Síntoma | Causa raíz | Solución |
|---|---|---|---|
| `<Outlet>{posts.map(...)}</Outlet>` | Los posts no se mostraban nunca | `Outlet` ignora sus children | Sacar el `.map()` fuera del `Outlet`, como contenido fijo |
| `useParams` con nombre `slug` pero ruta con `:id` | El fetch pedía `.../undefined/` | El nombre del parámetro no coincidía con la ruta | Usar el mismo nombre en `useParams()` y en `path=":slug"` |
| `setPostDetail(data.results)` en detalle individual | `postDetail` quedaba `undefined` | Confundir "lista paginada" con "objeto único" | Usar `data` directo, sin `.results`, para un solo post |
| `Post.find(...)` en `PostDetail` | Error: `Post.find is not a function` | Confundir el componente `Post` con un array de datos | Eliminar la línea; ya no era necesaria con el fetch |
| `{simulateLogin}` en el JSX | La función no se ejecutaba nunca, o se mostraba raro en pantalla | Faltaba el evento (`onClick`) para dispararla | Usar `<button onClick={simulateLogin}>` |
| `/dashboard` accesible sin token | La ruta "protegida" no protegía nada | `Dashboard` no estaba envuelto en `PrivateRoute` en las rutas | Envolver: `<PrivateRoute><Dashboard /></PrivateRoute>` |

---

## 11. Glosario rápido

- **`Outlet`**: hueco donde React Router dibuja la ruta hija activa. No muestra sus children.
- **Ruta anidada**: `<Route>` definida DENTRO de otra `<Route>`. Requiere `Outlet` en el padre.
- **Ruta hermana**: `<Route>` al mismo nivel que otra. Reemplaza el contenido, no necesita `Outlet`.
- **`useParams()`**: hook que lee valores dinámicos de la URL (ej: `:slug`, `:id`).
- **`useNavigate()`**: hook que permite redirigir desde código, sin depender de un clic en `Link`.
- **`useLocation()`**: hook que da información sobre la URL actual (útil para "recordar de dónde vino" el usuario).
- **`children`**: prop especial de React que contiene lo que se puso "adentro" de las etiquetas de un componente.
- **`localStorage`**: almacenamiento del navegador que persiste incluso al cerrar la pestaña.
- **`.map()`**: método de array que recorre cada elemento y genera algo nuevo con él (usado para renderizar listas en React).

---

*Documento generado como parte del ejercicio de construcción de rutas para un mini-blog con React + React Router. Fecha: julio 2026.*
