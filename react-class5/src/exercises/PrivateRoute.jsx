import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function PrivateRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    // Sin token: redirige a /login guardando de dónde venía
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
