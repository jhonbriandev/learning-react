import { createContext, useContext, useState } from "react";

// Contexto global para manejar la autenticación de la aplicación.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Guarda el usuario autenticado y el token de acceso.
  const [usuario, setUsuario] = useState(null);

  // Recupera el token guardado para mantener la sesión al recargar.
  const [token, setToken] = useState(
    localStorage.getItem("accessToken") || null,
  );

  // Guarda la información del usuario y persiste el token.
  function login(datosUsuario, accessToken) {
    setUsuario(datosUsuario);
    setToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
  }

  // Limpia la sesión actual y elimina el token almacenado.
  function logout() {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("accessToken");
  }

  // Valores disponibles para cualquier componente que use useAuth().
  const valor = {
    usuario,
    token,
    estaAutenticado: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// Hook personalizado para acceder al contexto de autenticación.
export function useAuth() {
  const contexto = useContext(AuthContext);

  // Evita usar el hook fuera del AuthProvider.
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }

  return contexto;
}
