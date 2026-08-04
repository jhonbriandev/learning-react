import { useToggle } from "./exercises7";

export function Toggle() {
  // 1. Usamos nuestro hook personalizado.
  //    "estado" guarda el estado actual (true/false).
  //    "alternar" es la función que lo cambia (viene de "alternar" en el hook).
  const [estado, alternar] = useToggle();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* 2. Al hacer clic, se ejecuta "alternar", que invierte el estado.
             No usamos alternar() con paréntesis aquí, porque solo queremos
             pasarle la REFERENCIA a la función, no ejecutarla al momento
             de renderizar (eso rompería el toggle).
             
             El texto del botón cambia según el valor de "estado":
             si es true → "TURN ON", si es false → "TURN OFF" (operador ternario). */}
      <button onClick={alternar}>{estado ? "TURN ON" : "TURN OFF"}</button>

      {/* 3. Este párrafo solo aparece si "estado" es true.
             Si es false, no se muestra nada (operador &&). */}
      {estado && <p> El toggle esta activo</p>}
    </div>
  );
}
