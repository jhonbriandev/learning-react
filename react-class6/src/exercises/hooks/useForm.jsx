import { useState } from "react";

function useForm(valoresIniciales, validar) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Manejar cambio en cualquier campo
  function manejarCambio(e) {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo cuando el usuario empieza a corregir
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  }

  // Validar y retornar si el formulario es válido
  function validarFormulario() {
    if (!validar) return true;
    const erroresNuevos = validar(valores);
    setErrores(erroresNuevos);
    return Object.keys(erroresNuevos).length === 0;
  }

  // Limpiar el formulario
  function resetear() {
    setValores(valoresIniciales);
    setErrores({});
  }

  return {
    valores,
    errores,
    enviando,
    setEnviando,
    manejarCambio,
    validarFormulario,
    resetear,
  };
}

export default useForm;
