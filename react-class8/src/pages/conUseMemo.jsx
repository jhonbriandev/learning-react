import { useState, useMemo } from "react";

// ============================================
// BLOQUE 1: Datos falsos (simulan una API)
// ============================================
// Exactamente igual que en la versión rota, sin cambios aquí.
function generarDatos2(cantidad) {
  const datos = [];
  for (let i = 0; i < cantidad; i++) {
    datos.push({ id: i, nombre: `Producto ${i}` });
  }
  return datos;
}

const DATOS2 = generarDatos2(20000);

// ============================================
// BLOQUE 2: Filtro "pesado" a propósito
// ============================================
// También idéntico. El problema nunca estuvo en esta función,
// sino en CUÁNDO se la llamaba.
function filtrarPesado2(datos, texto) {
  console.time("filtrado");

  let basura = 0;
  for (let i = 0; i < 5_000_000; i++) {
    basura += i;
  }

  const resultado = datos.filter((item) =>
    item.nombre.toLowerCase().includes(texto.toLowerCase()),
  );

  console.timeEnd("filtrado");
  return resultado;
}

// ============================================
// BLOQUE 3: Componente CON useMemo (arreglado)
// ============================================
export function AppConUseMemo() {
  const [busqueda, setBusqueda] = useState("");
  const [contador, setContador] = useState(0);

  // ✅ ÚNICO CAMBIO REAL respecto a la versión rota:
  // envolvemos el cálculo caro en useMemo.
  const resultado = useMemo(() => {
    return filtrarPesado2(DATOS2, busqueda);
  }, [busqueda]); // 👈 lista de dependencias: solo re-ejecuta si "busqueda" cambia

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>✅ Versión CON useMemo</h1>

      <button onClick={() => setContador(contador + 1)}>
        Contador: {contador}
      </button>

      <input
        style={{ display: "block", marginTop: 10, padding: 8, width: 250 }}
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <p>Resultados: {resultado.length}</p>
    </div>
  );
}
