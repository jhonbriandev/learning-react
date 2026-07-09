# Repaso — Semana 9, Día 5: Context API + useReducer

## 1. Lo que aprendiste hoy

### Context API

- **Problema que resuelve:** evitar "prop drilling" (pasar datos por
  props a través de componentes que no los usan, solo para que un
  componente muy anidado los reciba).
- **Piezas:**
  - `createContext(valorInicial)` → crea el "canal" vacío.
  - `<AuthContext.Provider value={...}>` → el Provider real de React,
    incluido automáticamente al crear el contexto. Se usa **una sola
    vez**, envolviendo la app entera.
  - `useContext(AuthContext)` → cómo cualquier componente "se conecta"
    al canal, sin importar qué tan profundo esté en el árbol.
- **Patrón profesional:** empaquetar el `useState`/`useReducer` + el
  `.Provider` real dentro de un componente propio (ej. `AuthProvider`),
  y exponer un hook personalizado (`useAuth`) para consumirlo. Así,
  quien usa el contexto no necesita saber los detalles internos.

### useReducer (escalera de 4 niveles)

1. **Nivel 1:** `useReducer` es como `useState`, pero el cambio de
   valor pasa por una función intermedia (`reducer`), a la que se le
   "pide" el cambio con `dispatch({ type: '...' })`, en vez de
   cambiarlo directamente.
2. **Nivel 2:** el `payload` es el dato extra que viaja junto a la
   acción (`dispatch({ type: 'SUMAR', payload: 5 })`), para que una
   misma acción sirva para varios casos.
3. **Nivel 3:** cuando el estado es un objeto con varias propiedades,
   se usa `...estado` (spread) para copiar lo que no cambia, y pisar
   solo la propiedad que sí se actualiza. Olvidar el spread borra las
   demás propiedades del estado.
4. **Nivel 4 (avanzado):** lo mismo aplicado a un array (ej. lista de
   notificaciones), agregando/eliminando elementos sin mutar el
   array original.

### Regla de oro para saber cuándo usar cada uno

| Herramienta            | Cuándo usarla                                                                  |
| ---------------------- | ------------------------------------------------------------------------------ |
| `useState`             | Estado simple, sin muchas acciones relacionadas                                |
| `useReducer`           | Estado con varias acciones/lógica relacionada entre sí                         |
| `Context`              | Cuando varios componentes NO emparentados directamente necesitan el mismo dato |
| `Context + useReducer` | Estado global con lógica compleja (el reemplazo de Redux sin instalar nada)    |

---

## 2. Ejercicio del día: autenticación con Context, aplicado al blog

### Estructura de archivos usada (carpeta `exercises/`, aún sin agrupar por tema)

```
exercises/
├── AuthContext.jsx   → crea el contexto, el Provider y el hook useAuth
├── Home.jsx           → consume useAuth para mostrar un mensaje u otro
├── Layout.jsx          (MainLayout) → estructura con <Outlet />
├── Login.jsx          → hace el fetch real a Django y llama a login()
├── Navbar.jsx         → consume useAuth para mostrar sesión/logout
└── PrivateRoute.jsx   → consume useAuth para proteger rutas
App.jsx                → arma las <Routes> y envuelve con <PrivateRoute>
```

### El flujo completo, de punta a punta

```
1. main.jsx envuelve TODA la app en <AuthProvider> (una sola vez)

2. Usuario sin sesión entra a "/"
   → Home lee estaAutenticado = false → muestra "Logéate para acceder"
   → Navbar lee estaAutenticado = false → muestra Link a /login

3. Usuario llena el formulario en Login.jsx y envía
   → fetch real a http://localhost:8000/api/token/
   → si response.ok: login({ username }, access) actualiza el contexto
   → navigate('/dashboard', { replace: true })

4. Como Navbar y Home están conectados al MISMO contexto,
   ambos reflejan el cambio automáticamente, sin recibir props
   ni "enterarse" el uno del otro.

5. Usuario entra a "/dashboard" sin sesión
   → PrivateRoute lee token (o estaAutenticado) = false
   → <Navigate to="/login" state={{ from: location }} replace />

6. Usuario hace logout()
   → se limpia usuario, token y localStorage
   → Navbar y Home vuelven a mostrar el estado "sin sesión"
```

---

## 3. Errores comunes detectados hoy (y cómo se corrigieron)

### Error 1 — Importar un valor de contexto desde OTRO componente

```jsx
// ❌ Incorrecto
import { estaAutenticado } from "./Navbar";
```

`estaAutenticado` es una variable que vive SOLO dentro de la función
`Navbar()` mientras se ejecuta — no es algo exportable. La solución
es que cada componente se conecte DIRECTO al contexto:

```jsx
// ✅ Correcto
import { useAuth } from "./AuthContext";
const { estaAutenticado } = useAuth();
```

**Regla:** nunca se "importa" un dato de sesión desde otro componente.
Siempre se obtiene con `useAuth()`.

### Error 2 — Imports sin usar

`AuthContext.jsx` importaba `Link, NavLink` sin usarlos.
`MainLayout.jsx` importaba `Link` sin usarlo.
**Corrección:** se eliminaron. Un import sin usar no rompe la app,
pero ensucia el código y puede confundir sobre qué hace el archivo.

### Error 3 — Rutas de import innecesariamente complejas

`Login.jsx` y `Navbar.jsx` usaban `"../exercises/AuthContext"`
(subir un nivel y volver a bajar a la misma carpeta), cuando estando
en la misma carpeta que `AuthContext.jsx`, basta con `"./AuthContext"`.
**Corrección:** simplificado a `"./AuthContext"` en ambos archivos.

### Error 4 (de la clase anterior, ya resuelto) — `navigate()` duplicado

Se llamaba `navigate("/dashboard")` y luego `navigate("/dashboard", { replace: true })`
en la misma función. Solo se necesita la segunda, para que el
usuario no pueda volver al login con el botón "atrás" del navegador.

### Error 5 (de la clase anterior, ya resuelto) — Login sin `Content-Type`

Faltaba el header `headers: { "Content-Type": "application/json" }`
en el `fetch`, necesario para que Django/DRF interprete bien el body.

---

## 4. Preguntas de repaso (contéstalas sin ver el código)

1. ¿Por qué `token` se recupera de `localStorage` al iniciar, pero
   `usuario` no?
2. ¿Qué pasaría si en un reducer de useReducer olvidas escribir
   `...estado` antes de pisar una propiedad?
3. ¿Por qué `PrivateRoute` no necesita leer `localStorage`
   directamente, si al final el token vive ahí guardado?
4. Si mañana creas `PerfilUsuario.jsx` y necesita el nombre del
   usuario logueado, ¿qué importas — algo de `Navbar.jsx`, o algo
   de `AuthContext.jsx`?

---

## 5. Próximos pasos sugeridos

- Agrupar los archivos de `exercises/` en carpetas por responsabilidad
  (`context/`, `components/`, `pages/`) — pendiente para otra clase.
- Aplicar el mismo patrón de `AuthContext` a un `PostsContext` con
  `useReducer`, para manejar la lista de posts del blog de forma global.
- Revisar formularios más complejos (validación, múltiples campos)
  como siguiente tema natural después de dominar Context + useReducer.
