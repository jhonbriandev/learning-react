// Diagnóstico:
// El useEffect solo se ejecuta una vez porque [] indica
// que no depende de ningún valor.

useEffect(() => {
  fetch(`/api/posts?categoria=${categoria}`);
}, []);

// Solución:
// Agregamos la variable que controla la petición.

useEffect(() => {
  fetch(`/api/posts?categoria=${categoria}`);
}, [categoria]);

// La dependencia no es necesariamente "categoria".
// Debe ser el valor que cambia y modifica la petición.

// Puede ser:
// categoria
// slug
// idCategoria
// filtro

// Ejemplo:
// Si la URL cambia:
//
// /blog/react
// /blog/python
//
// y usamos slug:

useEffect(() => {
  fetch(`/api/posts?categoria=${slug}`);
}, [slug]);

// Regla:
// Si el efecto usa una variable externa que puede cambiar,
// esa variable debe estar en las dependencias.

// Cuando cambia:
// 1. React renderiza nuevamente.
// 2. React compara las dependencias.
// 3. Si detecta cambio, ejecuta el efecto.
