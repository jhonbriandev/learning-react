import { Routes, Route } from "react-router-dom";
import { MyPosts } from "./pages/MyPosts";
import PostDetail from "./pages/PostDetail";
import { Login } from "./pages/Login";
import Categories from "./pages/Categories";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MyPosts />} />
      <Route path="/my-posts/:slug" element={<PostDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );
}

export default App;
