// Construye la estructura de rutas de tu mini-blog React:

// 1. Configura BrowserRouter en main.jsx

// 2. Crea estas páginas básicas (pueden ser simples por ahora):
//    - Home.jsx — mensaje de bienvenida
//    - Posts.jsx — lista de posts (usa lo que ya construiste)
//    - PostDetalle.jsx — usa useParams para mostrar un post por slug
//    - Login.jsx — formulario simple (puede ser solo UI por ahora)
//    - NotFound.jsx — mensaje "Página no encontrada"

// 3. Crea un Layout.jsx con:
//    - Navbar con Link a Home, Posts y Login
//    - Outlet para el contenido
//    - Footer simple

// 4. Configura las rutas en App.jsx:
//    - Todas anidadas dentro de Layout
//    - Incluye la ruta comodín * para NotFound

// 5. Crea RutaPrivada.jsx y protege una ruta de prueba
//    "dashboard" — verifica que redirige a /login si no hay token
//    en localStorage, y que muestra el contenido si lo hay
//    (puedes simular el token manualmente en localStorage
//    para probarlo: localStorage.setItem('accessToken', 'prueba'))

// 6. Verifica navegación:
//    - Click en los links del navbar cambia la URL sin recargar
//    - Ir a una URL que no existe muestra NotFound
//    - Ir a /dashboard sin token redirige a /login
