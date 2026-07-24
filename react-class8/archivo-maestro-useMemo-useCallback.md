# Archivo Maestro — Optimización en React (useMemo, useCallback, memo, useRef)

> Semana 10 del roadmap. Sesión completa: laboratorio express, teoría reestructurada, ejercicios prácticos, integración en un proyecto real (MyPosts) y depuración de bugs reales.

---

## 1. El problema de fondo (por qué existe todo esto)

**Regla base de React:** cuando el estado de un componente cambia, **todo el componente se re-ejecuta de arriba a abajo** — incluyendo partes que no tenían relación con ese cambio.

**Analogía madre de toda la sesión:** un profesor (componente padre) tiene una libreta. Cada vez que anota algo nuevo, por costumbre le pide a TODOS sus alumnos que pasen al frente a presentarse de nuevo — aunque la mayoría no tenga nada distinto que decir.

Con pocos elementos no se nota. Con cientos, se siente lento.

---

## 2. Laboratorio express — demostrar el problema con código real

**Objetivo:** un array de miles de elementos falsos + un filtro de búsqueda "pesado" a propósito (con trabajo artificial extra), para hacer visible el costo de recalcular sin necesidad.

### Versión SIN useMemo (rota)

```jsx
import { useState } from "react";

function generarDatos(cantidad) {
  const datos = [];
  for (let i = 0; i < cantidad; i++) {
    datos.push({ id: i, nombre: `Producto ${i}` });
  }
  return datos;
}

const DATOS = generarDatos(20000);

function filtrarPesado(datos, texto) {
  console.time("filtrado");
  let basura = 0;
  for (let i = 0; i < 5_000_000; i++) { basura += i; } // trabajo artificial
  const resultado = datos.filter((item) =>
    item.nombre.toLowerCase().includes(texto.toLowerCase())
  );
  console.timeEnd("filtrado");
  return resultado;
}

export default function AppSinUseMemo() {
  const [busqueda, setBusqueda] = useState("");
  const [contador, setContador] = useState(0);

  // Se recalcula en CADA render, sin importar la causa
  const resultado = filtrarPesado(DATOS, busqueda);

  return (
    <div>
      <button onClick={() => setContador(contador + 1)}>Contador: {contador}</button>
      <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      <p>Resultados: {resultado.length}</p>
    </div>
  );
}
```

### Versión CON useMemo (arreglada)

Único cambio real:

```jsx
const resultado = useMemo(() => {
  return filtrarPesado(DATOS, busqueda);
}, [busqueda]); // solo recalcula si "busqueda" cambia
```

### Confusión real que surgió aquí (y su corrección)

**Duda del alumno:** "No siento que esté rota la app porque funciona sin problemas."

**Corrección:** "Rota" no significa que truena o da error. Significa que hace trabajo innecesario y se vuelve lenta — pero "lento" depende de la potencia de la máquina. Analogía usada: un carro con el freno de mano puesto — sigue andando, no se rompe, pero gasta más de lo necesario. La forma de comprobarlo sin "sentirlo" es con `console.time` en el navegador.

**Duda del alumno:** "¿Un cambio de modo (o contador) no debería gastar tiempo o quizás ni gastar nada?"

**Corrección confirmada:** correcto — cero, ninguno. Cambiar el contador no tiene relación lógica con el filtro, así que no debería costar nada relacionado a él. Analogía: una calculadora que ya resolvió "2+2=4" no necesita re-sumar solo porque alguien prendió la luz de la habitación.

---

## 3. Distinción clave: "separar componentes" vs. `useMemo` (no son lo mismo)

**Propuesta del alumno:** "¿No sería más fácil sacar el cambio de modo del componente de la lista, para que no se re-renderice junto?"

**Corrección:** son dos estrategias distintas, ambas válidas, pero no iguales:

| Estrategia | Qué hace | Analogía |
|---|---|---|
| Separar componentes | Evita que el re-render de un estado no relacionado "contagie" a otra parte | Mover la lámpara a otra habitación |
| `useMemo` | El componente completo SÍ se re-ejecuta, pero un cálculo específico dentro de él se reutiliza sin recalcularse | Ponerle una nota adhesiva al resultado de una suma: "válido mientras los números no cambien" |

