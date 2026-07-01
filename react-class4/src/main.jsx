// ─────────────────────────────────────────────────────────────
// main.jsx — Punto de entrada de la aplicación
// ─────────────────────────────────────────────────────────────
// Este es el primer archivo que se ejecuta cuando arranca tu app.
// Aquí se "monta" (se inserta) todo React dentro del HTML real
// que el navegador muestra en pantalla.
//
// ⚠️ REGLA DE ORO: BrowserRouter va AQUÍ y SOLO AQUÍ.
// No debe repetirse en ningún otro archivo (ni en App.jsx,
// ni en ningún componente). Si lo pones en dos lugares,
// React Router lanza el error:
// "You cannot render a <Router> inside another <Router>"
// porque tendría dos sistemas de rutas compitiendo por
// controlar la misma URL al mismo tiempo.
// ─────────────────────────────────────────────────────────────

import { StrictMode } from "react";
// StrictMode no afecta lo que el usuario ve en pantalla.
// Es una herramienta de React que te avisa en la consola si
// estás usando algo de forma incorrecta o ya obsoleta.
// Piensa en él como un corrector ortográfico: revisa el texto,
// pero no cambia el resultado final que se lee.

import { createRoot } from "react-dom/client";
// createRoot es el "puente" entre React y el HTML real del navegador.
// React por sí solo sabe describir QUÉ debe mostrarse,
// pero no sabe cómo dibujarlo en la pantalla.
// Esta función es la que toma esa descripción y la convierte
// en elementos visibles dentro del documento HTML.

import { BrowserRouter } from "react-router-dom";
// BrowserRouter es el componente que activa el sistema de rutas
// en TODA la aplicación. Le da a React la capacidad de "leer"
// la URL actual del navegador y decidir qué página corresponde.
//
// Analogía: es como el GPS de un coche. Sin GPS, el coche puede
// moverse, pero no sabe en qué calle está ni hacia dónde ir.
// BrowserRouter le da a React ese "sentido de ubicación".
//
// Debe existir UNA SOLA VEZ en todo el proyecto, porque solo
// puede haber un GPS controlando el viaje — dos GPS dando
// direcciones distintas al mismo tiempo generan un conflicto,
// y eso es exactamente lo que React Router no permite.

import "./index.css";
// Importa los estilos CSS globales del proyecto.
// Esto no es código que se ejecuta como JavaScript;
// es una instrucción para que Vite incluya ese archivo
// de estilos cuando construya la aplicación final.

import App from "./App.jsx";
import AppExercise from "./AppExercise.jsx";
// Trae tu componente principal, el que contiene la lógica
// de tu aplicación: las rutas (<Routes> y <Route>) y todas
// las páginas que se muestran según la URL.
//
// Importante: App.jsx debe contener SOLO <Routes> y <Route>,
// NUNCA otro <BrowserRouter>, porque ese ya está aquí afuera.

// ── Punto de montaje de la aplicación ────────────────────────
createRoot(document.getElementById("root")).render(
  // document.getElementById('root') busca, dentro de tu
  // archivo index.html, el elemento HTML que tiene id="root".
  // Ese elemento es el "contenedor vacío" donde React va a
  // insertar (montar) toda la aplicación.

  <StrictMode>
    {/* Envuelve toda la app para activar las revisiones extra
        de React explicadas arriba. No cambia nada visualmente,
        solo ayuda a detectar errores comunes en consola. */}

    <BrowserRouter>
      {/* Aquí, y solo aquí, va el único BrowserRouter del proyecto.
          Todo lo que esté ADENTRO de estas etiquetas —en este
          caso, <App />, y por extensión TODO lo que App.jsx
          renderice— queda conectado al sistema de rutas y puede
          usar libremente:
            - <Link> y <NavLink> para crear enlaces de navegación
            - <Routes> y <Route> para mostrar páginas según la URL
            - los hooks useNavigate(), useParams(), useLocation()

          Si quitaras este BrowserRouter, esos elementos y hooks
          lanzarían un error, porque necesitan que exista un
          Router "por encima" de ellos en el árbol de componentes. */}

      {/*<App />*/}
      {/* Aquí se inserta tu componente principal. App.jsx, a su
          vez, debe contener <Routes> con todas tus <Route>,
          pero SIN volver a escribir <BrowserRouter> ahí dentro. */}
      <AppExercise />
    </BrowserRouter>
  </StrictMode>,
);
