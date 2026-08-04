function EstadoCarga({ mensaje = "Cargando..." }) {
  return (
    <div className="estado-carga">
      <div className="spinner" />
      <p>{mensaje}</p>
    </div>
  );
}

export default EstadoCarga;
