function EstadoVacio({ mensaje, accion, textoAccion }) {
  return (
    <div className="estado-vacio">
      <p>{mensaje || "No hay datos disponibles"}</p>
      {/* El botón de acción es opcional: solo aparece si se pasa "accion" */}
      {accion && (
        <button onClick={accion} className="btn btn-primario">
          {textoAccion || "Agregar"}
        </button>
      )}
    </div>
  );
}

export default EstadoVacio;
