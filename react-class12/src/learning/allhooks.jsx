// 1-useState — La libreta de notas de un componente

// Analogía: Es como una libreta que solo tú (ese componente) puedes leer y escribir.
// Cuando escribes algo nuevo, React "voltea la página" y vuelve a dibujar la pantalla.

// En tu proyecto: el texto que escribes en FormPost antes de enviarlo, o si el Toast está visible o no.

// useState define un estado y su valor inicial. En el primer render, React entrega ese valor a data.
// Cuando llamo a setData, no modifico data directamente; le pido a React que actualice el estado interno asociado a ese hook.
// React guarda el nuevo valor y programa un nuevo render. En ese nuevo render, data recibe el valor actualizado.

const [titulo, setTitulo] = useState("");

/*-------------------------------------------------------------------------------------------------------- */
// 2-useEffect — El vigilante que reacciona a cambios

// Analogía: Es como un sensor de movimiento: "cuando X cambie, haz Y".
// No se ejecuta constantemente, solo cuando las dependencias que le dijiste vigilar cambian.

// En tu proyecto: cuando token cambia (login/logout), vuelves a pedir los posts del usuario en MyPosts.

useEffect(() => {
  obtenerPosts(token);
}, [token]); // vigila "token"

// Recuerda: ya confirmamos juntos que el closure "fotografía" el valor de token en el momento en que se ejecuta
// el efecto — por eso siempre va en el array de dependencias.

/*-------------------------------------------------------------------------------------------------------- */
//3-useContext — El altavoz del edificio

// Analogía: En vez de que cada vecino (componente) tenga que pasarle un mensaje al de al lado hasta llegar al piso 10
//  ("prop drilling"), pones un altavoz central y todos lo escuchan directo.

// En tu proyecto: tu ToastContext. En vez de pasar mostrarToast como prop de componente en componente,
// cualquier componente hijo lo puede pedir directamente.

const { mostrarToast } = useContext(ToastContext);

/*-------------------------------------------------------------------------------------------------------- */
// 4-useReducer — El libro de reglas de una oficina

// Analogía: useState es como decidir tú mismo qué hacer. useReducer es como tener un manual de reglas:
// "si llega la acción X, haz Y". Útil cuando el estado tiene varias posibilidades relacionadas entre sí,
// no solo un valor suelto.

// En tu proyecto: tu componente FeedbackEstado (loading / error / success) es un candidato perfecto,
// porque no son 3 estados independientes — son estados excluyentes (no puedes estar cargando y con error a la vez,
// por ejemplo).

function reducer(estado, accion) {
  switch (accion.tipo) {
    case "CARGANDO":
      return { status: "loading" };
    case "EXITO":
      return { status: "success", data: accion.payload };
    case "ERROR":
      return { status: "error", mensaje: accion.payload };
    default:
      return estado;
  }
}

// ¿Cuándo useState y cuándo useReducer? Regla práctica para principiantes:
// si tienes 2-3 estados que cambian juntos y de forma predecible → useReducer.
// Si son valores sueltos e independientes → varios useState

/*-------------------------------------------------------------------------------------------------------- */
//5- useFetch" (patrón, no hook nativo) — El mensajero a domicilio

// Como usan fetch nativo (no Axios), lo normal es crear tu propio hook personalizado que
// combine useState + useEffect para no repetir el mismo código de carga/error en cada componente.

// Analogía: en vez de que cada vecino contrate su propio mensajero,
// contratan uno para todo el edificio y todos piden por él.

function useFetch(url, token) {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar datos");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [url, token]);

  return { data, cargando, error };
}

// Esto es literalmente combinar hooks que ya sabes — no es magia nueva.

/*-------------------------------------------------------------------------------------------------------- */
//6- react-hook-form (RHF) — El formulario con secretaria propia

// Analogía: con useState puro, tú (el componente) tienes que revisar personalmente cada letra que el usuario escribe.
// Con RHF, contratas una secretaria (register) que anota todo por ti y solo te avisa cuando
// algo importante pasa (submit, error).

// En tu proyecto: FormPost, Login, Register.

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

// Regla de oro que ya vimos: nunca mezclar register con value/onChange manual en el mismo input —
// es como tener dos choferes manejando el mismo carro.

/*-------------------------------------------------------------------------------------------------------- */
// 7-useCallback — La foto laminada de una función

// Analogía: normalmente, cada vez que un componente se vuelve a dibujar, React crea funciones nuevas
// (como fotocopiar un papel de nuevo aunque no cambió nada). useCallback "lamina" esa función para que solo
// se vuelva a crear si sus dependencias cambian.

// En tu proyecto: si le pasas una función como prop a CardPost (por ejemplo onEliminar),
// y CardPost está envuelto en memo, quieres que esa función no cambie en cada render, o memo no sirve de nada.

const eliminarPost = useCallback((id) => {
  // lógica de eliminar
}, []); // dependencias vacías = nunca cambia

/*-------------------------------------------------------------------------------------------------------- */
// 8- useMemo — Guardar el resultado de un cálculo caro

// Analogía: es como guardar el resultado de una cuenta larga en la calculadora en vez de repetirla
// cada vez que alguien te pregunta lo mismo.

// En tu proyecto: si filtras u ordenas una lista larga de posts antes de mostrarla,
// no quieres recalcularlo en cada render, solo cuando la lista original o el filtro cambien.

const postsFiltrados = useMemo(() => {
  return posts.filter((p) => p.categoria === categoriaSeleccionada);
}, [posts, categoriaSeleccionada]);

// Diferencia clave useCallback vs useMemo: useCallback guarda una función. useMemo guarda un valor/resultado.
// Ambos existen para evitar trabajo innecesario en cada render.
