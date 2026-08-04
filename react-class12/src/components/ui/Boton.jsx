export function Boton({
  children,
  variante = "primario",
  tamaño = "md",
  cargando = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || cargando}
      className={`btn btn-${variante} btn-${tamaño} ${className}`}
    >
      {cargando ? "Cargando..." : children}
    </button>
  );
}
