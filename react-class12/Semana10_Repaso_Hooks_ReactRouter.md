# 📘 Semana 10 — Repaso General de Hooks y React Router
**Proyecto:** Blog full-stack (React + Django REST Framework)
**Contexto técnico:** React con Vite, `fetch` nativo (sin Axios), JWT con prefijo `Bearer`, componentes clave: `MyPosts`, `CardPost`, `FormPost`, `Login`, `Register`, `ToastContext`, `FeedbackEstado`.

---

## 🎯 Objetivo de la sesión
Repasar y consolidar todos los hooks trabajados hasta ahora (`useState`, `useEffect`, `useContext`, `useReducer`, patrón `useFetch`, `react-hook-form`, `useCallback`, `useMemo`) más React Router, entendiendo:
- Qué problema resuelve cada uno
- Cuándo usarlo en un proyecto real
- Errores comunes asociados a cada hook

---

## 🧠 Teoría — Resumen de cada hook

### 1. `useState` — la libreta de notas de un componente
Guarda un valor simple y local. Cuando cambia, React vuelve a renderizar el componente.
**Uso en el proyecto:** texto de inputs, visibilidad de un `Toast`.

### 2. `useEffect` — el vigilante que reacciona a cambios
Ejecuta código cuando cambian las dependencias indicadas en el array `[]`.
**Uso en el proyecto:** volver a pedir posts cuando cambia `token`.
**Concepto clave confirmado:** el *closure* "fotografía" el valor de una variable en el momento en que la función fue creada, no en el momento en que se ejecuta. Por eso toda variable externa usada dentro de un `useEffect` (o `useCallback`) debe declararse como dependencia, salvo que se use la forma funcional (`prev => ...`).

### 3. `useContext` — el altavoz del edificio
Evita pasar props manualmente por múltiples niveles ("prop drilling").
**Regla aprendida:** Context se justifica cuando el dato:
- Debe viajar por **múltiples niveles** de componentes, o
- Es consumido por **múltiples componentes dispersos** en el árbol.

Si solo un componente cercano necesita el dato, una prop simple es más liviana y más fácil de rastrear.

**Casos del proyecto:**
- `usuario` en `Navbar`: depende de cuántos componentes intermedios existan antes de llegar a `Navbar`. Si hay varios de por medio → Context se justifica.
- `ToastContext`: caso claro de Context, porque `FormPost`, `Login`, `CardPost`, etc. lo consumen desde distintas profundidades del árbol.

### 4. `useReducer` — el libro de reglas de una oficina
Útil cuando varios valores de estado **cambian juntos por la misma causa/lógica**, no solo cuando son técnicamente "excluyentes" entre sí.
**Regla aprendida (autocorregida durante el ejercicio):** aunque `status`, `data`, `error`, `pagina`, `total` no sean estrictamente excluyentes, si todos cambian como respuesta a la misma acción (una llamada a la API), pertenecen al mismo "paquete" de estado → `useReducer`.
**Uso en el proyecto:** `FeedbackEstado` (loading/error/success).

### 5. Patrón `useFetch` (hook personalizado)
Como no se usa Axios, se combina `useState` + `useEffect` en un hook reutilizable para no repetir la lógica de carga/error en cada componente.

### 6. `react-hook-form` (RHF)
"Secretaria" que gestiona el estado de un formulario sin que el componente controle cada input manualmente.
**Regla de oro:** nunca mezclar `register` con `value`/`onChange` manual en el mismo input.
**Pendiente para sesión futura:** profundizar en `watch`, `setError`, `isSubmitting`, `defaultValues`, `errors.root`.

### 7. `useCallback` — la foto laminada de una función
Evita que una función se vuelva a crear en cada render, útil junto con `memo` en componentes hijos (ej. `CardPost`).
**Error común identificado:** usar una variable externa (ej. `favoritos`) dentro del callback con dependencias vacías `[]` → *stale closure*. La función queda "congelada" con el valor del render en que fue creada.
**Solución:** usar la forma funcional del setter: `setFavoritos(prev => [...prev, id])`, que le pide a React el valor más reciente en vez de depender del valor capturado por el closure.

### 8. `useMemo` — guardar el resultado de un cálculo caro
Solo tiene sentido cuando el cálculo es costoso (ej. filtrar/ordenar listas grandes). Usarlo en cálculos triviales (como un template string) agrega costo de comparación de dependencias sin ahorrar nada real.

### 9. React Router — el mapa de la ciudad
`useParams` lee valores de la URL; `useNavigate` permite redirigir sin recargar la página. Permite proteger rutas según autenticación, razón por la cual el `if (!token) return` manual dentro de cada componente dejó de ser necesario (la protección ocurre a nivel de ruta).

---

## 🔬 Laboratorio: `useCallback` mal usado (stale closure)

**Versión A — con problema:**
```jsx
const marcarFavorito = useCallback((id) => {
  setFavoritos([...favoritos, id]); // ❌ usa "favoritos" del render en que se creó
}, []);
```
Resultado: cada click sobrescribe el anterior en vez de acumularlos, porque la función nunca se vuelve a crear y sigue "viendo" el `favoritos` original (`[]`).

