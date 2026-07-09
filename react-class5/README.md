# Semana 9 · Día 5 — Context API + useReducer

## Tema del día

Cómo compartir estado global en React sin instalar Redux, usando
`createContext`, `useContext` y `useReducer`.

## Ejemplo real usado hoy

El blog que ya vienes construyendo (Django REST + React + JWT):

- **Sesión de usuario** compartida entre Navbar, rutas privadas y páginas.
- **Sistema de notificaciones** (tipo Gmail/Slack) para avisar
  "post guardado", "login fallido", etc. desde cualquier componente.

## Archivos de esta carpeta

| Archivo                                       | Concepto                                          | ¿Se corre solo con `npm run dev`?                                                           |
| --------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `01-context-crear-proveer.jsx`                | `createContext` + `Provider`                      | ✅ Sí                                                                                       |
| `02-usecontext-custom-hook.jsx`               | `useContext` + hook personalizado (`useAuth`)     | ✅ Sí                                                                                       |
| `03-1-usereducer-nivel1-contador.jsx`         | `useReducer` desde cero, comparado con `useState` | ✅ Sí                                                                                       |
| `03-2-usereducer-nivel2-payload.jsx`          | Qué es el `payload` de una acción                 | ✅ Sí                                                                                       |
| `03-3-usereducer-nivel3-objeto.jsx`           | Estado como objeto (spread `...estado`)           | ✅ Sí                                                                                       |
| `03-4-usereducer-notificaciones-avanzado.jsx` | `useReducer` con un array (nivel avanzado)        | ✅ Sí                                                                                       |
| `04-context-usereducer-combinado.jsx`         | Context + useReducer combinados                   | ✅ Sí                                                                                       |
| `05-integracion-proyecto-real.jsx`            | Guía de referencia para tu proyecto real          | ❌ No — es documentación con código comentado, cópialo archivo por archivo dentro de `src/` |

### Escalera de useReducer (del 03-1 al 03-4)

Estudia estos 4 archivos EN ORDEN, uno por uno, sin saltarte
ninguno. Cada uno agrega solo UNA idea nueva sobre el anterior:

1. **Nivel 1** — qué es `dispatch`, qué es el `reducer`, en qué se
   parece y en qué se diferencia de `useState` (estado = un número).
2. **Nivel 2** — qué es el `payload` (el dato extra que viaja con
   la acción, para poder sumar +1, +5 o +10 con la misma acción).
3. **Nivel 3** — qué pasa cuando el estado es un objeto con varias
   propiedades, y por qué se usa `...estado` (spread) para no
   perder los datos que no estás cambiando.
4. **Nivel 4 (avanzado)** — todo lo anterior aplicado a un ARRAY
   (una lista de notificaciones), que es como se ve en proyectos reales.

Cada archivo trae preguntas al final para que verifiques que
entendiste antes de pasar al siguiente nivel.

## Cómo estudiar cada archivo (1 al 4)

1. Copia el contenido completo del archivo.
2. Pégalo en `src/App.jsx` de tu proyecto Vite + React (reemplazando
   temporalmente lo que haya ahí).
3. Corre `npm run dev` y prueba los botones.
4. Lee los bloques de comentarios de arriba hacia abajo — cada uno
   explica una parte del código y el porqué.
5. Cuando termines de entenderlo, recupera tu `App.jsx` original
   (o usa git para descartar el cambio) antes de pasar al siguiente.

## Cómo usar el archivo 5

No lo pegues en `App.jsx`. Es una guía: cada bloque comentado
(`/* ... */`) representa un archivo real de tu proyecto
(`AuthContext.jsx`, `NotificacionesContext.jsx`, `Login.jsx`,
`Layout.jsx`, `main.jsx`). Créalos en sus rutas correspondientes
dentro de `src/`.

## Idea clave del día

- **Context** resuelve el "¿cómo accedo a esto desde cualquier parte?"
- **useReducer** resuelve el "¿cómo organizo la lógica cuando hay
  varias acciones posibles sobre el mismo estado?"
- Juntos reemplazan a Redux en proyectos medianos, sin instalar nada.
