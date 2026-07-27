// Versión con problema

function FormPost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const enviarPost = async (datos) => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/api/posts/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const data = await response.json();
    setLoading(false);
  };

  return (
    <div>
      {loading && <p>Enviando...</p>}
      {error && <p>Hubo un error</p>}
      {/* formulario aquí */}
    </div>
  );
}

// Version Corregida
function FormPost() {
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const enviarPost = async (datos) => {
    setStatus("loading");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el post: ${response.status}`);
      }

      setStatus("success");
    } catch (error) {
      setErrorMsg(error.message);
      setStatus("error");
    }
  };

  return (
    <div>
      <Feedback
        status={status}
        errorMsg={errorMsg}
        loadingText="Enviando post..."
      />
      {/* formulario aquí */}
    </div>
  );
}

// INDICAR QUE DIFERENCIAS EXISTEN
