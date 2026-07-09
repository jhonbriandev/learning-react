import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function MainLayout() {
  return (
    <>
      <header>Contenido del Header</header>
      <Navbar />
      <main>
        {/* Outlet: dibuja la ruta hija activa (Home, Login, etc.) */}
        <Outlet />
      </main>
      <footer>Hecho por Jhonbrianz</footer>
    </>
  );
}
