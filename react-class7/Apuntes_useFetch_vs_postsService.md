# Apuntes de clase: `useFetch` vs `postsService`

# Objetivo

Entender cuándo usar un Custom Hook (`useFetch`) y cuándo usar un servicio (`postsService`) para comunicarnos con una API (Django REST Framework).

---

# 1. El primer ejemplo: `useFetch`

```jsx
const { data, cargando, error } = useFetch(
    "http://127.0.0.1:8000/api/posts/"
);
```

## ¿Qué ocurre?

El componente **no hace el `fetch`**.

Simplemente llama al hook.

```
Componente
     │
     ▼
 useFetch()
     │
     ▼
 fetch()
     │
     ▼
 API Django
```

El hook es quien:

- realiza la petición
- controla `loading`
- controla `error`
- guarda `data`

El componente únicamente muestra la información.

---

# ¿Por qué el componente NO es async?

Porque React espera que un componente devuelva JSX inmediatamente.

Incorrecto:

```jsx
async function Posts() {}
```

Correcto:

```jsx
function Posts() {
    const datos = useFetch(...);
}
```

Quien necesita `async` es la función que utiliza `await fetch()`.

---

# GET por defecto

Cuando hacemos:

```javascript
fetch(url)
```

internamente ocurre:

```javascript
fetch(url,{
    method:"GET"
})
```

Por eso normalmente no se escribe el método.

También puede hacerse explícito:

```javascript
fetch(url,{
    method:"GET"
})
```

---

# POST

Un POST necesita normalmente:

```javascript
fetch(url,{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(datos)
})
```

Cambios respecto a GET:

- method
- body
- normalmente headers

---

# ¿Por qué crearPost sí usa async?

Porque esa función ejecuta directamente:

```javascript
await fetch(...)
```

Mientras que el componente solamente llama al hook.

---

# El ejemplo de clase: postsService

```javascript
postsService.getAll()
postsService.getOne(slug)
postsService.create(datos,token)
postsService.update(slug,datos,token)
postsService.delete(slug,token)
```

La idea es centralizar toda la comunicación con la API.

```
Componente
      │
      ▼
postsService
      │
      ▼
 request()
      │
      ▼
 fetch()
```

---

# request()

Esta función recibe:

```javascript
request(endpoint, options={}, token=null)
```

## endpoint

Ejemplo

```
/posts/
/posts/mi-post/
```

## options

Puede contener

```javascript
{
    method:"POST",
    body:JSON.stringify(datos)
}
```

o

```javascript
{
    method:"DELETE"
}
```

## token

Si existe se añade automáticamente

```
Authorization: Bearer TOKEN
```

---

# BASE_URL

En lugar de escribir muchas veces

```
http://localhost:8000/api/posts/
```

solo escribimos

```javascript
request("/posts/")
```

Si cambia el servidor únicamente se modifica una línea.

---

# ¿Qué hace ...options?

Cuando llamamos

```javascript
request("/posts/",{
    method:"POST",
    body:JSON.stringify(datos)
})
```

internamente termina construyendo

```javascript
fetch(url,{
    method:"POST",
    body:"...",
    headers:{...}
})
```

`...options` inserta todas las propiedades del objeto recibido.

---

# Manejo de errores

## Error HTTP

```javascript
if(!response.ok)
    throw new Error(...)
```

Detecta errores:

- 400
- 401
- 403
- 404
- 500

---

## DELETE

Un DELETE normalmente responde

```
204 No Content
```

No existe JSON.

Por eso primero se verifica

```javascript
if(response.status===204)
    return true
```

Evita intentar ejecutar

```javascript
response.json()
```

cuando no existe contenido.

---

# Cuestionamientos realizados durante la clase

## ¿Solo cambia el method entre GET y POST?

No.

POST normalmente necesita:

- method
- body
- Content-Type

Y si la API está protegida:

- Authorization Bearer Token

---

## ¿Por qué mi componente no usa async?

Porque el componente no hace el fetch.

Quien hace el fetch es el hook o el servicio.

---

## ¿Mi useFetch solo sirve para GET?

Generalmente sí.

Tiene sentido porque un GET ocurre al cargar la pantalla.

POST, PATCH y DELETE normalmente dependen de una acción del usuario.

---

# Escenario 1: usar únicamente postsService

Muy común.

```
services/

postsService.js
usersService.js
authService.js
```

Ejemplo

```javascript
useEffect(()=>{
    async function cargar(){
        const posts=await postsService.getAll();
        setPosts(posts);
    }

    cargar();
},[])
```

Ventajas

- menos código
- toda la comunicación con la API está centralizada
- fácil mantenimiento

---

# Escenario 2: usar postsService + Hooks

También muy común.

```
services/
    postsService.js

hooks/
    usePosts.js
```

El hook NO conoce fetch.

Solo utiliza el servicio.

```javascript
function usePosts(){

    const [posts,setPosts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{

        async function cargar(){

            try{

                const data=await postsService.getAll();
                setPosts(data);

            }catch(e){

                setError(e);

            }finally{

                setLoading(false);

            }

        }

        cargar();

    },[]);

    return {posts,loading,error};

}
```

El componente queda muy limpio.

```javascript
const {posts,loading,error}=usePosts();
```

---

# Comparación

| Solo postsService | postsService + Hook |
|-------------------|---------------------|
| Más simple | Más organizado |
| Ideal para proyectos pequeños | Ideal para proyectos medianos y grandes |
| El componente maneja loading/error | El hook maneja loading/error |
| Menos archivos | Mejor separación de responsabilidades |

---

# Conclusión

`postsService` y `useFetch` no compiten.

Tienen responsabilidades distintas.

- **postsService** se encarga de comunicarse con la API.
- **Hooks** gestionan estado, ciclo de vida y lógica reutilizable de React.
- **Componentes** muestran la interfaz.

En proyectos profesionales es muy habitual trabajar con servicios para la comunicación HTTP y, cuando es necesario, crear hooks específicos (por ejemplo `usePosts`) que consumen esos servicios.
