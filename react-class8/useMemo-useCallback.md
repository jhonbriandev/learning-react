# Optimización en React: memo, useCallback, useMemo y useRef

## 0. El problema de fondo (antes de tocar cualquier hook)

**Analogía:** imagina que trabajas en una oficina y cada vez que alguien te hace _cualquier_ pregunta — aunque sea "¿qué hora es?" — tú reescribes tu informe completo de 50 páginas desde cero, por costumbre, aunque nadie te pidió tocar el informe.

Eso es lo que hace React por defecto: **cuando el estado de un componente cambia, TODO el componente se vuelve a ejecutar de arriba a abajo** — incluyendo partes que no tenían nada que ver con ese cambio.

Con pocos elementos no se nota (reescribir 2 páginas es rápido). Con 200 posts o cálculos pesados, sí se siente.

Los 4 hooks de hoy son 4 herramientas distintas para decirle a React: _"esto en particular no hace falta rehacerlo."_

---

## 1. El problema concreto, con código real

```jsx
function Posts() {
  const [posts, setPosts] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Esta función se crea NUEVA en cada render
  function eliminarPost(slug) {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  }

  return (
    <div>
      <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      {posts.map((post) => (
        <CardPost key={post.id} post={post} onEliminar={eliminarPost} />
      ))}
    </div>
  );
}
```

**Explicación por bloques:**

- **`function eliminarPost(slug) {...}`** — una función normal, definida dentro del componente. Aquí está la trampa: en JavaScript, cada vez que se ejecuta una función, cualquier función definida _dentro de ella_ también se crea de nuevo. Es una copia distinta en memoria, aunque haga exactamente lo mismo que la anterior.
- **`onEliminar={eliminarPost}`** — le pasamos esa función a `CardPost` como prop.

**Qué pasa paso a paso cuando escribes en el input:**

1. `busqueda` cambia → `Posts` se re-renderiza.
2. Al re-renderizarse, `eliminarPost` se vuelve a crear (es una función "nueva", aunque haga lo mismo).
3. React compara los props de `CardPost`: ve que `onEliminar` "cambió" (porque técnicamente es otra función en memoria).
4. React re-renderiza `CardPost` también, aunque el post en sí no cambió para nada.

**Analogía de esto:** es como si cada vez que cambias de silla en la oficina, le entregaras una fotocopia nueva de tus instrucciones a tu asistente — aunque las instrucciones digan exactamente lo mismo palabra por palabra, tu asistente piensa "esto es nuevo, mejor reviso todo de nuevo", porque no sabe que es una fotocopia idéntica.

Con 5 posts no se nota. Con 200, la app se siente pesada.

---

## 2. `useCallback` — guardar la función, no fotocopiarla

```jsx
const eliminarPost = useCallback((slug) => {
  setPosts((prev) => prev.filter((p) => p.slug !== slug));
}, []);
```

**Explicación por bloques:**

- **`useCallback(funcion, dependencias)`** — le dice a React: _"guarda esta función en memoria. Solo créala de nuevo si algo en la lista de dependencias cambió."_
- **`[]` (array vacío)** — significa "nunca la recrees". ¿Por qué es seguro aquí? Porque usamos `setPosts(prev => ...)` en vez de `setPosts(posts.filter(...))`. La forma con `prev` siempre recibe el estado más reciente automáticamente, sin que la función necesite "recordar" el valor de `posts` de afuera.

**Analogía:** en vez de sacar una fotocopia nueva cada vez, guardas el documento original en una carpeta y le dices a tu asistente: _"usa siempre este mismo documento, solo lo reemplazo si cambian estas condiciones específicas."_

**Importante:** `useCallback` por sí solo no evita nada todavía. Necesita un compañero: `memo`.

---

## 3. `memo` — el componente que solo se despierta si de verdad le cambiaron algo

```jsx
import { memo } from "react";

const CardPost = memo(function CardPost({ post, onEliminar }) {
  console.log(`Renderizando: ${post.title}`);
  return (
    <article>
      <h2>{post.title}</h2>
      <button onClick={() => onEliminar(post.slug)}>Eliminar</button>
    </article>
  );
});
```

**Explicación por bloques:**

- **`memo(function CardPost(...) {...})`** — envuelve el componente completo. Le dice a React: _"antes de re-renderizar esto, compara los props nuevos con los anteriores. Si son exactamente iguales, no hagas nada — reutiliza lo que ya estaba pintado en pantalla."_
- Por eso `memo` y `useCallback` **van juntos**: si `eliminarPost` se recreara en cada render (sin `useCallback`), `memo` siempre vería "props distintos" y el ahorro no serviría de nada.

**Analogía:** `memo` es el asistente que antes de rehacer el informe pregunta: _"¿de verdad cambió algo en lo que me toca a mí?"_ Si la respuesta es no, entrega el informe que ya tenía listo. Pero para que esa pregunta tenga sentido, necesita que la "fotocopia" (la función) sea realmente la misma — ahí es donde entra `useCallback`.

---

## 4. `useMemo` — repaso rápido conectándolo con lo anterior

