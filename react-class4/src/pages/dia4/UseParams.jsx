// ─────────────────────────────────────────────────────────────
// DÍA 4 — Concepto 5: useParams
// ─────────────────────────────────────────────────────────────
// useParams() captura los valores dinámicos de la URL.
// Cuando defines /posts/:slug en la ruta, useParams() te da
// el valor real que hay en ese lugar de la URL.
//
// Equivalente en Django: request.kwargs['slug']
// o los parámetros capturados en path('<slug:slug>/', vista)
//
// RUTA SUGERIDA en App.jsx:
//   <Route path="/dia4/use-params" element={<UseParamsDemo />} />
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Posts de ejemplo — simulan lo que vendría de tu API Django
const FAKE_POSTS = [
  {
    slug: "mi-primer-post",
    title: "Mi primer post",
    author: "admin",
    content:
      "Este es el contenido del primer post. Llegaste aquí usando el slug como parámetro de URL.",
  },
  {
    slug: "react-router-es-facil",
    title: "React Router es fácil",
    author: "admin",
    content:
      "Una vez que entiendes useParams, consumir tu API Django se vuelve muy directo.",
  },
  {
    slug: "django-y-react",
    title: "Django y React juntos",
    author: "admin",
    content:
      "Puedes construir el backend en Django REST Framework y el frontend en React sin problema.",
  },
];

// ── Componente que simula /posts/:slug ───────────────────────
// En tu app real, este sería PostDetalle.jsx y haría fetch a tu API
function PostDetail() {
  const { slug } = useParams();
  // useParams() devuelve un objeto con todos los parámetros de la ruta.
  // Si la ruta es /dia4/post/:slug y la URL es /dia4/post/mi-primer-post
  // entonces slug = "mi-primer-post"

  const navigate = useNavigate();

  // Simulamos buscar el post por slug — igual que tu API haría
  // En tu app real: const response = await fetch(`/api/posts/${slug}/`)
  const post = FAKE_POSTS.find((p) => p.slug === slug);

  // Si no existe el slug → comportamiento 404
  if (!post) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <p>
            ❌ Post con slug <code>"{slug}"</code> no encontrado.
          </p>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            En tu app real, aquí harías navigate('/404') o mostrarías un mensaje
            de error.
          </p>
          <button
            onClick={() => navigate("/dia4/use-params")}
            style={styles.backButton}
          >
            ← Volver a la demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <p style={styles.capturedSlug}>
        useParams() capturó →{" "}
        <code style={{ color: "#fbbf24" }}>slug = "{slug}"</code>
      </p>
      <article style={styles.article}>
        <h1 style={styles.postTitle}>{post.title}</h1>
        <p style={styles.author}>Por {post.author}</p>
        <p style={styles.content}>{post.content}</p>
      </article>
      <button
        onClick={() => navigate("/dia4/use-params")}
        style={styles.backButton}
      >
        ← Volver a la demo
      </button>
    </div>
  );
}

// ── Componente principal de la demo ──────────────────────────
function UseParamsDemo() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔍 Concepto 5: useParams</h2>

      <div style={styles.card}>
        <p style={styles.text}>
          Haz clic en un post para simular la navegación a{" "}
          <code>/posts/:slug</code>. Observa cómo <strong>useParams()</strong>{" "}
          captura el slug de la URL.
        </p>

        {/* Lista de posts — cada uno va a una ruta con su slug */}
        <div style={styles.postList}>
          {FAKE_POSTS.map((post) => (
            <button
              key={post.slug}
              onClick={() => navigate(`/dia4/post/${post.slug}`)}
              style={styles.postCard}
            >
              <span style={styles.cardTitle}>{post.title}</span>
              <span style={styles.cardSlug}>
                /posts/<strong>{post.slug}</strong>
              </span>
            </button>
          ))}
        </div>

        <div style={styles.codeBlock}>
          <p style={styles.codeTitle}>Código real — PostDetalle.jsx</p>
          <pre style={styles.pre}>{`import { useParams } from 'react-router-dom'

// En App.jsx defines la ruta con :slug
// <Route path="/posts/:slug" element={<PostDetalle />} />

function PostDetalle() {
  const { slug } = useParams()
  // URL /posts/mi-primer-post → slug = "mi-primer-post"

  const [post, setPost] = useState(null)

  useEffect(() => {
    async function cargarPost() {
      // Usas el slug para llamar a tu API Django
      const response = await fetch(\`/api/posts/\${slug}/\`)
      const data = await response.json()
      setPost(data)
    }
    cargarPost()
  }, [slug])  // ← importante: se recarga si el slug cambia

  if (!post) return <p>Cargando...</p>
  return <h1>{post.title}</h1>
}`}</pre>
        </div>

        <div style={styles.note}>
          <strong>¿Por qué [slug] en el array de useEffect?</strong>
          <br />
          Si el usuario navega de <code>/posts/post-a</code> a{" "}
          <code>/posts/post-b</code>
          sin desmontar el componente, el efecto se vuelve a ejecutar
          automáticamente para cargar el nuevo post.
        </div>
      </div>

      <div style={styles.navRow}>
        <button
          onClick={() => navigate("/dia4/use-navigate")}
          style={styles.navButton}
        >
          ← useNavigate
        </button>
        <button
          onClick={() => navigate("/dia4/layout")}
          style={styles.navButton}
        >
          Layout →
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
    marginBottom: "16px",
  },
  postList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  postCard: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "14px 16px",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    transition: "border-color 0.2s",
  },
  cardTitle: { fontSize: "15px", color: "#f1f5f9", fontWeight: "600" },
  cardSlug: { fontSize: "12px", color: "#64748b", fontFamily: "monospace" },
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
  // Estilos del detalle del post
  capturedSlug: {
    background: "#1e293b",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#cbd5e1",
    marginBottom: "16px",
  },
  article: {
    background: "#1e293b",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "16px",
  },
  postTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#f8fafc",
    margin: "0 0 8px",
  },
  author: { fontSize: "13px", color: "#64748b", margin: "0 0 16px" },
  content: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#cbd5e1",
    margin: 0,
  },
  backButton: {
    padding: "10px 18px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "#f1f5f9",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  error: { background: "#1e293b", borderRadius: "14px", padding: "24px" },
};

export { PostDetail };
export default UseParamsDemo;
