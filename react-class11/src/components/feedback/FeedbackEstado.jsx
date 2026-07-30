import EstadoCarga from "./EstadoCarga";
import EstadoError from "./EstadoError";
import EstadoVacio from "./EstadoVacio";

// Orquestador genérico de los 3 estados de UI (cargando/error/vacío)
// Si ninguno aplica, renderiza los children (los datos reales)
export function FeedbackEstado({
  cargando,
  error,
  vacio,
  mensajeCarga,
  mensajeError,
  mensajeVacio,
  onReintentar,
  accionVacio,
  textoAccionVacio,
  children,
}) {
  if (cargando) {
    return <EstadoCarga mensaje={mensajeCarga} />;
  }

  if (error) {
    return (
      <EstadoError
        mensaje={mensajeError || error}
        onReintentar={onReintentar}
      />
    );
  }

  if (vacio) {
    return (
      <EstadoVacio
        mensaje={mensajeVacio}
        accion={accionVacio}
        textoAccion={textoAccionVacio}
      />
    );
  }

  return children;
}
