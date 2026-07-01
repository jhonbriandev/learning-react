import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();
  // Función para redirigir al usuario a otra ruta desde código, sin que haga clic en un <Link>

  function logout() {
    localStorage.removeItem("accessToken"); // Borra la credencial guardada
    navigate("/login"); // Redirige automáticamente al login
  }

  return (
    <div>
      <h3>🔓 Dashboard — Contenido protegido</h3>
      <button onClick={logout}>Cerrar Sesion</button>
    </div>
  );
}
