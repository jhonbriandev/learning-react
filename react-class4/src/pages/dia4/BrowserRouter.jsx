// ─────────────────────────────────────────────────────────────
// DÍA 4 — Concepto 1: BrowserRouter
// ─────────────────────────────────────────────────────────────
// BrowserRouter es el "contenedor raíz" de todo el sistema de rutas.
// Va en main.jsx, envolviendo toda la app.
// Sin él, ningún Link, Route ni useNavigate funciona.
//
// CÓMO VER ESTE CONCEPTO:
// Este archivo NO se usa directamente como página.
// Muestra cómo debe quedar tu main.jsx.
// ─────────────────────────────────────────────────────────────

// ── Así debe quedar tu main.jsx ──────────────────────────────
//
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'   ← importas BrowserRouter
// import App from './App.jsx'
// import './index.css'
//
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>        ← envuelve toda la app
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// )
//
// ¿Por qué envuelve TODA la app?
// Porque cualquier componente adentro puede ahora usar:
//   - <Link> para navegar
//   - <Route> para mostrar páginas
//   - useNavigate(), useParams(), useLocation()
// Si no está BrowserRouter arriba, esos hooks lanzan error.

// ── Componente visual para entender el concepto ──────────────
// Ruta sugerida en App.jsx:
//   <Route path="/dia4/browser-router" element={<BrowserRouterDemo />} />
import { Link } from "react-router-dom";

function BrowserRouterDemo() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Concepto 1: BrowserRouter</h2>
      <div style={styles.card}>
        <p style={styles.text}>
          <strong>¿Qué es?</strong> El componente que le da a React control
          sobre la URL del navegador. Va una sola vez, en <code>main.jsx</code>,
          envolviendo toda la app.
        </p>

        <div style={styles.analogy}>
          🏢 <strong>Analogía:</strong> Es como el edificio entero. Sin el
          edificio, no hay habitaciones (rutas). BrowserRouter es la
          infraestructura que hace posible todo lo demás.
        </div>

        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>main.jsx</p>
          <pre
            style={styles.pre}
          >{`import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)`}</pre>
        </div> 

        <ul style={styles.list}>
          <li>
            ✅ Va en <code>main.jsx</code>, no en <code>App.jsx</code>
          </li>
          <li>✅ Solo se escribe UNA vez en todo el proyecto</li>
          <li>✅ Todo lo demás de React Router va adentro de él</li>
          <li>❌ Si lo olvidas, los hooks de router lanzan un error</li>
        </ul>
      </div>
      // ✅ Ahora — Link real que navega al hacer clic
      <Link to="/dia4/routes-y-route" style={styles.next}>
        {/* Link navega a la siguiente lección sin recargar la página.
            Antes era solo un <p> con texto — visualmente igual,
            pero no hacía nada al hacer clic. */}
        Siguiente → <code>/dia4/routes-y-route</code>
      </Link>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "system-ui, sans-serif",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#f1f5f9",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "20px",
    color: "#f8fafc",
  },
  card: {
    background: "#1e293b",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
  },
  text: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#cbd5e1",
    marginBottom: "16px",
  },
  analogy: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "16px",
    lineHeight: "1.6",
  },
  codeBlock: {
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
  },
  codeTitle: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: "700",
    textTransform: "uppercase",
    margin: "0 0 8px",
  },
  pre: {
    margin: 0,
    fontSize: "13px",
    color: "#7dd3fc",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
  },
  list: {
    paddingLeft: "20px",
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "2",
  },
  next: { fontSize: "13px", color: "#64748b", textAlign: "right" },
};

export default BrowserRouterDemo;
