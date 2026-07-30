# 📘 Semana 10 — Manejo de errores en React
### ErrorBoundary, estados error/loading/success y componente genérico de Feedback

**Proyecto:** Blog con React (frontend) + Django REST Framework (backend)
**Contexto:** `MyPosts`, `CardPost`, `FormPost`, autenticación por token, sin axios (solo `fetch` nativo)

---

## 1. Idea central del día: dos tipos de errores

React tiene que lidiar con **dos categorías distintas de "algo salió mal"**, y cada una se resuelve con una herramienta diferente:

| Tipo de error | Ejemplo | Se maneja con |
|---|---|---|
| **Esperado** (parte normal del flujo) | Backend responde 404, no hay internet, token vencido | Estados `loading` / `error` / `success` |
| **Inesperado** (bug de programación) | `post.autor.nombre` cuando `autor` es `null` | `ErrorBoundary` |

### 🍽️ Analogía: el mesero y el restaurante
- **Estados error/loading/success** = el mesero informa al cliente sobre su pedido: *"se está preparando"* (loading), *"aquí está tu plato"* (success), *"se acabó el ingrediente"* (error). Es comunicación normal y esperada.
- **ErrorBoundary** = al mesero se le cae la bandeja por accidente. No es parte del proceso normal — es un accidente de renderizado. Un buen restaurante no cierra todo el local: aísla el problema y el resto sigue funcionando.

---

## 2. Estados error/loading/success

### ❌ Antipatrón común (booleanos independientes)
```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const [data, setData] = useState(null);
```
**Problema:** permite estados imposibles simultáneos (`loading: true` y `error: true` al mismo tiempo), y nada lo impide.

### ✅ Patrón recomendado (una sola variable de estado tipo "máquina de estados")
```jsx
const [status, setStatus] = useState('idle'); // idle | loading | success | error
const [data, setData] = useState(null);
const [errorMsg, setErrorMsg] = useState('');
```
**¿Por qué es mejor?** `status` solo puede valer una cosa a la vez → elimina toda una categoría de bugs.

### Aplicado con `fetch` (sin axios)
```jsx
useEffect(() => {
  const cargarPosts = async () => {
    setStatus('loading'); // Bloque 1: avisamos que empieza la carga

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/posts/mis-posts/', {
        headers: { 'Authorization': `Token ${token}` },
      });

      // Bloque 2: fetch NO lanza error automático en 4xx/5xx
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
      setStatus('success'); // Bloque 3
    } catch (error) {
      setErrorMsg(error.message);
      setStatus('error'); // Bloque 4
    }
  };

  cargarPosts();
}, []);
```

### 🔑 Punto crítico
`fetch` **no rechaza la promesa** cuando el servidor responde 4xx/5xx (solo la rechaza ante un fallo de red real: sin internet, CORS, etc.). Por eso `if (!response.ok) throw new Error(...)` es indispensable — sin eso, un 403 pasaría silenciosamente como "éxito" con datos vacíos.

---

## 3. ErrorBoundary

### Teoría
Un `ErrorBoundary` atrapa errores de **JavaScript durante el render** de sus hijos y muestra una UI de respaldo en vez de romper toda la app.

**Limitación importante:** solo puede escribirse como **class component**. No existe un hook equivalente oficial — los hooks no tienen los métodos de ciclo de vida (`componentDidCatch`) necesarios.

### 🔌 Analogía: el fusible de la casa
Si un electrodoméstico (componente) hace corto circuito, el fusible salta y **solo esa parte** se queda sin luz — no se quema toda la casa.
- `getDerivedStateFromError` = "el fusible detectó el corto"
- `componentDidCatch` = "anotar en un cuaderno qué pasó, para investigar después"

