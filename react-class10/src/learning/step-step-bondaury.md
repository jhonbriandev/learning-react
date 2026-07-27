# Manejo de errores y feedback en React

Cuando una aplicación React interactúa con una API pueden ocurrir dos tipos de problemas completamente distintos:

1. **Errores esperados**, como que una petición falle, no haya conexión o el servidor responda con un error.
2. **Errores inesperados de JavaScript**, como intentar acceder a una propiedad de `null` o `undefined`, que impiden que React renderice un componente.

Por esa razón React suele utilizar **dos herramientas distintas**:

- **Feedback** → para estados esperados de la aplicación.
- **ErrorBoundary** → para errores inesperados de JavaScript.

---

# ErrorBoundary

## ¿Qué es?

Un **ErrorBoundary** es un componente especial de React que captura errores de JavaScript que ocurren durante el renderizado de otros componentes.

Sin un ErrorBoundary, cuando un componente falla React desmonta todo el árbol de componentes y el usuario termina viendo una pantalla en blanco.

Con un ErrorBoundary, React reemplaza únicamente la parte que falló por una interfaz alternativa (_fallback UI_).

---

## Analogía

Imagina una casa.

Si una habitación tiene un cortocircuito, el fusible corta únicamente esa habitación.

Las demás habitaciones continúan funcionando.

El **ErrorBoundary** es ese fusible.

```text
Casa
│
├── Cocina
├── Sala
├── Dormitorio 💥
└── Baño

↓

Casa
│
├── Cocina
├── Sala
├── ErrorBoundary
│     "Algo salió mal"
└── Baño
```

---

# Implementación

React obliga a que ErrorBoundary sea un componente de clase.

```jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.error(errorInfo);

    // Aquí normalmente enviarías el error
    // a Sentry, LogRocket, Bugsnag, etc.
  }

  render() {
    if (this.state.hasError) {
      return <h2>Algo salió mal.</h2>;
    }

    return this.props.children;
  }
}
```

---

# Cómo usarlo

Nunca se coloca dentro de `<Routes>` envolviendo `<Route>`.

Lo correcto es envolver el componente que será renderizado.

```jsx
<Route
  path="/"
  element={
    <ErrorBoundary>
      <MyPosts />
    </ErrorBoundary>
  }
/>
```

Si `MyPosts` falla, solamente esa pantalla será reemplazada.

---

# ¿Qué captura?

## Sí captura

- Errores durante el render.
- Errores en constructores.
- Errores en métodos del ciclo de vida.

---

## No captura

- fetch()
- Promesas
- setTimeout()
- Eventos como onClick()
- Errores dentro del propio ErrorBoundary.

---

# Cómo probarlo

La forma más sencilla es provocar un error.

```jsx
throw new Error("Probando ErrorBoundary");
```

o

```jsx
const post = null;

return <h1>{post.title}</h1>;
```

Obtendrás algo parecido a:

```text
TypeError:
Cannot read properties of null
```

Y React mostrará:

```text
The above error occurred in <MyPosts>

React will try to recreate this component tree
using the ErrorBoundary.
```

Eso significa que el ErrorBoundary funcionó correctamente.

---

# Feedback

## ¿Qué es?

Feedback no captura errores.

Simplemente muestra diferentes estados de la aplicación.

Por ejemplo:

- Cargando...
- Error
- Sin resultados
- Operación exitosa

Todo eso son estados esperados.

---

## Analogía

Un restaurante.

El cliente pide una pizza.

La cocina responde:

"No tenemos queso."

El mesero informa:

```text
❌ No se pudo preparar la pizza.
```

Eso es Feedback.

No ocurrió ningún fallo del programa.

Simplemente algo salió mal y el usuario es informado.

---

# Componente Feedback

```jsx
function Feedback({ status, errorMsg, loadingText = "Cargando..." }) {
  if (status === "loading") {
    return <p>{loadingText}</p>;
  }

  if (status === "error") {
    return <p>❌ {errorMsg}</p>;
  }

  return null;
}
```

---

# Uso

```jsx
const status = cargando ? "loading" : error ? "error" : "success";

if (status !== "success") {
  return (
    <Feedback
      status={status}
      errorMsg={error}
      loadingText="Cargando posts..."
    />
  );
}
```

---

# ¿De dónde sale status?

No hace falta otro useState.

Puede derivarse de los estados existentes.

```jsx
const status = cargando ? "loading" : error ? "error" : "success";
```

---

# ¿Qué ocurre cuando falla un fetch?

