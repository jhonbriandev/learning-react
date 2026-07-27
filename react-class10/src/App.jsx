import { Routes, Route } from "react-router-dom";
import { MyPosts } from "./learning/MyPost";
import { Login } from "./learning/Login";
import { ErrorBoundary } from "./learning/ErrorBoundary";

//PARA PROBAR EL APRENDIZAJE

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ErrorBoundary>
            <MyPosts />
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
