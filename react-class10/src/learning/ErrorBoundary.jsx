import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false }; // 👈 Bloque 1: memoria de "¿algo explotó?"
  }

  // 👇 Bloque 2: React llama esto automáticamente si un hijo lanza un error al renderizar
  static getDerivedStateFromError(error) {
    return { hasError: true }; // actualiza el estado para mostrar el fallback
  }

  // 👇 Bloque 3: aquí puedes loggear el error (a una consola, a un servicio, etc.)
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary atrapó:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Algo salió mal. Intenta recargar la página.</h2>;
    }
    return this.props.children; // 👈 si no hay error, renderiza normal
  }
}

// Uso (envuelves el componente que quieres proteger):

{
  /* <ErrorBoundary>
  <MyPosts />
</ErrorBoundary>; */
}

// Analogía otra vez: el ErrorBoundary es como el fusible de tu casa. Si un electrodoméstico (un componente)
// hace corto circuito, el fusible salta y solo esa parte se queda sin luz — no se quema toda la casa.
// getDerivedStateFromError es
// "el fusible detectó el corto", componentDidCatch es
// "anotar en un cuaderno qué pasó para investigarlo después".
