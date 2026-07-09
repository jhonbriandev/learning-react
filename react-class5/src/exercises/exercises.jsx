// 1. Crea src/context/AuthContext.jsx con:
//    - Estado: usuario (null inicial) y token (de localStorage o null)
//    - Funciones: login(usuario, token) y logout()
//    - Hook personalizado useAuth()
//    - Export del AuthProvider y useAuth

// 2. Envuelve la app en main.jsx con AuthProvider

// 3. Actualiza Navbar.jsx para usar useAuth():
//    - Si estaAutenticado: muestra "Hola, [username]" y botón logout
//    - Si no: muestra Link a /login

// 4. Actualiza Login.jsx para usar useAuth():
//    - Al hacer login exitoso, llama a login() del contexto
//    - Redirige a home después

// 5. Actualiza RutaPrivada.jsx para usar useAuth()
//    en lugar de leer localStorage directamente

// 6. Prueba el flujo completo:
//    - Sin sesión: Navbar muestra "Iniciar sesión"
//    - Login exitoso: Navbar muestra el nombre del usuario
//    - Logout: vuelve a mostrar "Iniciar sesión"
//    - /dashboard sin sesión: redirige a /login
