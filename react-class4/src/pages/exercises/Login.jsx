import { useState } from "react";

export function Login() {
  const [hasToken, setHasToken] = useState(
    () => !!localStorage.getItem("accessToken"),
  );

  function simulateLogin() {
    // Simula guardar un token JWT después del login
    localStorage.setItem("accessToken", "token-falso-para-demo-123");
    setHasToken(true);
  }
  return (
    <div>
      {/* onClick, no {simulateLogin}: así solo se ejecuta cuando el usuario hace clic */}
      <button onClick={simulateLogin}>Simular login</button>

      {/* Mostramos el estado actual, útil para verificar visualmente que funciona */}
      <p>{hasToken ? "Token guardado ✅" : "Sin token ❌"}</p>
    </div>
  );
}
export default Login;
