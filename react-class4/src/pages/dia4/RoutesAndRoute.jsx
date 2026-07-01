// ─────────────────────────────────────────────────────────────
// DÍA 4 — Concepto 2: Routes y Route
// ─────────────────────────────────────────────────────────────
// Routes es el contenedor que evalúa la URL actual y decide
// qué Route mostrar. Solo muestra UNA ruta a la vez.
//
// Route conecta una URL (path) con un componente (element).
// Es exactamente lo mismo que urls.py en Django, pero en React.
//
// RUTA SUGERIDA en App.jsx:
//   <Route path="/dia4/routes-y-route" element={<RoutesDemo />} />
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link } from "react-router-dom";

// Simulamos el comportamiento de Routes/Route visualmente.
// En tu app real, Routes evalúa la URL del navegador automáticamente.
// Aquí lo simulamos con estado para que puedas verlo sin cambiar URLs.

// Estas son las "páginas" que se mostrarían según la ruta
function HomePage() {
  return (
    <div style={styles.page}>
      🏠 Estás en <strong>/</strong> — esta es la página de inicio
    </div>
  );
}
function PostsPage() {
  return (
    <div style={styles.page}>
      📝 Estás en <strong>/posts</strong> — aquí va el listado de posts
    </div>
  );
}
function LoginPage() {
  return (
    <div style={styles.page}>
      🔑 Estás en <strong>/login</strong> — aquí va el formulario de login
    </div>
  );
}
function NotFoundPage() {
  return (
    <div style={styles.page}>
      ❌ Estás en una ruta <strong>no definida</strong> — esto es el comodín *
    </div>
  );
}

// Mapa de rutas: igual a cómo lo defines en App.jsx con <Route />
// path → qué componente renderizar
const ROUTES = {
  "/": <HomePage />,
  "/posts": <PostsPage />,
  "/login": <LoginPage />,
  "*": <NotFoundPage />,
};

function RoutesDemo() {
  // Simulamos la URL actual del navegador
  const [currentRoute, setCurrentRoute] = useState("/");

  // Busca la ruta en el mapa, si no existe cae en el comodín *
  // Esto es exactamente lo que hace <Routes> internamente
  const componentToShow = ROUTES[currentRoute] || ROUTES["*"];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🗺️ Concepto 2: Routes y Route</h2>

      <div style={styles.card}>
        <p style={styles.text}>
          <strong>Routes</strong> mira la URL y decide qué{" "}
          <strong>Route</strong> mostrar. Solo muestra una a la vez. Haz clic en
          las rutas de abajo para simularlo:
        </p>

        {/* Botones que simulan "ir a una ruta" */}
        <div style={styles.routeButtons}>
          {["/", "/posts", "/login", "/ruta-inexistente"].map((route) => (
            <button
              key={route}
              onClick={() => setCurrentRoute(route)}
              style={{
                ...styles.routeButton,
                background: currentRoute === route ? "#3b82f6" : "#1e293b",
                border:
                  currentRoute === route
                    ? "1px solid #3b82f6"
                    : "1px solid #334155",
              }}
            >
              {route}
            </button>
          ))}
        </div>

        {/* Aquí se "renderiza" la página según la ruta — igual que <Outlet /> */}
        <div style={styles.preview}>
          <p style={styles.label}>▶ Componente que se renderiza:</p>
          {componentToShow}
        </div>

        {/* El código real que usas en App.jsx */}
        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>App.jsx — código real</p>
          <pre
            style={styles.pre}
          >{`import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      {/* path exacto → componente */}
      <Route path="/"       element={<Home />} />
      <Route path="/posts"  element={<Posts />} />
      <Route path="/login"  element={<Login />} />

      {/* * captura cualquier ruta no definida → 404 */}
      <Route path="*"       element={<NotFound />} />
    </Routes>
  )
}`}</pre>
        </div>

        <div style={styles.comparison}>
          <p style={styles.comparisonTitle}>🔁 Comparación con Django</p>
          <pre
            style={styles.pre}
          >{`# Django urls.py              # React App.jsx
path('', vista_home)          <Route path="/" element={<Home />} />
path('posts/', lista)         <Route path="/posts" element={<Posts />} />
path('login/', login_view)    <Route path="/login" element={<Login />} />`}</pre>
        </div>
      </div>

      <Link to="/dia4/link-y-navlink" style={styles.next}>
        Siguiente → <code>/dia4/link-y-navlink</code>
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
  routeButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  routeButton: {
    padding: "8px 14px",
    borderRadius: "8px",
    color: "#f1f5f9",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  preview: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    margin: "0 0 10px",
  },
  page: {
    background: "#1e293b",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "14px",
    color: "#e2e8f0",
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
  comparison: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "16px",
  },
  comparisonTitle: {
    fontSize: "13px",
    color: "#94a3b8",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  next: { fontSize: "13px", color: "#64748b", textAlign: "right" },
};

export default RoutesDemo;
