# Comparativa de Métodos HTTP en una API REST (React + Django REST Framework)

## Introducción
En una API REST cada método HTTP tiene una responsabilidad distinta. Aunque todos usan `fetch()`, **no todos se utilizan de la misma manera en React**.

## GET
### ¿Para qué sirve?
Obtener información.

### ¿Cuándo se ejecuta?
Al cargar una página o componente.

### Código

```js
const response = await fetch("/api/posts/");
const data = await response.json();
```

### Con `useFetch`
```jsx
const {data,cargando,error}=useFetch("/api/posts/");
```

### ¿Por qué sí suele usar un hook?
Porque leer datos forma parte del ciclo de vida del componente. El hook además administra:
- loading
- error
- data

---

## POST

### ¿Para qué sirve?
Crear un nuevo recurso.

### Código

```js
await fetch("/api/posts/",{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${token}`
  },
  body:JSON.stringify(datos)
});
```

### ¿Cuándo se ejecuta?

Cuando el usuario pulsa un botón o envía un formulario.

**No debe ejecutarse automáticamente al renderizar la página.**

---

## PUT

### ¿Para qué sirve?
Reemplazar completamente un recurso.

```js
await fetch(`/api/posts/${id}/`,{
  method:"PUT",
  headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${token}`
  },
  body:JSON.stringify(datos)
});
```

Se envían todos los campos del recurso.

---

## PATCH

### ¿Para qué sirve?
Modificar únicamente algunos campos.

```js
await fetch(`/api/posts/${id}/`,{
  method:"PATCH",
  headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${token}`
  },
  body:JSON.stringify({
      titulo:"Nuevo título"
  })
});
```

Es el método más utilizado con Django REST Framework para ediciones parciales.

---

## DELETE

### ¿Para qué sirve?
Eliminar un recurso.

```js
await fetch(`/api/posts/${id}/`,{
    method:"DELETE",
    headers:{
        "Authorization":`Bearer ${token}`
    }
});
```

Normalmente responde con **204 No Content**, por lo que no suele haber JSON para leer.

---

# ¿Por qué POST, PUT, PATCH y DELETE no suelen usar `useFetch`?

Porque esas operaciones **no forman parte del ciclo de vida del componente**.

## GET

```text
El componente aparece
        ↓
Necesita datos
        ↓
Se ejecuta automáticamente
```

## POST

```text
El usuario llena un formulario
        ↓
Pulsa Guardar
        ↓
Se ejecuta el POST
```

Si un POST estuviera dentro de `useFetch`, se ejecutaría al renderizar el componente y podría crear registros sin que el usuario lo quisiera.

---

# La solución: un Service

```js
postsService.getAll()
postsService.getOne(slug)
postsService.create(datos,token)
postsService.update(slug,datos,token)
postsService.delete(slug,token)
```

Internamente todas usan una función común:

```js
request(endpoint,options,token)
```

Esa función cambia el comportamiento según el método HTTP recibido.

---

# Comparación de cada método

| Método | Objetivo | Body | Token | Hook habitual |
|--------|----------|------|-------|---------------|
| GET | Leer datos | No | Opcional | Sí |
| POST | Crear | Sí | Sí | No |
| PUT | Reemplazar | Sí | Sí | No |
| PATCH | Actualizar parcialmente | Sí | Sí | No |
| DELETE | Eliminar | No | Sí | No |

---

# Comparación final

```text
GET
│
├── Se ejecuta automáticamente
├── Se beneficia de loading y error
├── Es ideal para un hook (useFetch/usePosts)
└── Solo consulta información

POST / PUT / PATCH / DELETE
│
├── Se ejecutan por acciones del usuario
├── No deben ejecutarse al renderizar
├── Normalmente viven en services
└── Modifican información del servidor
```

## Conclusión

La práctica profesional consiste en separar responsabilidades:

- Componentes → muestran la interfaz.
- Hooks → gestionan estado y carga de datos (principalmente GET).
- Services → encapsulan todas las operaciones HTTP (GET, POST, PUT, PATCH y DELETE).

De esta manera el código es reutilizable, fácil de mantener y escalable.
