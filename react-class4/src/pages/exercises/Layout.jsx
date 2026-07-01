import { Outlet, Link } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <header>Contenido del Header</header>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/">Inicio</Link>
        <Link to="/post">Post</Link>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>Hecho por Jhonbrianz</footer>
    </>
  );
}

export default MainLayout;
