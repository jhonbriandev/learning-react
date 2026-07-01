// ─────────────────────────────────────────────────────────────
// DÍA 4 — Concepto 6: Layout compartido con Outlet
// ─────────────────────────────────────────────────────────────
// Cuando varias páginas comparten navbar y footer,
// en lugar de repetir ese código en cada página,
// creas un componente Layout con <Outlet />.
//
// Outlet marca el lugar donde se renderiza la página hija.
// Es como un "hueco" en el layout que se rellena con
// el componente que coincida con la ruta actual.
//
// RUTA SUGERIDA en App.jsx:
//   <Route path="/dia4/layout" element={<LayoutDemo />} />
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link } from "react-router-dom";

// ── Páginas hijas de ejemplo ─────────────────────────────────
// En tu app real estas serían Home.jsx, Posts.jsx, etc.
function HomeContent() {
  return (
    <div style={styles.childPage}>
      🏠 <strong>Home</strong> — Bienvenido al blog
    </div>
  );
}
function PostsContent() {
  return (
    <div style={styles.childPage}>
      📝 <strong>Posts</strong> — Lista de artículos
    </div>
  );
}
function LoginContent() {
  return (
    <div style={styles.childPage}>
      🔑 <strong>Login</strong> — Formulario de acceso
    </div>
  );
}

// Mapa de páginas para la simulación
const PAGES = {
  home: <HomeContent />,
  posts: <PostsContent />,
  login: <LoginContent />,
};

function LayoutDemo() {
  // Simulamos qué "página hija" está activa
  // En tu app real, React Router lo decide según la URL
  const [activePage, setActivePage] = useState("home");

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🖼️ Concepto 6: Layout con Outlet</h2>

      <div style={styles.card}>
        <p style={styles.text}>
          El <strong>Layout</strong> tiene el navbar y footer. El{" "}
          <strong>Outlet</strong> es el hueco donde va la página según la ruta.
          Haz clic en el menú de abajo para ver cómo cambia solo el contenido:
        </p>

        {/* ── SIMULACIÓN DEL LAYOUT ── */}
        <div style={styles.simulatedLayout}>
          {/* NAVBAR — parte del Layout, siempre visible */}
          <nav style={styles.navbar}>
            <span style={styles.fakeLogo}>📖 Mi Blog</span>
            <div style={styles.navLinks}>
              {[
                { key: "home", label: "Inicio" },
                { key: "posts", label: "Posts" },
                { key: "login", label: "Login" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActivePage(item.key)}
                  style={{
                    ...styles.navButton,
                    background:
                      activePage === item.key ? "#3b82f6" : "transparent",
                    color: activePage === item.key ? "#fff" : "#94a3b8",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* OUTLET — aquí cambia el contenido según la ruta */}
          <main style={styles.main}>
            <p style={styles.outletLabel}>{"<Outlet />"} ↓</p>
            {PAGES[activePage]}
          </main>

          {/* FOOTER — parte del Layout, siempre visible */}
          <footer style={styles.footer}>
            Mi Blog © 2026 — este footer siempre está aquí
          </footer>
        </div>

        {/* Código real */}
        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>Layout.jsx — código real</p>
          <pre style={styles.pre}>{`// src/components/Layout.jsx
import { Outlet, Link } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/login">Login</Link>
      </nav>

      <main>
        <Outlet />
        {/* React Router renderiza aquí la página hija */}
      </main>

      <footer>Mi Blog © 2026</footer>
    </div>
  )
}`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>App.jsx — rutas anidadas</p>
          <pre style={styles.pre}>{`function App() {
  return (
    <Routes>
      {/* Layout es la ruta padre */}
      <Route path="/" element={<Layout />}>

        {/* index → se muestra cuando la URL es exactamente "/" */}
        <Route index element={<Home />} />

        {/* Las hijas no llevan "/" al inicio */}
        <Route path="posts"        element={<Posts />} />
        <Route path="posts/:slug"  element={<PostDetalle />} />
        <Route path="login"        element={<Login />} />

      </Route>
    </Routes>
  )
}`}</pre>
        </div>

        <div style={styles.note}>
          <strong>¿Qué es index?</strong> Es la ruta que se muestra cuando la
          URL coincide exactamente con el padre (<code>/</code>). Sin{" "}
          <code>index</code>, navegar a <code>/</code> no mostraría ninguna
          página hija.
        </div>
      </div>

      <div style={styles.navRow}>
        <Link to="/dia4/use-params" style={styles.navButtonLink}>
          ← useParams
        </Link>
        <Link to="/dia4/ruta-privada" style={styles.navButtonLink}>
          RutaPrivada →
        </Link>
      </div>
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
  simulatedLayout: {
    border: "2px dashed #334155",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "20px",
  },
  navbar: {
    background: "#0f172a",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #334155",
  },
  fakeLogo: { fontSize: "15px", fontWeight: "700", color: "#f1f5f9" },
  navLinks: { display: "flex", gap: "6px" },
  navButton: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  main: { padding: "20px", minHeight: "100px", background: "#1e293b" },
  outletLabel: {
    fontSize: "11px",
    color: "#3b82f6",
    fontWeight: "700",
    margin: "0 0 10px",
    textTransform: "uppercase",
  },
  childPage: {
    background: "#0f172a",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "15px",
    color: "#e2e8f0",
    lineHeight: "1.6",
  },
  footer: {
    background: "#0f172a",
    padding: "12px 16px",
    borderTop: "1px solid #334155",
    fontSize: "12px",
    color: "#475569",
    textAlign: "center",
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
  note: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.7",
  },
  navRow: { display: "flex", justifyContent: "space-between" },
  navButtonLink: {
    padding: "10px 18px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "#f1f5f9",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default LayoutDemo;
