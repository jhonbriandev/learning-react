// Ahora un ejercicio distinto: no hay que corregir código, sino decidir y justificar.

// Tienes tres componentes en tu blog:

// MyPosts — lista de posts del usuario autenticado (lo que ya trabajamos)
// FormPost — formulario para crear/editar un post
// CardPost — tarjeta individual que muestra un post ya cargado (recibe post como prop, no hace fetch propio)

// Pregunta:

// ¿En cuál(es) de estos 3 componentes tiene sentido usar los estados status (loading/error/success)
// que vimos hoy, y en cuál(es) no tiene sentido usarlos? Justifica tu respuesta para cada uno —
// no basta con decir sí o no, explica el por qué basado en si el componente hace o no una operación asíncrona (fetch).

// Y una segunda parte de este mismo ejercicio: si CardPost nunca hace fetch (solo recibe post como prop ya cargado)
// , ¿tendría sentido envolverlo en un <ErrorBoundary>? ¿Por qué sí o por qué no,
// considerando lo que aprendiste hoy sobre qué tipo de errores atrapa un ErrorBoundary?

// Tómate tu tiempo con la justificación — este ejercicio es más sobre criterio que sobre sintaxis.

// En el primer caso entiendo que myPost hace trabajo asincrono, igual que formpost, por lo cual
// ambos podrian tener la aplicacion de los status, uno es GET el otro es POST, ambos podrian fallar
// en sus peticiones, pero CardPost no, porque CardPost solo se mostrara si todo salio correcto

// Segunda respuesta, si pasaria el ejemplo de post = null, seria un error de render
// porque el fetch aunque me brinde datos malos si fue hecho
// de manera correcta, entonces si es necesario tambien envolverlo en ErrorBonduary,
// de hecho muchos indican que todo APP este dentro de este ErrorB
