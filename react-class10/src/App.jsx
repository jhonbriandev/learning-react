import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import ErrorBoundary from "./error/ErrorBoundary";
import { FormPost } from "./pages/FormPost";
import { MyPost } from "./pages/MyPost";
import "./index.css";

//PARA PROBAR EL APRENDIZAJE

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ErrorBoundary>
            <MyPost />
          </ErrorBoundary>
        }
      />
      <Route
        path="/create"
        element={
          <ErrorBoundary>
            <FormPost />
          </ErrorBoundary>
        }
      />

      <Route
        path="/login"
        element={
          <ErrorBoundary>
            <Login />
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}

export default App;