```jsx
try {
  const data = await postsService.getAll();

  setPosts(data);
} catch (error) {
  setError(error.message);
}
```

Después simplemente:

```jsx
<Feedback status="error" errorMsg={error} />
```

No interviene ErrorBoundary.

---

# ErrorBoundary vs Feedback

Esta es la diferencia más importante.

| Feedback                   | ErrorBoundary              |
| -------------------------- | -------------------------- |
| Maneja errores esperados   | Maneja errores inesperados |
| Lo controlas tú            | Lo controla React          |
| Usa estados                | Captura excepciones        |
| Funciona con fetch         | No funciona con fetch      |
| Vive dentro del componente | Envuelve componentes       |

---

# Ejemplo 1

La API responde:

```text
500 Internal Server Error
```

Código:

```jsx
try{

    await fetch(...);

}
catch(error){

    setStatus("error");

}
```

Resultado:

```text
❌ No se pudo cargar la información.
```

Trabaja:

✅ Feedback

---

# Ejemplo 2

Código:

```jsx
const post = null;

return <h1>{post.title}</h1>;
```

Resultado:

```text
TypeError:
Cannot read properties of null
```

Trabaja:

✅ ErrorBoundary

---

# Ejemplo 3

Código:

```jsx
<button
  onClick={() => {
    throw new Error("Boom");
  }}
>
  Click
</button>
```

¿Lo captura ErrorBoundary?

❌ No.

Porque ocurrió dentro de un evento.

Debes usar:

```jsx
try {
} catch (error) {}
```

---

# Componentes reutilizables de Feedback

Una aplicación suele tener tres estados repetitivos.

## EstadoCarga

```jsx
<EstadoCarga mensaje="Cargando posts..." />
```

---

## EstadoError

```jsx
<EstadoError mensaje="No se pudo cargar" onReintentar={cargar} />
```

---

## EstadoVacio

```jsx
<EstadoVacio
  mensaje="No existen posts"
  textoAccion="Crear"
  accion={abrirFormulario}
/>
```

---

# FeedbackEstado

En lugar de escribir:

```jsx
if(cargando)...

if(error)...

if(vacio)...
```

en cada componente,

puedes centralizar toda la lógica.

```jsx
<FeedbackEstado cargando={cargando} error={error} vacio={!posts.length}>
  <ListaPosts />
</FeedbackEstado>
```

El propio componente decidirá qué mostrar.

---

# Toast

Los Toast sirven para mensajes temporales.

Ejemplos:

```text
✅ Post creado.

❌ Error al eliminar.

ℹ️ Información guardada.

⚠️ Contraseña débil.
```

Desaparecen automáticamente después de unos segundos.

Lo habitual es administrarlos mediante un **ToastContext**, para poder mostrarlos desde cualquier componente.

---

# Estructura recomendada

```text
src/

components/

│

├── ErrorBoundary.jsx

│

└── feedback/

      ├── EstadoCarga.jsx

      ├── EstadoError.jsx

      ├── EstadoVacio.jsx

      ├── FeedbackEstado.jsx

      └── Toast.jsx

context/

│

├── AuthContext.jsx

└── ToastContext.jsx
```

---

# Buenas prácticas

✅ Usa Feedback para estados esperados.

✅ Usa ErrorBoundary como última línea de defensa.

✅ Nunca reemplaces try/catch por ErrorBoundary.

✅ No abuses de ErrorBoundary; colócalo alrededor de secciones importantes (rutas, paneles, formularios complejos, etc.).

✅ Mantén los componentes Feedback reutilizables para no repetir código.

---

# Resumen

## Feedback

Se encarga de informar al usuario sobre estados normales de la aplicación.

Ejemplos:

- Cargando...
- Error de API.
- Sin datos.
- Operación exitosa.

---

## ErrorBoundary

Protege la aplicación de errores inesperados de JavaScript durante el renderizado.

No evita el error.

Evita que toda la aplicación deje de funcionar.

---

## Ambos trabajan juntos

```text
App

│

├── Navbar

│

├── ErrorBoundary

│      │

│      └── MyPosts

│              │

│              ├── Feedback Loading

│              ├── Feedback Error

│              ├── Lista de posts

│              └── Formulario

│

└── Footer
```

**Idea clave:**

- **Feedback** mejora la experiencia del usuario mostrando estados esperados.
- **ErrorBoundary** protege la estabilidad de la aplicación cuando ocurre un fallo inesperado de JavaScript.

En aplicaciones React profesionales es habitual utilizar **ambos** porque resuelven problemas diferentes y se complementan.
