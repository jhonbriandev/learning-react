// Crea un componente ErrorBoundary completo y reutilizable para tu proyecto, con estos requisitos:

// Debe atrapar errores de renderizado en sus componentes hijos (ya sabes cómo)
// El mensaje de fallback debe ser configurable desde afuera — es decir, quien use <ErrorBoundary> debe
// poder pasarle un mensaje personalizado como prop (ej: <ErrorBoundary mensaje="Error al cargar los posts">),
// con un valor por defecto si no se pasa nada
// Debe incluir un botón "Reintentar" que, al hacer click, resetee el estado de error para que
// React intente renderizar los hijos de nuevo (pista: piensa qué necesitas cambiar en el state para "deshacer"
// el hasError: true)
// Debe usar componentDidCatch para loggear el error a la consola, tal como vimos en la teoría
