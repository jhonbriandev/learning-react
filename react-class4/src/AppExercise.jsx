import { Routes, Route } from "react-router-dom";

import MainLayout from "./pages/exercises/Layout.jsx";
import Home from "./pages/exercises/Home.jsx";
import { Login } from "./pages/exercises/Login.jsx";
import Post from "./pages/exercises/Post.jsx";
import PostDetail from "./pages/exercises/PostDetail.jsx";
import NotFound from "./pages/exercises/NotFound.jsx";
import { Dashboard } from "./pages/exercises/Dashboard.jsx";
import { PrivateRoute } from "./pages/exercises/PrivateRoute.jsx";

function AppExercise() {
  return (
    <Routes>
      {/* MainLayout es la ruta padre: header/nav/footer fijos + Outlet para las rutas hijas */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida: PrivateRoute revisa el token antes de renderizar Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="/post" element={<Post />} />
        {/* Ruta hermana (no anidada) de /post: reemplaza a Post, no vive dentro de él */}
        <Route path="/post/:slug" element={<PostDetail />} />

        {/* Comodín: captura cualquier URL no definida arriba */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppExercise;
