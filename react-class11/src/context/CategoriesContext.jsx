import { createContext, useContext, useEffect, useState } from "react";

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Se ejecuta UNA sola vez, cuando la app arranca
  useEffect(() => {
    async function cargar() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories/");
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setCategorias(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const valor = { categorias, cargando, error };

  return (
    <CategoriesContext.Provider value={valor}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const contexto = useContext(CategoriesContext);
  if (!contexto) {
    throw new Error("useCategories debe usarse dentro de <CategoriesProvider>");
  }
  return contexto;
}