**Precisión importante que costó varias vueltas:** `useMemo` **no evita el re-render del componente**. Evita que **ese cálculo puntual se recalcule**, aunque el componente se re-ejecute completo alrededor de él.

Incorrecto: "no se re-ejecuta el componente"
Correcto: "no se re-ejecuta ESE cálculo específico"

---

## 4. Teoría reestructurada — memo, useCallback, useMemo, useRef

### El problema concreto con funciones como props

```jsx
function Posts() {
    const [posts, setPosts] = useState([])
    const [busqueda, setBusqueda] = useState('')

    // Función normal: se crea NUEVA en cada render
    function eliminarPost(slug) {
        setPosts(prev => prev.filter(p => p.slug !== slug))
    }

    return (
        <div>
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            {posts.map(post => (
                <CardPost key={post.id} post={post} onEliminar={eliminarPost} />
            ))}
        </div>
    )
}
```

**Qué pasa paso a paso al escribir en el input:**
1. `busqueda` cambia -> `Posts` se re-renderiza.
2. `eliminarPost` se vuelve a crear (nueva referencia en memoria, aunque haga lo mismo).
3. React compara props de `CardPost`: ve `onEliminar` "distinto" -> re-renderiza `CardPost`, aunque el post no cambió.

**Analogía:** entregar una fotocopia nueva de las mismas instrucciones cada vez que cambias de silla — el asistente (componente hijo) piensa "esto es nuevo" y revisa todo de nuevo, aunque sea idéntico.

### `useCallback` — guardar la función, no fotocopiarla

```jsx
const eliminarPost = useCallback((slug) => {
    setPosts(prev => prev.filter(p => p.slug !== slug))
}, [])
```

Guarda la función en memoria; solo la recrea si las dependencias cambian. `[]` porque usa `setPosts(prev => ...)`, que siempre accede al estado más reciente sin necesitar "recordar" `posts` desde afuera.

### `memo` — el compañero obligatorio de useCallback

```jsx
const CardPost = memo(function CardPost({ post, onEliminar }) {
    console.log(`Renderizando: ${post.title}`)
    return (/* ... */)
})
```

Compara props anteriores vs. nuevos. Si son iguales, reutiliza lo que ya estaba pintado. **`useCallback` sin `memo` no sirve de nada, y `memo` sin `useCallback` nunca detecta igualdad** (porque la función seguiría llegando "nueva" cada vez). Van siempre en pareja.

### `useMemo` — memorizar valores calculados (no funciones)

```jsx
const postsFiltrados = useMemo(() => {
    return posts
        .filter(p => p.title.toLowerCase().includes(busqueda.toLowerCase()))
        .filter(p => filtroEstado === 'todos' || p.status === filtroEstado)
}, [posts, busqueda, filtroEstado])
```

Mismo principio que `useCallback`, pero guarda un **resultado**, no una función. Regla práctica: solo vale la pena para cálculos realmente costosos (arrays grandes, filtros múltiples). No usarlo para operaciones triviales como `post.title.toUpperCase()` — el overhead de memorizar es mayor que el ahorro.

### `useRef` — dos usos distintos

**Uso 1 — acceso directo al DOM:**
```jsx
const inputRef = useRef(null)
function enfocarInput() { inputRef.current.focus() }
// <input ref={inputRef} />
```

**Uso 2 — guardar un valor sin causar re-render:**
```jsx
const timerRef = useRef(null)
// cambiar timerRef.current NO dispara re-render, a diferencia de useState
```

| | `useState` | `useRef` |
|---|---|---|
| Cambiar el valor | Causa re-render | NO causa re-render |
| Para qué | Datos que la pantalla debe mostrar | Contadores internos, timers, referencias al DOM |

**Analogía:** `useState` es escribir en una pizarra que todos miran (todos reaccionan). `useRef` es escribir en tu libreta personal (nadie más se entera).

### Tabla de decisión final

