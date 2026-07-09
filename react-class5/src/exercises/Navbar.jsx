import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function Navbar() {
  const { usuario, estaAutenticado, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Mi Blog</Link>
      {estaAutenticado ? (
        <>
          <span>Hola, {usuario?.username}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <Link to="/login">Iniciar sesión</Link>
      )}
    </nav>
  );
}
