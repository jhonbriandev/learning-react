// ─────────────────────────────────────────────────────────────
// DÍA 4 — Concepto 3: Link y NavLink
// ─────────────────────────────────────────────────────────────
// <a href> recarga toda la página — destruye el estado de React.
// <Link> navega sin recargar — solo cambia qué componente se muestra.
// <NavLink> es igual a Link pero agrega una clase CSS automática
// cuando la ruta está activa (útil para menús de navegación).
//
// RUTA SUGERIDA en App.jsx:
//   <Route path="/dia4/link-y-navlink" element={<LinkDemo />} />
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function LinkDemo() {
  // Este contador demuestra que Link NO recarga la página.
  // Si usaras <a href>, el contador volvería a 0 con cada clic.
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔗 Concepto 3: Link y NavLink</h2>

      {/* ── DEMO: Link vs <a> ───────────────────────────────── */}
      <div style={styles.card}>
        <p style={styles.text}>
          El contador de abajo demuestra la diferencia clave. Si navegas con{" "}
          <code>{"<a>"}</code>, el contador se resetea. Con{" "}
          <code>{"<Link>"}</code>, el estado de React se mantiene.
        </p>

        <div style={styles.counterRow}>
          <span style={styles.counterText}>
            Contador: <strong>{count}</strong>
          </span>
          <button
            onClick={() => setCount((c) => c + 1)}
            style={styles.counterButton}
          >
            +1
          </button>
        </div>

        <div style={styles.comparisonRow}>
          {/* ❌ <a> normal — recargaría y perdería el contador */}
          <div style={styles.column}>
            <p style={styles.badLabel}>❌ Con {"<a>"} href — recarga</p>
            <a href="/dia4/link-y-navlink" style={styles.badLink}>
              Ir a esta página (recarga)
            </a>
            <p style={styles.note}>El contador volvería a 0</p>
          </div>

          {/* ✅ <Link> — no recarga */}
          <div style={styles.column}>
            <p style={styles.goodLabel}>✅ Con {"<Link>"} — sin recarga</p>
            <Link to="/dia4/link-y-navlink" style={styles.goodLink}>
              Ir a esta página (sin recarga)
            </Link>
            <p style={styles.note}>El contador se mantiene</p>
          </div>
        </div>
      </div>

      {/* ── NavLink — clase activa automática ───────────────── */}
      <div style={styles.card}>
        <p style={styles.text}>
          <strong>NavLink</strong> agrega automáticamente la clase{" "}
          <code>activo</code> cuando estás en esa ruta. Perfecto para menús de
          navegación.
        </p>

        {/* Menú de ejemplo con NavLink */}
        <nav style={styles.demoMenu}>
          {[
            { to: "/dia4/browser-router", label: "BrowserRouter" },
            { to: "/dia4/routes-y-route", label: "Routes y Route" },
            { to: "/dia4/link-y-navlink", label: "Link y NavLink" },
            { to: "/dia4/use-navigate", label: "useNavigate" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? "#3b82f6" : "#1e293b",
                color: isActive ? "#fff" : "#94a3b8",
                fontWeight: isActive ? "700" : "400",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>Código — NavLink con estilo activo</p>
          <pre
            style={styles.pre}
          >{`import { Link, NavLink } from 'react-router-dom'

// Link básico — solo navega
<Link to="/posts">Ver posts</Link>

// NavLink — agrega estilo cuando la ruta está activa
<NavLink
  to="/posts"
  style={({ isActive }) => ({
    color: isActive ? 'white' : 'gray',
    fontWeight: isActive ? 'bold' : 'normal',
  })}
>
  Posts
</NavLink>

// También puedes usar className en lugar de style:
<NavLink
  to="/posts"
  className={({ isActive }) => isActive ? 'activo' : ''}
>
  Posts
</NavLink>`}</pre>
        </div>
      </div>

      <Link to="/dia4/use-navigate" style={styles.next}>
        Siguiente → <code>/dia4/use-navigate</code>
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
  counterRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#0f172a",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "16px",
  },
  counterText: { fontSize: "18px", color: "#f1f5f9" },
  counterButton: {
    padding: "6px 14px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "700",
  },
  comparisonRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  column: { background: "#0f172a", borderRadius: "10px", padding: "14px" },
  badLabel: {
    fontSize: "12px",
    color: "#f87171",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  goodLabel: {
    fontSize: "12px",
    color: "#4ade80",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  badLink: {
    display: "block",
    color: "#f87171",
    fontSize: "13px",
    marginBottom: "6px",
  },
  goodLink: {
    display: "block",
    color: "#4ade80",
    fontSize: "13px",
    marginBottom: "6px",
    textDecoration: "none",
  },
  note: { fontSize: "11px", color: "#64748b", margin: "4px 0 0" },
  demoMenu: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  navItem: {
    padding: "8px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    transition: "all 0.2s",
  },
  codeBlock: {
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "16px",
  },
  codeTitle: {
    fontSize: "11px",
    color: "#64748b",
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
  next: { fontSize: "13px", color: "#64748b", textAlign: "right" },
};

export default LinkDemo;
