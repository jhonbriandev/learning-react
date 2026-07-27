// Ya que loading/error/success se repetirá en MyPosts, FormPost,
// y cualquier otro componente que haga fetch,
// tiene sentido extraer esa UI repetida a un componente reutilizable.

export function Feedback({ status, errorMsg, loadingText = "Cargando..." }) {
  // 👇 Bloque 1: un solo componente decide qué mostrar según el status
  if (status === "loading") {
    return <p className="feedback feedback--loading">{loadingText}</p>;
  }

  if (status === "error") {
    return <p className="feedback feedback--error">❌ {errorMsg}</p>;
  }

  return null; // 👈 Bloque 2: si es 'success' o 'idle', no muestra nada (el componente padre ya renderiza sus datos)
}
