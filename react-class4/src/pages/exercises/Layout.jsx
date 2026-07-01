import { Outlet, Link } from "react-router-dom";

function MainLayout() {
  return (
    <>
      {/* Fragmento <>...</>: agrupa varios elementos sin agregar un <div> extra al HTML */}

      <header>Contenido del Header</header>
      <nav>
        {/* Link: navega sin recargar el navegador completo, a diferencia de un <a> normal */}
        <Link to="/login">Login</Link>
        <Link to="/">Inicio</Link>
        <Link to="/post">Post</Link>
      </nav>

      <main>
        {/* Outlet: el "hueco" donde React Router dibuja la ruta hija activa (Home, Login, Post, etc.) */}
        <Outlet />
      </main>

      <footer>Hecho por Jhonbrianz</footer>
    </>
  );
}

export default MainLayout;