### Versión final (construida durante el día, con mensaje configurable + botón reintentar)
```jsx
// src/components/ErrorBoundary.jsx
import { Component } from "react";

// Componente de clase (obligatorio para ErrorBoundary, los hooks no lo soportan aún)
// Atrapa errores de RENDERIZADO en sus hijos, no errores de red/fetch
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tieneError: false, // bandera: ¿algo explotó al renderizar?
      error: null,        // guarda el objeto Error real, útil para debug
      infoError: null,
    };
  }

  // React llama esto automáticamente ANTES de re-renderizar, si un hijo lanza un error
  static getDerivedStateFromError(error) {
    return { tieneError: true, error };
  }

  // Se ejecuta DESPUÉS del error — lugar ideal para loggear (Sentry, LogRocket, etc.)
  componentDidCatch(error, infoError) {
    console.error("ErrorBoundary capturó:", error);
    console.error("Info del componente:", infoError.componentStack);
  }

  render() {
    if (this.state.tieneError) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          {/* Prioridad: mensaje personalizado (prop) > mensaje técnico de JS > texto genérico */}
          <p>
            {this.props.fallback ||
              this.state.error?.message ||
              "Error inesperado"}
          </p>
          <button
            onClick={() =>
              this.setState({ tieneError: false, error: null })
            }
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    // Sin error: renderiza normalmente lo que esté envuelto
    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Uso recomendado: niveles de protección
```jsx
// Nivel 1: ErrorBoundary general en App.jsx (red de seguridad global)
<ErrorBoundary fallback="Ocurrió un error inesperado en la app">
  <App />
</ErrorBoundary>

// Nivel 2: ErrorBoundary específico alrededor de zonas riesgosas
<ErrorBoundary fallback="Error al cargar tus posts">
  <MyPosts />
</ErrorBoundary>
```
**¿Por qué no basta solo con el general?** Si `CardPost` explota dentro de una lista de 20 posts, un solo ErrorBoundary global tumba **toda la página** (header, sidebar, todo). Con boundaries específicos, solo esa sección muestra el error y el resto de la app sigue viva.

---

## 4. Componente genérico de Feedback (objetivo del día)

```jsx
// Feedback.jsx
function Feedback({ status, errorMsg, loadingText = 'Cargando...' }) {
  if (status === 'loading') {
    return <p className="feedback feedback--loading">{loadingText}</p>;
  }
  if (status === 'error') {
    return <p className="feedback feedback--error">❌ {errorMsg}</p>;
  }
  return null; // success o idle: no muestra nada, el padre ya renderiza sus datos
}
```
**Principio aplicado:** DRY (Don't Repeat Yourself). Si mañana se necesita un botón "Reintentar" en el mensaje de error, se cambia en un solo lugar y se propaga a todos los componentes que lo usan.

**Concepto clave repasado varias veces durante el día:** `Feedback` es un componente **"tonto" (presentacional)** — no genera datos, solo los muestra. El dueño real de la información (ej. `errorMsg`) siempre es el componente que hace el fetch (`MyPosts`, `FormPost`, `CardPostDetalle`), nunca el componente de feedback.

---

## 5. Laboratorio: versión con problema vs. corregida (`FormPost`)

### ❌ Con problema
```jsx
function FormPost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // nunca se actualiza en ningún lado

  const enviarPost = async (datos) => {
    setLoading(true);
    const response = await fetch('http://localhost:8000/api/posts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const data = await response.json(); // no valida response.ok
    setLoading(false);
  };

  return (
    <div>
      {loading && <p>Enviando...</p>}
      {error && <p>Hubo un error</p>}
    </div>
  );
}
```

### ✅ Corregida
```jsx
function FormPost() {
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const enviarPost = async (datos) => {
    setStatus('loading');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el post: ${response.status}`);
      }

      setStatus('success');
    } catch (error) {
      setErrorMsg(error.message);
      setStatus('error');
    }
  };

  return (
    <div>
      <Feedback status={status} errorMsg={errorMsg} loadingText="Enviando post..." />
    </div>
  );
}
```

### Diagnóstico de las diferencias (resuelto por el alumno)
1. `const data = await response.json();` intenta parsear la respuesta sin importar el status — un 401 con JSON válido (`{"detail": "Token inválido"}`) se procesa como si fuera un post real.
2. `error` en la versión con problema nace en `false` y **nunca se actualiza** — es una variable "decorativa" que no participa en ninguna lógica real.

---

## 6. Ejercicios resueltos

### Ejercicio 1 — Diagnóstico (`CardPostDetalle`)
Código analizado:
```jsx
function CardPostDetalle({ postId }) {
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/${postId}/`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setStatus('success');
      });
  }, [postId]);

  if (status === 'loading') return <p>Cargando...</p>;
  return <h3>{post.titulo}</h3>;
}
```

**Problemas identificados:**
1. ❌ No hay `response.ok` → un 404/500 se trata como éxito.
2. ❌ No hay `try/catch` ni `.catch()` → si el `fetch` falla de raíz (sin internet), la promesa se **rechaza silenciosamente**.
3. ❌ Consecuencia del punto 2: como `setStatus('success')` nunca se ejecuta, `status` se queda **congelado en `'loading'` para siempre** — el usuario ve un spinner eterno, sin ningún mensaje de error, y la única evidencia es un `Uncaught (in promise)` en la consola del navegador (no un crash de React; la app sigue viva, solo un componente queda pegado).
4. ❌ Si `post` es `null` cuando se ejecuta `<h3>{post.titulo}</h3>` → error de runtime (`Cannot read properties of null`). Este es precisamente el tipo de error que atrapa un `ErrorBoundary`.

**Concepto reforzado:** `res => res.json()` y `data => {...}` usan **arrow functions** como parámetros de `.then()` — no son variables preexistentes, son parámetros que reciben automáticamente el resultado del paso anterior. Es el equivalente a:
```jsx
const res = await fetch(...);
const data = await res.json();
```
`.then()` y `async/await` son dos formas de expresar lo mismo.

### Ejercicio 2 — Corrección de código
Versión final construida por el alumno (con nombre de función corregido para evitar *shadowing*, validación de `response.ok`, `try/catch`, y uso correcto de `<Feedback />`):

```jsx
import { useState, useEffect } from "react";
import { Feedback } from "../learning/Feedback";

