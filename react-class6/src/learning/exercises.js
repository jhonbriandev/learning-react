// 1. Crea src/hooks/useFetch.js con:
//    - useState para data, cargando y error
//    - useEffect con la url como dependencia
//    - AbortController para cleanup
//    - Retorna { data, cargando, error }

// 2. Refactoriza Posts.jsx para usar useFetch
//    en lugar del useState + useEffect que tenía antes
//    El componente debe quedar más corto y limpio

// 3. Refactoriza PostDetalle.jsx para usar useFetch
//    combinado con useParams del día anterior

// 4. Crea src/hooks/useForm.js con:
//    - useState para valores y errores
//    - manejarCambio que actualiza el campo por nombre
//    - validarFormulario que llama a la función de validación
//    - resetear que vuelve a los valores iniciales
//    - Retorna { valores, errores, manejarCambio,
//               validarFormulario, resetear }

// 5. Refactoriza Login.jsx para usar useForm
//    con validación de username (obligatorio) y
//    password (mínimo 8 caracteres)

// Verifica que todo sigue funcionando igual que antes
// — el comportamiento no debe cambiar, solo el código interno
