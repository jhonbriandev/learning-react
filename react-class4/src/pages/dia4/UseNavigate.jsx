// ─────────────────────────────────────────────────────────────
// DÍA 4 — Concepto 4: useNavigate
// ─────────────────────────────────────────────────────────────
// useNavigate() sirve para navegar desde código JavaScript,
// no desde un clic en un Link.
// Caso más común: después de un login exitoso, redirigir al usuario.
//
// Diferencia con Link:
//   Link → el usuario hace clic
//   useNavigate → tu código decide cuándo navegar
//
// RUTA SUGERIDA en App.jsx:
//   <Route path="/dia4/use-navigate" element={<UseNavigateDemo />} />
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UseNavigateDemo() {
  const navigate = useNavigate();

  // Simulamos el estado de un formulario de login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // Simula un login: si usuario=admin y password=1234, éxito
  // En tu app real, aquí llamarías a tu API Django
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    // Simulamos el delay de una llamada a la API
    await new Promise((r) => setTimeout(r, 1200));

    if (username === "admin" && password === "1234") {
      setResult(
        "✅ Login exitoso — en tu app real, navigate() te llevaría a /posts",
      );
      // En tu app real descomentarías esta línea:
      // navigate('/posts')
      //
      // Con replace: true — el usuario no puede volver atrás con ←
      // navigate('/posts', { replace: true })
    } else {
      setError("❌ Credenciales incorrectas. Prueba admin / 1234");
    }

    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧭 Concepto 4: useNavigate</h2>

      <div style={styles.card}>
        <p style={styles.text}>
          <strong>useNavigate()</strong> te da una función para navegar desde
          código. Prueba el formulario: usuario <code>admin</code>, contraseña{" "}
          <code>1234</code>.
        </p>

        {/* Formulario de login simulado */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.submitButton, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Mensajes de error o éxito */}
        {error && <p style={styles.errorMessage}>{error}</p>}
        {result && <p style={styles.successMessage}>{result}</p>}

        {/* Código real */}
        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>Login.jsx — código real</p>
          <pre
            style={styles.pre}
          >{`import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  async function manejarLogin(e) {
    e.preventDefault()

    const response = await fetch('/api/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })

    if (response.ok) {
      const { access } = await response.json()
      localStorage.setItem('accessToken', access)

      // Navegar después del login exitoso
      navigate('/posts')

      // replace: true → no puede volver atrás con ←
      navigate('/posts', { replace: true })
    }
  }

  return <form onSubmit={manejarLogin}>...</form>
}`}</pre>
        </div>

        <div style={styles.note}>
          <strong>replace: true</strong> — reemplaza la entrada en el historial
          del navegador. Útil después del login: no queremos que el usuario
          pueda volver al formulario presionando ← atrás.
        </div>
      </div>

      {/* Navegación entre demos */}
      <div style={styles.navRow}>
        <button
          onClick={() => navigate("/dia4/link-y-navlink")}
          style={styles.navButton}
        >
          ← Link y NavLink
        </button>
        <button
          onClick={() => navigate("/dia4/use-params")}
          style={styles.navButton}
        >
          useParams →
        </button>
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
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "16px",
  },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", color: "#94a3b8", fontWeight: "600" },
  input: {
    padding: "10px 12px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
  },
  submitButton: {
    padding: "10px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  errorMessage: {
    background: "#450a0a",
    border: "1px solid #f87171",
    borderRadius: "8px",
    padding: "12px",
    color: "#fca5a5",
    fontSize: "14px",
    margin: "0 0 16px",
  },
  successMessage: {
    background: "#052e16",
    border: "1px solid #4ade80",
    borderRadius: "8px",
    padding: "12px",
    color: "#86efac",
    fontSize: "14px",
    margin: "0 0 16px",
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
    lineHeight: "1.6",
  },
  navRow: { display: "flex", justifyContent: "space-between" },
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

export default UseNavigateDemo;
