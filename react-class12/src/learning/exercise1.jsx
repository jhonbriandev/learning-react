// Tema elegido: useCallback mal usado (error muy común).

// ======================================================
// VERSIÓN A — CON PROBLEMA (stale closure)
// ======================================================

function ListaPosts({ posts }) {
  // Estado inicial
  const [favoritos, setFavoritos] = useState([]);

  // React crea esta función UNA SOLA VEZ
  // porque las dependencias son []
  const marcarFavorito = useCallback((id) => {
    // ❌ Importante:
    // 'favoritos' SÍ cambia en el componente.
    //
    // Render 1: favoritos = []
    // Render 2: favoritos = [10]
    // Render 3: favoritos = [10, 20]
    //
    // PERO esta función fue creada en el Render 1
    // y nunca volvió a crearse.
    //
    // Por eso la función sigue usando el
    // favoritos del PRIMER render: []

    setFavoritos([...favoritos, id]);

    // Lo que realmente ocurre:

    // Click 1:
    // [...[], 10] => [10]

    // Click 2:
    // [...[], 20] => [20]

    // Click 3:
    // [...[], 30] => [30]

    // ❌ Se pierden los anteriores.
  }, []); // ❌ Incorrecto: usamos favoritos pero no lo declaramos como dependencia

  return posts.map((p) => (
    <CardPost key={p.id} post={p} onFavorito={marcarFavorito} />
  ));
}

// ======================================================
// VERSIÓN B — CORREGIDA (recomendada)
// ======================================================

function ListaPosts({ posts }) {
  const [favoritos, setFavoritos] = useState([]);

  // La función también se crea una sola vez
  const marcarFavorito = useCallback((id) => {
    // ✅ No usamos la variable externa favoritos.
    // React nos entrega el estado más reciente en 'prev'.

    setFavoritos((prev) => {
      // Click 1:
      // prev = []
      // nuevo = [10]

      // Click 2:
      // prev = [10]
      // nuevo = [10, 20]

      // Click 3:
      // prev = [10, 20]
      // nuevo = [10, 20, 30]

      return [...prev, id];
    });
  }, []); // ✅ Correcto: no dependemos de favoritos

  return posts.map((p) => (
    <CardPost key={p.id} post={p} onFavorito={marcarFavorito} />
  ));
}

// ======================================================
// IDEA CLAVE
// ======================================================

// favoritos:
// Valor del estado EN ESTE RENDER.

// setFavoritos:
// Función para pedir un cambio de estado.

// prev:
// Estado más reciente garantizado por React.

// ❌ No pienses:
// "favoritos nunca cambia"

// ✅ Piensa:
// "favoritos cambia en cada render, pero la función de useCallback([])
// sigue conectada al favoritos del render en que fue creada."

// ======================================================
// REGLA PRÁCTICA
// ======================================================

// Si el nuevo estado depende del anterior:

setFavoritos((prev) => [...prev, id]);

// Esta es la forma más segura y más usada en React moderno.
