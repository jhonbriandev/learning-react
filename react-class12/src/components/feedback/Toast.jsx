import { useState, useEffect } from "react";

export function Toast({
  mensaje,
  tipo = "success",
  duracion = 3000,
  onCerrar,
}) {
  const [visible, setVisible] = useState(true);

  // Auto-cierre: tras "duracion" ms, inicia animación de salida,
  // y 300ms después notifica al padre para remover el toast del array
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onCerrar, 300); // da tiempo a la animación CSS
    }, duracion);

    return () => clearTimeout(timer); // limpieza si el componente se desmonta antes
  }, [duracion, onCerrar]);

  const iconos = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div className={`toast toast-${tipo} ${visible ? "visible" : "saliendo"}`}>
      <span>{iconos[tipo]}</span>
      <p>{mensaje}</p>
      {/* NOTA: cierre manual no espera los 300ms de animación como el cierre automático */}
      <button
        onClick={() => {
          setVisible(false);
          onCerrar();
        }}
      >
        ×
      </button>
    </div>
  );
}