function CardPostDetalle({ postId }) {
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function postDetail() {
      try {
        const res = await fetch(`http://localhost:8000/api/posts/${postId}/`);

        if (!res.ok) {
          throw new Error("Error al encontrar el post");
        }

        const data = await res.json(); // detalle de un solo post: no trae .results (eso es de listas paginadas en DRF)
        setPost(data);
        setStatus("success");
      } catch (error) {
        setError(error.message);
        setStatus("error");
      }
    }
    postDetail();
  }, [postId]);

  if (status === "loading") {
    return <Feedback status={status} loadingText="Cargando tus posts..." />;
  }
  if (status === "error") {
    return <Feedback status={status} errorMsg={error} />;
  }

  return <h3>{post.titulo}</h3>;
}
```

**Nota de buena práctica (no obligatoria):** el parámetro `catch (error)` y el estado `error` comparten nombre. JavaScript lo resuelve por *scope* (la variable más cercana gana), así que funciona, pero en un code review muchos preferirían renombrar el parámetro del catch a `err` para evitar ambigüedad visual.

### Ejercicio 3 — Caso de decisión
**Pregunta:** ¿en cuáles de `MyPosts`, `FormPost`, `CardPost` tiene sentido usar `status` (loading/error/success), y en cuál no?

**Respuesta y justificación:**
- `MyPosts` (GET) y `FormPost` (POST) → **sí**, ambos hacen operaciones asíncronas (fetch) que pueden tardar o fallar.
- `CardPost` → **no**, porque no hace fetch propio; recibe `post` ya cargado como prop. No hay operación asíncrona que monitorear.

**Segunda parte — ¿`CardPost` necesita `ErrorBoundary`?**
Sí, aunque no haga fetch. La razón: `CardPost` **sí se renderiza** siempre que su padre lo use, y puede fallar durante el render si el dato recibido tiene una forma inesperada (ej. backend devuelve un post con `autor: null` por un bug de serialización en Django, y el código intenta leer `post.autor.nombre`). Ese es un **error de renderizado**, no de red — el fetch fue exitoso (200), pero el dato no tiene la forma esperada. Ese es exactamente el tipo de error para el que existe `ErrorBoundary`.

**Estrategia de niveles confirmada:** tener un `ErrorBoundary` general en `App.jsx` (protege toda la app) **y** boundaries específicos alrededor de zonas riesgosas (ej. la lista de posts), para que un fallo puntual no tumbe toda la página.

### Ejercicio 4 — Escritura desde cero
Consigna: `ErrorBoundary` completo con mensaje configurable vía props + botón "Reintentar" + `componentDidCatch`. Ver código final en la sección 3 de este documento — fue construido de forma iterativa:

1. Primer intento: usó `this.props.fallback` con un `return this.props.fallback` que **reemplazaba toda la UI** (incluido el botón), perdiendo los estilos ya diseñados.
2. Corrección: se movió `this.props.fallback` **dentro** del `<p>`, conservando la estructura fija (`<h2>`, botón) intacta.
3. Ajuste final: cadena de tres niveles de respaldo con `||`:
   ```jsx
   <p>
     {this.props.fallback ||       // 1º: mensaje personalizado, si el padre lo pasó
       this.state.error?.message ||  // 2º: mensaje técnico de JS, si existe
       "Error inesperado"}           // 3º: texto fijo, garantiza que nunca esté vacío
   </p>
   ```
   El operador `||` se detiene en el primer valor "verdadero" (no `undefined`/`null`/`""`). El tercer valor es un string fijo que no depende de nada externo, por lo que **siempre** hay algo que mostrar.

---

## 7. Revisión de código real del proyecto (`MyPost` y sistema de Feedback/Toast)

### Hallazgos y correcciones

**`MyPost.jsx`:**
- `postsFiltrados.filter((p) => p.title...)` asume que `title` siempre existe — si un post llega sin `title`, esto explota durante el render. Es exactamente el escenario que protege un `ErrorBoundary` alrededor de `<MyPost />`.
- Se dejó un `throw new Error("")` como prueba manual del `ErrorBoundary` — señalado para removerlo antes de continuar el desarrollo normal.
- `onSubmit` de `FormPost` definido inline: no es un problema en sí (el formulario solo se monta bajo demanda), pero es un punto a vigilar si `FormPost` empezara a recibir más renders.

**`Toast.jsx`:**
- Inconsistencia detectada entre el cierre automático (espera 300ms tras `setVisible(false)` antes de llamar `onCerrar`, dando tiempo a la animación CSS) y el cierre manual por click en `×` (llama `onCerrar()` inmediatamente, sin esperar). Queda como punto a revisar a futuro (posible corte abrupto de la animación de salida).

**`EstadoError.jsx`:**
- Typo corregido: "manejado por *Feddback*" → "manejado por *Feedback*".

**`ToastContext.jsx`, `FeedbackEstado.jsx`, `EstadoVacio.jsx`, `EstadoCarga.jsx`:**
- Sin problemas funcionales. Buen uso de `useCallback` en `agregarToast`/`removerToast` (evita que cambien de referencia en cada render del Provider). Buen patrón de componentes "tontos" orquestados por `FeedbackEstado`, extendiendo la idea de `Feedback` a un tercer estado (`vacio`) no cubierto en la teoría original del día.

---

## 8. Discusión final: `token` en el array de dependencias del `useEffect`

**Código bajo revisión:**
```jsx
useEffect(() => {
  cargarPosts();
}, []); // array vacío
```
donde `cargarPosts` usa `token` (de `useAuth()`) por closure, no como parámetro explícito.

**Confusión inicial del alumno:** pensar que pasar `token` como argumento a `postsService.getAll(token)` dentro de `cargarPosts` evita el problema. **Esto no es así** — lo que importa no es *dónde* se escribe `token` dentro del código, sino **en qué momento se evaluó su valor** y si el efecto se vuelve a ejecutar cuando ese valor cambia.

**Concepto: closure obsoleto (*stale closure*)**
Cada render de `MyPost` crea una nueva versión de `cargarPosts` con el `token` de ese render capturado. Pero un `useEffect` con `[]` solo ejecuta **la versión de la primera vez**, y nunca vuelve a correr — aunque `token` cambie después (ej. el usuario hace login sin recargar la página), la función que ya se ejecutó sigue "recordando" el valor viejo (`null` u otro).

**Verificación con el alumno:** confirmó correctamente que, con un `console.log(token)` dentro de `cargarPosts`, en el escenario de "login sin recargar" se seguiría viendo el token viejo mientras el array de dependencias sea `[]`.

**Solución aplicada:**
```jsx
useEffect(() => {
  cargarPosts();
}, [token]); // se re-ejecuta si el token cambia
```
Así, cada vez que `token` cambia de valor, React vuelve a ejecutar el efecto, llamando a la versión más reciente de `cargarPosts` con el `token` actualizado.

**Consideración adicional resuelta:** se evaluó si haría falta una guarda `if (!token) return;` dentro de `cargarPosts` para el caso de logout (token pasa de un valor real a `null`). Se confirmó que **no es necesaria**, porque el flujo de la app ya impide que `MyPost` se muestre sin token (protegido en otra parte, ej. rutas condicionadas por `estaAutenticado`).

---

## 9. Resumen de aprendizajes del día

1. **Estados `loading`/`error`/`success` como una sola variable** (`status`), en vez de múltiples booleanos independientes que permiten combinaciones imposibles.
2. **`fetch` no lanza error automático en 4xx/5xx** — siempre hay que validar `response.ok` manualmente.
3. **Promesas rechazadas sin `.catch()`/`try-catch` no rompen la app** — la dejan "congelada" en un estado sin feedback visible al usuario (bug silencioso, solo visible en consola).
4. **`ErrorBoundary`** — componente de clase (obligatorio, sin equivalente en hooks todavía) que atrapa errores de **renderizado**, no de red. Construido con mensaje personalizable vía props (con cadena de respaldo `||`) y botón de reintentar (`setState` para resetear `tieneError`).
5. **Estrategia de niveles de ErrorBoundary**: uno general (protege toda la app) + boundaries específicos en zonas riesgosas (evita que un fallo puntual tumbe toda la página).
6. **Componentes "tontos" (presentacionales)** — `Feedback`, `EstadoCarga`, `EstadoError`, `EstadoVacio` — reciben todo por props, no tienen lógica propia ni generan datos, siguiendo el principio DRY.
7. **Closures obsoletos (*stale closures*) en `useEffect`** — cuando el array de dependencias no incluye una variable que la función interna usa, esa función queda "congelada" con el valor viejo, aunque la variable cambie después. Se soluciona incluyendo la variable en el array de dependencias.

---

## 10. Reporte del día

- **Logros:** Dominio completo del ciclo estados error/loading/success + construcción propia de un `ErrorBoundary` reutilizable desde cero, incluyendo mensaje configurable y botón de reintentar. Comprensión sólida del concepto de closure obsoleto en `useEffect`.
- **Dudas resueltas durante la sesión:** diferencia entre props de `ErrorBoundary` (mensaje configurable) y `state.error` (error técnico de JS); por qué pasar una variable como argumento no cambia el problema del closure obsoleto.
- **Pendiente a revisar en el código real (no bloqueante):** inconsistencia de timing en el cierre manual vs. automático de `Toast.jsx`; remover el `throw new Error("")` de prueba en `MyPost.jsx`.
- **Autoevaluación:** _(a completar por el alumno)_

---
*Documento generado como parte del sistema de reportes diarios — Semana 10, roadmap Full Stack.*
