import { Routes, Route } from "react-router-dom";
import { FormPost } from "./pages/FormPost";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FormPost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
