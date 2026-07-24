// Ejercicio 3 — Decidir si hace falta useMemo

// Para cada caso, responde sí o no y una frase justificando por qué:

// a) const iniciales = usuario.nombre[0] + usuario.apellido[0]
// No se usa, estamos buscando dos datos exactos que ya estan identificados en memoria en sus espacios [0]
// b) const productosOrdenados = productos.sort((a,b) => a.precio - b.precio) sobre un array de 10,000 productos
// Si se usa porque estamos haciendo un ordenamiento pasando por los 10 mil productos, entonces esto si tardara ms, usaremos usememo
// c) const esMayorDeEdad = edad >= 18
// No se usara solo se evalua dos condiciones, mayor e igual
// d) const totalConImpuestos = items.reduce((sum, i) => sum + i.precio * 1.18, 0) sobre un carrito de 3 productos
// Es una operacion sencilla y tenemos solo 3 items asi que no usaremos useMemo