Esto ya lo trabajamos en el laboratorio de hoy, así que aquí va el resumen conectado con el resto de la clase:

```jsx
const postsFiltrados = useMemo(() => {
  return posts
    .filter((p) => p.title.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((p) => filtroEstado === "todos" || p.status === filtroEstado);
}, [posts, busqueda, filtroEstado]);
```

- Mismo principio que `useCallback`, pero en vez de guardar una _función_, guarda un _resultado_ (el array filtrado).
- Solo se recalcula si `posts`, `busqueda` o `filtroEstado` cambiaron. Si otro estado ajeno cambia (ej. abrir un modal), el resultado se reutiliza tal cual.

**Regla práctica que ya viste con tu código:** no lo uses para cálculos triviales como `post.title.toUpperCase()` — el costo de "recordar" es mayor que el costo de simplemente hacerlo. Solo vale la pena cuando el cálculo es realmente costoso (arrays grandes, múltiples filtros, sumas sobre muchos elementos).

---

## 5. `useRef` — dos usos que conviene separar bien

### Uso 1: tocar el DOM directamente

```jsx
function BuscadorPosts() {
  const inputRef = useRef(null);

  function enfocarInput() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Buscar..." />
      <button onClick={enfocarInput}>Buscar</button>
    </div>
  );
}
```

- **`useRef(null)`** — crea una "caja" que empieza vacía (`null`).
- **`ref={inputRef}`** — le dice a React: _"guarda una referencia directa a este elemento del HTML dentro de esa caja."_
- **`inputRef.current`** — así accedes al elemento real, como si hicieras `document.querySelector` pero sin salirte de React.

**Analogía:** es como tener el número de teléfono directo de alguien en vez de tener que mandar un mensaje por una cadena de intermediarios. `inputRef.current.focus()` es "llamar directo" al input.

### Uso 2: guardar un valor sin causar re-render

```jsx
function Posts() {
  const contadorFetch = useRef(0);

  useEffect(() => {
    contadorFetch.current += 1;
    console.log(`Fetch número: ${contadorFetch.current}`);
    cargarPosts();
  }, []);
}
```

**La diferencia clave, en una tabla:**

|                  | `useState`                                                             | `useRef`                                                                                  |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Cambiar el valor | Causa un re-render                                                     | NO causa re-render                                                                        |
| Para qué sirve   | Datos que la pantalla debe reflejar (texto de un input, lista visible) | Contadores internos, timers, referencias al DOM — cosas que la pantalla no necesita "ver" |

**Analogía:** `useState` es como escribir en una pizarra que todos en la sala están mirando — si cambias algo, todos lo notan (re-render). `useRef` es como escribir una nota en tu libreta personal — la usas tú para llevar la cuenta, pero nadie en la sala se entera ni reacciona a eso.

**Bonus — debounce con useRef** (esperar a que el usuario deje de escribir antes de buscar):

```jsx
const timerRef = useRef(null);

function manejarBusqueda(e) {
  const valor = e.target.value;
  if (timerRef.current) clearTimeout(timerRef.current); // cancela el timer anterior
  timerRef.current = setTimeout(() => {
    buscarPosts(valor); // busca 500ms después de que el usuario paró de escribir
  }, 500);
}
```

Esto evita hacer una búsqueda por cada letra tecleada — solo busca cuando el usuario hace una pausa.

---

## 6. La regla práctica para decidir cuál usar

| Herramienta   | Úsala cuando...                                                                           |
| ------------- | ----------------------------------------------------------------------------------------- |
| `memo`        | Un componente hijo recibe props y se re-renderiza mucho sin necesidad                     |
| `useCallback` | Necesitas pasar una función como prop a un componente envuelto en `memo`                  |
| `useMemo`     | Tienes un cálculo costoso que depende de valores específicos                              |
| `useRef`      | Necesitas tocar el DOM directamente, o guardar un valor que no debe disparar un re-render |

**Importante para no sobre-optimizar:** ninguno de estos hooks es gratis — todos tienen un pequeño costo de "recordar cosas". Si tu componente es simple y rápido, usarlos de más solo agrega complejidad sin beneficio real. Se usan cuando el problema (re-renders lentos o pesados) ya es visible o muy probable, no "por si acaso".

---

## 7. Ejercicio para practicar (antes de ver el código completo del proyecto)

Con lo que acabas de leer, intenta responder sin ver el código de referencia:

1. Tienes un componente `ListaProductos` que recibe una función `onComprar` como prop, y esa lista tiene 300 productos. ¿Qué combinación de herramientas usarías y por qué?
2. Tienes un input de búsqueda y quieres que, mientras el usuario escribe, NO se dispare una llamada a la API por cada letra, sino solo cuando pare de escribir por medio segundo. ¿Qué hook usarías?
3. Tienes un componente que muestra `post.title.toUpperCase()`. ¿Vale la pena envolver eso en `useMemo`? ¿Por qué sí o por qué no?

Cuando tengas tus respuestas, dime y las revisamos juntos antes de pasar al código completo del proyecto de Posts.
