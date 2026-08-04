function EstadoError({ mensaje, onReintentar }) {
  return (
    <div className="estado-error">
      <span className="error-icono">⚠️</span>
      {/* Typo corregido: "Feedback" en vez de "Feddback" */}
      <p>{mensaje || "Ocurrió un error inesperado manejado por Feedback"}</p>
      {onReintentar && (
        <button onClick={onReintentar} className="btn btn-secundario">
          Reintentar
        </button>
      )}
    </div>
  );
}

export default EstadoError;
