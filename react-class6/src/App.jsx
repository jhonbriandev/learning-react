//  PARA PROBAR CLASE
// import { useState } from "react";
// import { PostDetail } from "./pages/PostDetail";
// import Preferences from "./pages/Preferences";
// import { Posts } from "./pages/Posts";
// import { Routes, Route } from "react-router-dom";
// import { Login } from "./pages/Login";
// import "./App.css";

// function App() {
//   return (
//     <>
//       <Routes>
//         <Route path="/" element={<Preferences />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/posts" element={<Posts />} />
//         <Route path="/posts/:slug" element={<PostDetail />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

// PARA PROBAR EJERCICIO

import Categories from "./exercises/pages/Categories";
import SearchCategory from "./exercises/components/SearchCategory";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </>
  );
}

export default App;
