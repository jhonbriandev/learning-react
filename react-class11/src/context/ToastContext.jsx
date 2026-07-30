import { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "../components/feedback/Toast";

const ToastContext = createContext(null);

// Provider: envuelve la app y da acceso global a agregarToast/removerToast
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // IMPORTANTE “useCallback sin dependencias crea la función una vez y reutiliza esa misma función”

  // useCallback: estas funciones se comparten vía contexto,
  // sin useCallback cambiarían de referencia en cada render del Provider
  const agregarToast = useCallback((mensaje, tipo = "success") => {
    const id = Date.now(); // suficiente como identificador único en este contexto
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
  }, []);

  const removerToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ agregarToast }}>
      {children}

      {/* Contenedor fijo: siempre montado, muestra los toasts activos */}
      <div className="toast-contenedor">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            mensaje={toast.mensaje}
            tipo={toast.tipo}
            onCerrar={() => removerToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook de conveniencia: evita repetir useContext(ToastContext) en cada componente
export function useToast() {
  return useContext(ToastContext);
}
