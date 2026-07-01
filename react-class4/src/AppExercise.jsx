import { Routes, Route } from "react-router-dom";

import MainLayout from "./pages/exercises/Layout.jsx";
import Home from "./pages/exercises/Home.jsx";
import Login from "./pages/exercises/Login.jsx";
import Post from "./pages/exercises/Post.jsx";
import PostDetail from "./pages/exercises/PostDetail.jsx";
import NotFound from "./pages/exercises/NotFound.jsx";
import Dashboard from "./pages/exercises/Dashboard.jsx";

function AppExercise() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppExercise;
