// Corrección de código: Este useMemo no tiene sentido usarlo así. Corrígelo y explica por qué estaba mal:

const saludo = useMemo(() => `Hola, ${nombre}`, []);

// No es necesario usar memo, la finalidad de useMemo es no volver a calcular algo que
// podria ser pesado o costoso en nuestra funcion y solo recalcularlo si el valor dependiente cambie
// En este caso solo es un string que esta anidado a un valor, no cambiante ni calculante de manera matematica
// No es lo optimo gastaremos mas en usar USEMEMO, mejor escribirlo asi

const saludo = `Hola, ${nombre}`;
