// ─────────────────────────────────────────────────────────────
// DÍA 4 — Concepto 7: RutaPrivada
// ─────────────────────────────────────────────────────────────
// RutaPrivada protege páginas que requieren login.
// Antes de mostrar el contenido, revisa si hay un token guardado.
// Si no hay token → redirige al login.
// Si hay token → muestra el contenido protegido.
//
// Conecta directamente con el sistema JWT que construiste en Semana 8.
//
// RUTAS SUGERIDAS en App.jsx:
//   <Route path="/dia4/ruta-privada" element={<RutaPrivadaDemo />} />
//   <Route path="/dia4/dashboard"    element={<RutaPrivada><Dashboard /></RutaPrivada>} />
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

// ── El componente RutaPrivada real ───────────────────────────
// Este es el componente que usarías en tu app.
// Cópialo a src/components/PrivateRoute.jsx
function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    // No autenticado → redirige al login
    // Guarda la ruta actual en state.from para volver después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Autenticado → muestra el contenido protegido
  return children;
}

// ── Página protegida de ejemplo ──────────────────────────────
function Dashboard() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("accessToken");
    navigate("/dia4/ruta-privada");
  }

  return (
    <div style={styles.dashboard}>
      <h3 style={{ margin: "0 0 12px", color: "#f8fafc" }}>
        🔓 Dashboard — Contenido protegido
      </h3>
      <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
        Llegaste aquí porque hay un <code>accessToken</code> en localStorage. Si
        no hubiera token, RutaPrivada te habría redirigido al login.
      </p>
      <button onClick={logout} style={styles.logoutButton}>
        Cerrar sesión (borra el token)
      </button>
    </div>
  );
}

// ── Demo interactiva ─────────────────────────────────────────
function PrivateRouteDemo() {
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useState(
    () => !!localStorage.getItem("accessToken"),
  );

  function simulateLogin() {
    // Simula guardar un token JWT después del login
    localStorage.setItem("accessToken", "token-falso-para-demo-123");
    setHasToken(true);
  }

  function simulateLogout() {
    localStorage.removeItem("accessToken");
    setHasToken(false);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔒 Concepto 7: RutaPrivada</h2>

      <div style={styles.card}>
        <p style={styles.text}>
          RutaPrivada revisa si hay un token antes de mostrar la página. Conecta
          directo con tu sistema JWT de Semana 8.
        </p>

        {/* Estado del token */}
        <div
          style={{
            ...styles.tokenStatus,
            background: hasToken ? "#052e16" : "#450a0a",
            border: `1px solid ${hasToken ? "#4ade80" : "#f87171"}`,
          }}
        >
          {hasToken
            ? "✅ accessToken presente en localStorage → puedes ver el Dashboard"
            : "❌ Sin accessToken → RutaPrivada redirige al login"}
        </div>

        {/* Botones para simular login/logout */}
        <div style={styles.simulateButtons}>
          <button
            onClick={simulateLogin}
            disabled={hasToken}
            style={{
              ...styles.simulateButton,
              opacity: hasToken ? 0.4 : 1,
              background: "#16a34a",
            }}
          >
            Simular login (guarda token)
          </button>
          <button
            onClick={simulateLogout}
            disabled={!hasToken}
            style={{
              ...styles.simulateButton,
              opacity: !hasToken ? 0.4 : 1,
              background: "#dc2626",
            }}
          >
            Simular logout (borra token)
          </button>
        </div>

        {/* Contenido condicional — igual a lo que haría RutaPrivada */}
        {hasToken ? (
          <Dashboard />
        ) : (
          <div style={styles.blocked}>
            🚫 Contenido bloqueado — inicia sesión para acceder
          </div>
        )}

        {/* Código del componente RutaPrivada */}
        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>src/components/PrivateRoute.jsx</p>
          <pre
            style={styles.pre}
          >{`import { Navigate, useLocation } from 'react-router-dom'

function RutaPrivada({ children }) {
  const token = localStorage.getItem('accessToken')
  const location = useLocation()

  if (!token) {
    // Redirige al login y guarda a dónde quería ir
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  return children  // muestra el contenido protegido
}

export default RutaPrivada`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>App.jsx — cómo se usa</p>
          <pre
            style={styles.pre}
          >{`import RutaPrivada from './components/RutaPrivada'

<Route
  path="dashboard"
  element={
    <RutaPrivada>
      <Dashboard />
    </RutaPrivada>
  }
/>

// En Login.jsx — volver a donde quería ir después del login
import { useNavigate, useLocation } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  async function manejarLogin(e) {
    e.preventDefault()
    await login(username, password)

    // Vuelve a donde quería ir, o a "/" si no había destino
    const destino = location.state?.from?.pathname || '/'
    navigate(destino, { replace: true })
  }
}`}</pre>
        </div>

        <div style={styles.note}>
          <strong>location.state?.from?.pathname</strong> — usa encadenamiento
          opcional (<code>?.</code>) porque <code>state</code> puede no existir
          si el usuario fue directo al login sin intentar acceder a una ruta
          protegida.
        </div>
      </div>

      <div style={styles.completed}>
        🎉 <strong>Completaste el Día 4.</strong> Ya entiendes React Router
        completo.
        <br />
        <span
          style={{
            fontSize: "13px",
            color: "#86efac",
            display: "block",
            marginTop: "6px",
          }}
        >
          BrowserRouter → Routes → Link → useNavigate → useParams → Layout →
          RutaPrivada
        </span>
      </div>

      <button onClick={() => navigate("/dia4/layout")} style={styles.navButton}>
        ← Layout
      </button>
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
  tokenStatus: {
    borderRadius: "10px",
    padding: "14px",
    fontSize: "14px",
    color: "#f1f5f9",
    marginBottom: "16px",
    lineHeight: "1.6",
  },
  simulateButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  simulateButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  dashboard: {
    background: "#0f172a",
    border: "1px solid #4ade80",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
  },
  logoutButton: {
    marginTop: "12px",
    padding: "8px 14px",
    background: "#dc2626",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  blocked: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
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
    marginBottom: "16px",
  },
  completed: {
    background: "#14532d",
    border: "1px solid #16a34a",
    borderRadius: "12px",
    padding: "18px 20px",
    textAlign: "center",
    color: "#bbf7d0",
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  navButton: {
    padding: "10px 18px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "#f1f5f9",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export { PrivateRoute };
export default PrivateRouteDemo;