| Herramienta | Úsala cuando... |
|---|---|
| `memo` | Un componente hijo recibe props y se re-renderiza de más |
| `useCallback` | Pasas una función como prop a un componente en `memo` |
| `useMemo` | Tienes un cálculo costoso que depende de valores específicos |
| `useRef` | Necesitas tocar el DOM o guardar un valor que no debe disparar render |

---

## 5. Ejercicios resueltos (con errores reales y sus correcciones)

### Ejercicio 1 — Diagnóstico
**Pregunta:** ¿se re-renderiza `ListaUsuarios` (en `memo`) al cambiar el tema, si `onSaludar` es una función normal?
**Respuesta correcta:** Sí. `memo` compara props; como `saludar` se recrea en cada render del padre, `memo` siempre detecta "cambio" y re-renderiza. Falta `useCallback`.

### Ejercicio 2 — Corrección
```jsx
const saludar = useCallback((nombre) => {
  alert(`Hola ${nombre}`);
}, []);
```
Con esto, `memo` en `ListaUsuarios` ya puede evitar el re-render al cambiar el tema.

### Ejercicio 3 — ¿Cuándo usar useMemo?
| Caso | ¿useMemo? | Por qué |
|---|---|---|
| `usuario.nombre[0] + usuario.apellido[0]` | No | Acceso a índice, instantáneo |
| `.sort()` sobre 10,000 productos | Sí | Trabajo real y costoso |
| `edad >= 18` | No | Una comparación simple, sin importar cuántas veces se ejecute |
| `.reduce()` sobre 3 items | No | Muy pocos elementos, cálculo trivial |

**Nota aparte relevante:** `.sort()` muta el array original — en código real se prefiere `[...productos].sort(...)` para no mutar datos que otras partes de la app puedan estar usando.

### Ejercicio 4 — Debounce con useRef (iteración con errores reales)

**Primer intento — error 1:** usar `useState` en vez de `useRef` para el timer -> causaría re-renders innecesarios, justo lo que se quiere evitar.

**Segundo intento — error 2:** escribir `const valor = setTexto(e.target.value)`. `setTexto` no devuelve nada útil (`undefined`) — es una función que actualiza estado, no que retorna un valor.

**Tercer intento — error 3 (más sutil, "closure con valor viejo"):** usar `texto` (el estado) dentro del `setTimeout` en vez de la variable local. Como `setTexto` es asíncrono, `texto` dentro de esa función todavía tiene el valor de ANTES de la tecla actual — el timer termina "recordando" un valor desfasado.

**Solución final correcta:**
```jsx
function manejarCambio(e) {
  const valor = e.target.value;      // 1. leer directo del evento (siempre fresco)
  setTexto(valor);                    // 2. actualizar pantalla
  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => {
    buscar(valor);                    // 3. variable LOCAL, no el estado
  }, 500);
}
```

**Regla de oro que salió de este ejercicio:** nunca mezclar `const x = setAlgo(...)` — leer y actualizar son dos pasos separados e independientes.

---

## 6. Integración real en un proyecto (MyPosts.jsx) — bugs reales encontrados y resueltos

### Bug 1 — Error 403 al cargar posts

**Síntoma:** `{"detail":"Authentication credentials were not provided."}` en la petición GET.

**Causa real:** en el `useEffect`, se llamaba `postsService.getAll()` **sin pasar el token**, aunque `getAll` lo espera como argumento (`getAll: (token) => request("/my-posts/", {}, token)`). Sin token, el header `Authorization` nunca se agregaba.

**Corrección:**
```jsx
const data = await postsService.getAll(token); // agregar el token
```

**Confusión relacionada, aclarada:** el `token` usado como argumento de la función y el `token` en `[token]` (dependencia del `useEffect`) son **la misma variable**, usada con dos roles distintos:
- Como argumento -> se *usa* para armar el header ahora mismo.
- Como dependencia -> le dice a React *cuándo* volver a ejecutar el efecto si el token cambia.

### Bug 2 — El botón "Editar" no hacía nada visible

