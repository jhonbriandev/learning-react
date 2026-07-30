// src/components/ErrorBoundary.jsx
import { Component } from "react";

// Componente de clase (obligatorio para ErrorBoundary, los hooks no lo soportan aún)
// Atrapa errores de RENDERIZADO en sus hijos, no errores de red/fetch
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tieneError: false, // bandera: ¿algo explotó al renderizar?
      error: null, // guarda el objeto Error real, útil para debug
      infoError: null,
    };
  }

  // React llama esto automáticamente ANTES de re-renderizar, si un hijo lanza un error
  static getDerivedStateFromError(error) {
    return { tieneError: true, error };
  }

  // Se ejecuta DESPUÉS del error — lugar ideal para loggear (Sentry, LogRocket, etc.)
  componentDidCatch(error, infoError) {
    console.error("ErrorBoundary capturó:", error);
    console.error("Info del componente:", infoError.componentStack);
  }

  render() {
    if (this.state.tieneError) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          {/* Prioridad: mensaje personalizado (prop) > mensaje técnico de JS > texto genérico */}
          <p>
            {this.props.fallback ||
              this.state.error?.message ||
              "Error inesperado"}
          </p>
          <button
            onClick={() => this.setState({ tieneError: false, error: null })}
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    // Sin error: renderiza normalmente lo que esté envuelto
    return this.props.children;
  }
}

export default ErrorBoundary;
