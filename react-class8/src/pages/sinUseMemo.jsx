import { useState } from "react";

// ============================================
// BLOQUE 1: Datos falsos (simulan una API)
// ============================================
function generarDatos(cantidad) {
  const datos = [];
  for (let i = 0; i < cantidad; i++) {
    datos.push({ id: i, nombre: `Producto ${i}` });
  }
  return datos;
}

const DATOS = generarDatos(20000);

// ============================================
// BLOQUE 2: Filtro "pesado" a propósito
// ============================================
function filtrarPesado(datos, texto) {
  console.time("filtrado"); // mide cuánto tarda esto en la consola

  // Trabajo extra inútil, solo para exagerar el costo
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
// BLOQUE 3: Componente SIN useMemo (roto)
// ============================================
export function AppSinUseMemo() {
  const [busqueda, setBusqueda] = useState("");
  const [contador, setContador] = useState(0);

  // ⚠️ Esto se recalcula en CADA render, sin importar la causa
  const resultado = filtrarPesado(DATOS, busqueda);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>❌ Versión SIN useMemo</h1>

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