**Causa real:** el JSX solo tenía una condición: `modoFormulario === "crear"`. Pero `manejarEditar` guarda el **objeto post completo** en `modoFormulario`, no el string `"crear"`. Como esa condición nunca se cumplía para un objeto, no había ningún JSX que reaccionara al modo edición.

**Intento incorrecto del alumno:** `modoFormulario === "null"` (comparar con el string `"null"`, que nunca es igual al valor real `null` de JavaScript).

**Corrección final:**
```jsx
{modoFormulario && modoFormulario !== "crear" && (
  <FormPost
    post={modoFormulario}
    onSubmit={manejarGuardarEdicion}
    onCancelar={() => setModoFormulario(null)}
    enviando={enviando}
  />
)}
```

### Bug 3 — Al crear un post nuevo, el formulario desaparecía y volvía directo a la búsqueda

**Causa real:** al agregar el bloque de edición, se **reemplazó** el bloque de creación en vez de agregarse aparte — quedó un solo bloque de JSX (con el comentario viejo `{/* Formulario crear */}` pero la lógica de editar adentro). Al hacer clic en "+ Nuevo post", `modoFormulario` se volvía `"crear"`, pero ya no existía ningún JSX que respondiera a ese caso específico.

**Lección clave:** siempre revisar que agregar un caso nuevo no borre por accidente el caso anterior — se necesitan **dos bloques JSX separados**, uno por cada valor posible de `modoFormulario` (`"crear"` vs. objeto post).

---

## 7. Confusiones conceptuales trabajadas a fondo (con la corrección final que sí quedó clara)

### Confusión: "useMemo/useCallback re-renderizan algo"

**Error repetido varias veces:** decir que estos hooks "re-renderizan si cambia la dependencia".

**Corrección final:** ni `useMemo` ni `useCallback` re-renderizan ni evitan re-renders por sí mismos. Son hooks que **memorizan** (guardan) un valor o una función dentro de un componente. "Re-renderizar" le pasa a **componentes**, no a hooks.

- `useMemo` -> memoriza un **resultado ya calculado**.
- `useCallback` -> memoriza una **función sin ejecutar**. Técnicamente equivale a `useMemo(() => fn, deps)`.

### Confusión: "¿Qué es lo que NO se re-renderiza exactamente?"

Se necesitó la analogía completa del salón de clases para aterrizarlo:

> El profesor (padre) revisa su libreta y decide quién califica (esto es `useMemo` — Tarea 1: decidir la lista). Luego, de los que califican, decide a quién pedirle que pase al frente de nuevo (esto es `useCallback` + `memo` — Tarea 2: evitar presentaciones repetidas si nada cambió).

**Distinción final, la más importante de toda la sesión:**

| Situación | ¿Se re-dibuja? | ¿Por qué? |
|---|---|---|
| Post que YA estaba visible y sigue visible, sin cambios | No | `memo` compara props del mismo componente montado, ve que son iguales |
| Post que NO estaba visible (salió del array filtrado) y ahora reaparece | Sí | Al salir del array, React lo desmonta del DOM por completo. Al reaparecer, es una creación nueva — no hay "render anterior" con qué comparar, así que `memo` no aplica aquí |

**Punto que costó aceptar:** no importa si el usuario "ya vio" ese post antes en su experiencia general — lo que importa es si React lo tiene montado en el DOM en el render inmediatamente anterior. Si salió del array, aunque sea por un instante, se trata como nuevo al volver.

**Con pocos elementos (3 posts) este costo es insignificante y no se nota** — el valor real de esta optimización aparece con listas de cientos de elementos.

---

## 8. Resumen ejecutivo en una sola idea (para repasar rápido)

> **`useMemo`** evita recalcular un valor costoso si sus dependencias no cambiaron.
> **`useCallback` + `memo`** evitan que un componente hijo se vuelva a dibujar si sus props no cambiaron realmente (solo protege a los que YA estaban montados y siguen montados — no a los que reaparecen después de estar ausentes).
> **`useRef`** guarda un valor o una referencia al DOM sin disparar ningún re-render, útil para timers, contadores internos o foco de inputs.

Menos trabajo repetido = app más rápida. Eso es todo lo que hay detrás de estos 4 hooks.
