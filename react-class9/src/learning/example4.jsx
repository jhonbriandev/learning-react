// Supón que en tu FormPost quieres usar un componente de selección de categoría más avanzado (por ejemplo,
// una librería de "select" con estilos custom, tipo react-select) que no es un <input> o <select> nativo,
// sino un componente controlado por props value y onChange.

// Pregunta: ¿usarías register normal para conectarlo a RHF, o necesitarías otra herramienta?
// (Pista: investiga qué es Controller en react-hook-form y cuándo se usa vs register).
// Explica tu razonamiento, no hace falta código todavía.

// Bien lo que entendi fue que hay elementos HTML nativos que controlare con React y otros que no, pueden
// ser mas avanzados o de libreriras, por ejemplo un DatePicker, por lo cual este no se comunica con register
// sino con un controller, que mediara con react, y dentro de este un <select></select> que ya no usara register
// sino un field
