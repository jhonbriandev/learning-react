# Módulo Maestro — React Hooks y Estado Global

> Resumen de las lecciones aprendidas, errores cometidos y reglas prácticas del módulo.

---

## Objetivos del módulo

- Entender cómo React renderiza componentes.
- Comprender el problema de los **closures obsoletos**.
- Saber cuándo usar `useState`, `useReducer`, `useMemo`, `useCallback` y `useContext`.
- Aprender a pensar en **dependencias** y no solo en sintaxis.

---

# 1. useState: el estado no cambia la variable actual

```jsx
const [count, setCount] = useState(0);
```

### Idea clave

- `setCount` **no modifica** la variable `count` del render actual.
- React guarda el nuevo estado y vuelve a ejecutar el componente.
- Cada render tiene **sus propias variables**.

---

# 2. useCallback y el closure obsoleto

## ❌ Problema

```jsx
const agregar = useCallback(() => {
  setItems([...items, nuevo]);
}, []);
```

La función se crea una sola vez y captura `items` del primer render.

## ✅ Solución recomendada

```jsx
const agregar = useCallback(() => {
  setItems((prev) => [...prev, nuevo]);
}, []);
```

### Regla

> Si el nuevo estado depende del anterior, usa `prev => ...`.

---

# 3. Actualización funcional

### Contador

```jsx
setCount((prev) => prev + 1);
```

### Lista

```jsx
setItems((prev) => [...prev, item]);
```

### Toggle

```jsx
setOpen((prev) => !prev);
```

---

# 4. useEffect y dependencias

## Solo una vez

```jsx
useEffect(() => {
  cargar();
}, []);
```

## Cuando cambia una categoría

```jsx
useEffect(() => {
  cargar(categoria);
}, [categoria]);
```

### Regla mental

> El efecto debe depender de todos los valores externos que utiliza y que pueden cambiar.

---

# 5. useMemo

## ❌ Innecesario

```jsx
const saludo = useMemo(() => `Hola, ${nombre}`, []);
```

## ✅ Mejor

```jsx
const saludo = `Hola, ${nombre}`;
```

## ¿Cuándo sí usarlo?

```jsx
const resultado = useMemo(() => {
  return calcularDatosPesados(lista);
}, [lista]);
```

### Regla

- **No uses useMemo para valores simples.**
- Úsalo cuando realmente evite un cálculo costoso.

---

# 6. useReducer

## Caso ideal

```txt
status
data
error
pagina
total
```

Todos cambian juntos por la misma lógica (respuesta de API).

### Ventajas

- Estado centralizado.
- Menos `setState` dispersos.
- Menos inconsistencias.

---

# 7. Props vs Context

## Props

```jsx
<App>
  <Navbar nombre={nombre} />
</App>
```

Útil cuando la relación es directa padre → hijo.

## Context

```jsx
<UserProvider>
  <App />
</UserProvider>
```

Útil para:

- Usuario autenticado
- Toasts
- Tema
- Configuración global

---

# 8. Errores que cometimos (y por qué fueron útiles)

- Pensar que `favoritos` nunca cambiaba.
- Confundir render con recreación de funciones.
- Creer que `useMemo` mejora cualquier valor.
- Querer usar Context para todo.
- Separar estados relacionados en muchos `useState`.

### Aprendizaje

> Fallar en ejercicios pequeños evita fallar en proyectos grandes.

---

# 9. Checklist rápido

### useState

- Estado simple e independiente.

### useReducer

- Varios estados relacionados.
- Lógica compleja.

### useCallback

- Pasas funciones a hijos memoizados.
- Quieres estabilidad de referencia.

### useMemo

- Cálculo costoso.

### useEffect

- Sincronización con APIs, timers, eventos, etc.

### useContext

- Datos globales compartidos.

---

# 10. Frases clave del módulo

- **Cada render tiene sus propias variables.**
- **El closure no sigue al estado; puede quedarse atrás.**
- **`prev` usa el estado más reciente garantizado por React.**
- **No optimices antes de necesitarlo.**
- **Las dependencias describen de qué depende tu efecto o memo.**
- **Agrupa estados que cambian juntos.**

---

# Resumen ultra corto

```txt
useState   -> estado simple
useReducer -> estado complejo y relacionado
useEffect  -> sincronizar con el exterior
useCallback-> estabilizar funciones
useMemo    -> evitar cálculos costosos
useContext -> compartir datos globales
```

---

# Conclusión

Este módulo no solo enseñó hooks; enseñó **cómo piensa React**.

El mayor avance no fue memorizar APIs, sino entender:

- qué provoca un render,
- qué se recrea,
- qué se conserva,
- y cómo evitar errores sutiles con closures y dependencias.

---

## Regla de oro final

> Si el nuevo estado depende del estado anterior, usa siempre:

```jsx
setEstado((prev) => nuevoEstado);
```

Ejemplos:

```jsx
setCount((prev) => prev + 1);
setItems((prev) => [...prev, item]);
setOpen((prev) => !prev);
```

Esta es una de las reglas más importantes de React moderno.
