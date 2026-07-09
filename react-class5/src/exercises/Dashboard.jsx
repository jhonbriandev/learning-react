import { useAuth } from "./AuthContext";

export function Home() {
  const { estaAutenticado } = useAuth();
  return (
    <>
      <div>
        {estaAutenticado ? (
          <span>Hola, usted ingreso al Dashboard </span>
        ) : (
          <span>Logeate para acceder</span>
        )}
      </div>
    </>
  );
}
