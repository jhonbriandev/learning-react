import { useLocation, Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  // Revisa si existe un token guardado (usuario "logueado" o no)

  const location = useLocation();
  // Guarda la URL actual, para poder volver aquí después del login

  if (!token) {
    // Sin token: redirige a /login y guarda de dónde venía en state.from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Con token: deja pasar el contenido protegido (lo que venga envuelto en <PrivateRoute>)
  return children;
}