**Versión B — corregida:**
```jsx
const marcarFavorito = useCallback((id) => {
  setFavoritos(prev => [...prev, id]); // ✅ usa el valor más reciente garantizado por React
}, []);
```

**Idea clave:** *"favoritos cambia en cada render, pero la función de `useCallback([])` sigue conectada al favoritos del render en que fue creada."* Por eso, cuando el nuevo estado depende del anterior, la forma funcional (`prev => ...`) es la más segura y la más usada en React moderno.

---

## 🏋️ Ejercicios resueltos y validados

### 1. Diagnóstico — `useEffect` no reacciona a cambios de categoría
```jsx
// ❌ Antes
useEffect(() => {
  fetch(`/api/posts?categoria=${categoria}`);
}, []);

// ✅ Después
useEffect(() => {
  fetch(`/api/posts?categoria=${categoria}`);
}, [categoria]);
```
**Regla generalizada:** cualquier variable externa que el efecto use y que pueda cambiar (`categoria`, `slug`, `filtro`, etc.) debe ir en el array de dependencias.

### 2. Corrección de código — `useMemo` innecesario
```jsx
// ❌ Antes
const saludo = useMemo(() => `Hola, ${nombre}`, []);

// ✅ Después
const saludo = `Hola, ${nombre}`;
```
**Razón:** `useMemo` solo vale la pena si el cálculo es costoso. Un template string no lo es; usar `useMemo` aquí gasta más de lo que ahorra.

### 3. Caso de decisión — `useState` x5 vs `useReducer`
**Conclusión:** `useReducer`, porque los 5 campos (`status`, `data`, `error`, `pagina`, `total`) cambian juntos como respuesta a la misma lógica (llamada a la API), no de forma independiente.

### 4. Caso de decisión — `useContext` vs props (Navbar y ToastContext)
**Conclusión final (tras reflexión guiada):**
- `Navbar`: se justifica Context si hay varios componentes intermedios entre `App` y `Navbar`. Si `Navbar` estuviera un nivel debajo directo, una prop simple sería suficiente.
- `ToastContext`: caso claro de Context, ya que múltiples componentes en distintas profundidades del árbol (`FormPost`, `Login`, `CardPost`) necesitan invocarlo.
**Regla aprendida:** Context se usa cuando el dato viaja por múltiples niveles o es consumido por múltiples componentes dispersos — no "porque sí" o por costumbre.

### 5. Escritura desde cero — hook personalizado `useToggle`
```jsx
import { useState, useCallback } from "react";

export function useToggle(valorInicial = false) {
  const [estado, setEstado] = useState(valorInicial);

  const alternar = useCallback(() => {
    setEstado((prev) => !prev);
  }, []);

  return [estado, alternar];
}
```
Uso correcto de la forma funcional (`prev => !prev`) para evitar depender de un valor capturado por closure, mismo patrón que en los ejercicios anteriores.

**Nota de nombres (buena práctica):** se evaluó nombrar el segundo valor retornado como `setToggle`, pero se corrigió a `alternar`/`estado` porque `setX` sugiere convencionalmente "reemplazar con un valor nuevo", mientras que esta función invierte el valor existente. Nombre final elegido: `estado, alternar` — consistente y sin ambigüedad.

---

## ✅ Ejercicios adicionales resueltos por cuenta propia (verificados)
- **Contador con `useCallback`:** comparación entre usar `[count]` como dependencia (funciona, pero recrea la función en cada cambio) vs. usar `prev => prev + 1` (función estable, sin necesidad de dependencia). Conclusión correcta: la forma funcional es preferible para estados acumulativos (contadores, likes, carritos, tareas).
- **Lista de tareas (`useCallback` + `prev`):** aplicación correcta del mismo patrón para acumular elementos en un array sin perder los anteriores.

---

## 🐛 Errores comunes identificados en esta sesión
1. **Stale closure en `useCallback`/`useEffect`:** usar una variable externa capturada por el closure en vez de la forma funcional del setter o declararla como dependencia.
2. **Uso innecesario de `useMemo`** en cálculos triviales, agregando costo sin beneficio real.
3. **Nombrar funciones tipo `setX` cuando en realidad no reciben un valor nuevo**, sino que invierten/alternan uno existente — afecta la legibilidad para otros desarrolladores (y para uno mismo a futuro).

---

## 📌 Aclaraciones clave confirmadas en la sesión
- El closure "fotografía" el valor en el momento en que la función fue **creada**, no en el momento en que se **ejecuta**.
- `useCallback` guarda una **función**; `useMemo` guarda un **valor/resultado**. Ambos existen para evitar trabajo innecesario en cada render.
- Context no es gratis: agrega una capa de indirección: se usa cuando el beneficio (evitar prop drilling en profundidad o dispersión) supera ese costo.

---

## 🔜 Pendiente para próximas sesiones
- Profundizar en herramientas de `react-hook-form` ya introducidas pero no cubiertas en teoría: `watch`, `setError`, `isSubmitting`, `defaultValues`, `errors.root`.
- Continuar con **React Router** a fondo: rutas protegidas, `useParams`, `useNavigate` aplicados directamente al blog.

---

*Documento generado como parte del roadmap Full Stack — Semana 10, según `PLAN_DIARIO_DETALLADO.md`.*
