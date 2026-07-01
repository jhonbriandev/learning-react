// ─────────────────────────────────────────────────────────────
// App.jsx — Componente principal de la aplicación
// ─────────────────────────────────────────────────────────────
// ⚠️ Este archivo NO debe tener <BrowserRouter>.
// Ese componente ya está puesto UNA SOLA VEZ en main.jsx,
// envolviendo a <App />. Si lo repites aquí, obtienes el error:
// "You cannot render a <Router> inside another <Router>"
//
// App.jsx solo necesita <Routes> y <Route>, porque ya está
// "dentro" del Router que viene desde main.jsx — no necesita
// crear uno nuevo, solo usar el que ya existe.
// ─────────────────────────────────────────────────────────────

import { Routes, Route } from "react-router-dom";
// Routes y Route SÍ deben importarse aquí.
// Routes es el contenedor que mira la URL actual y decide
// cuál de tus Route coincide. Route conecta una URL (path)
// con el componente que debe mostrarse (element).
// A diferencia de BrowserRouter, estos dos pueden (y deben)
// usarse en varios archivos si tu app crece, sin generar conflicto.

import BrowserRouterDemo from "./pages/dia4/BrowserRouter.jsx";
import RoutesDemo from "./pages/dia4/RoutesAndRoute.jsx";
import LinkDemo from "./pages/dia4/LinkAndNavLink.jsx";
import UseNavigateDemo from "./pages/dia4/UseNavigate.jsx";
import UseParamsDemo, { PostDetail } from "./pages/dia4/UseParams.jsx";
import LayoutDemo from "./pages/dia4/Layout.jsx";
import PrivateRouteDemo from "./pages/dia4/PrivateRoute.jsx";
// Cada import trae un componente de página distinto.
// No llevan llaves { } (excepto PostDetail) porque cada archivo
// exporta su componente principal como "export default".
// PostDetail sí lleva llaves porque ese archivo lo exporta
// como "export { PostDetail }" (exportación nombrada),
// además de su export default (UseParamsDemo).

function App() {
  return (
    // Ya NO hay <BrowserRouter> aquí. Empezamos directo en <Routes>,
    // porque el Router que activa todo el sistema ya está
    // puesto más arriba, en main.jsx.

    <Routes>
      {/* Ruta raíz "/" — la que se muestra cuando entras
          a tu app sin ninguna ruta específica en la URL.
          Sin esto, verías el aviso "No routes matched location /" */}
      <Route path="/" element={<BrowserRouterDemo />} />

      <Route path="/dia4/browser-router" element={<BrowserRouterDemo />} />
      <Route path="/dia4/routes-y-route" element={<RoutesDemo />} />
      <Route path="/dia4/link-y-navlink" element={<LinkDemo />} />
      <Route path="/dia4/use-navigate" element={<UseNavigateDemo />} />
      <Route path="/dia4/use-params" element={<UseParamsDemo />} />

      {/* :slug es un parámetro dinámico — captura cualquier valor
          que venga después de /dia4/post/ en la URL.
          Por ejemplo: /dia4/post/mi-primer-post → slug = "mi-primer-post"
          Ese valor se lee adentro de PostDetail usando useParams() */}
      <Route path="/dia4/post/:slug" element={<PostDetail />} />

      <Route path="/dia4/layout" element={<LayoutDemo />} />
      <Route path="/dia4/ruta-privada" element={<PrivateRouteDemo />} />
    </Routes>
  );
}

export default App;
