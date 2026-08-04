// 3. Caso de decisión: Tienes un objeto con 5 campos (status, data, error, pagina, total)
// que cambian juntos según la respuesta de la API.
// ¿useState x5 o useReducer? Justifica.

// AL INICIO PENSE:
// Usaria useState para error, data, pagina y total pero para status no, porque los estados son excluyentres entre si
// Son escenarios que solo se cumplen uno o el otro, asi que usaria useReducer para este.
// PERO: LUEGO CORREGI:

// Teniendo esos estados y  todos cambian juntos por la misma lógica (respuesta de una API),
// es mejor manejar todo con useReducer.

// 4. Caso de decisión: ¿Usarías useContext o pasar props directamente para mostrar el nombre de usuario en el Navbar?
//  ¿Y para el ToastContext? Explica la diferencia entre ambos casos.

// En ambos casos usaria context, es mas ordeando, es mas de buena practica y ademas estos componentes son hijos de otros
// Para pasarlo como simple prop haria drop drilling y mandaria los props a componentes que no lo usarian
// Asi que como ya lo he practicado es mejor hacerlo con context, provider y su aplicacion en el componente
