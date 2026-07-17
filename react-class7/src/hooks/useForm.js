import { useState } from "react";

// Este hook centraliza la lógica que se repite en TODOS tus formularios:
// guardar los valores de los campos, validar, mostrar errores, y limpiar
// el formulario. En vez de reescribir esto en Login, FormPost, etc,
// lo escribimos una sola vez acá y lo reutilizamos.
export function useForm(valoresIniciales, validar) {
  // valores: un objeto con TODOS los campos del formulario, ej:
  // { username: "", password: "" } o { title: "", content: "", ... }
  const [valores, setValores] = useState(valoresIniciales);

  // errores: un objeto con los mensajes de error por campo, ej:
  // { title: "El título es obligatorio" }
  const [errores, setErrores] = useState({});

  // enviando: true mientras se está procesando el envío (para
  // deshabilitar el botón y evitar doble clic, por ejemplo).
  const [enviando, setEnviando] = useState(false);

  // --- manejarCambio: el corazón de este hook ---
  // Esta es la función que se conecta al onChange de CADA input.
  // Ver la explicación detallada de eventos y onChange más abajo
  // (fuera de este archivo), pero acá el resumen línea por línea:
  function manejarCambio(e) {
    // "e" es el objeto EVENTO que el navegador crea automáticamente
    // cada vez que el usuario escribe algo en un input. Contiene toda
    // la información de qué pasó: en qué elemento, con qué valor, etc.
    //
    // e.target es el elemento HTML real donde ocurrió el evento
    // (el <input> específico que el usuario tocó).
    // De ahí sacamos dos datos con destructuring:
    // - name: el atributo "name" del input (ej: "username", "title")
    // - value: lo que el usuario tiene escrito en ESE momento
    const { name, value } = e.target;

    // Actualizamos el objeto "valores", pero solo el campo que cambió.
    // "prev" es el valor anterior de "valores" (React nos lo pasa
    // automáticamente si usamos esta forma de función).
    // { ...prev, [name]: value } arma un objeto NUEVO copiando todo
    // lo que había antes (...prev), pero pisando la propiedad que
    // coincide con el nombre del campo actual.
    //
    // Ejemplo: si el usuario escribe en el input "title", esto hace:
    // { ...prev, title: "lo que escribió" }
    // sin tocar los demás campos (content, category, etc).
    setValores((prev) => ({ ...prev, [name]: value }));

    // Si ese campo tenía un error de validación previo, lo borramos
    // apenas el usuario empieza a corregirlo (mejor experiencia que
    // esperar a que reenvíe todo el formulario para limpiar el error).
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  }

  // --- validarFormulario ---
  // Se llama manualmente en el onSubmit del formulario (no en cada
  // tecla, solo al intentar enviar). Ejecuta la función "validar" que
  // le pasaste al hook (por ejemplo, validarLogin), y guarda los
  // errores resultantes.
  function validarFormulario() {
    if (!validar) return true; // si no se pasó función de validación, no valida nada
    const erroresNuevos = validar(valores);
    setErrores(erroresNuevos);
    // Devuelve true solo si el objeto de errores quedó vacío
    return Object.keys(erroresNuevos).length === 0;
  }

  // --- resetear ---
  // Vuelve el formulario a su estado inicial. Útil, por ejemplo,
  // después de crear un post exitosamente, si quisieras limpiar
  // los campos en vez de ocultar el formulario.
  function resetear() {
    setValores(valoresIniciales);
    setErrores({});
  }

  // Devolvemos todo lo que un componente que use este hook va a
  // necesitar. Si algo no está en este objeto, no se puede usar
  // afuera (por eso, cuando faltaba "setValores" acá, tirabas el
  // error "setValores is not a function").
  return {
    valores,
    errores,
    enviando,
    setEnviando,
    setValores,
    manejarCambio,
    validarFormulario,
    resetear,
  };
}
