import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // token: se recupera de localStorage para no perder la sesión al refrescar
  const [token, setToken] = useState(
    localStorage.getItem("accessToken") || null,
  );

  function login(datosUsuario, accessToken) {
    setUsuario(datosUsuario);
    setToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
  }

  function logout() {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("accessToken");
  }

  const valor = {
    usuario,
    token,
    login,
    logout,
    estaAutenticado: !!token,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// Hook personalizado: evita usar useContext(AuthContext) en cada archivo
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return contexto;
}
