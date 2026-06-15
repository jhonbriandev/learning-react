/*EJERCICIO 1
import Badge from "./learning/07-exercises.jsx";
import "./App.css";

function App() {
  return <Badge estado="publicado" />;
}

export default App;*/

// ─────────────────────────────────────────────
// ARCHIVO PRINCIPAL: App.jsx
// Punto de entrada de la aplicación
// ─────────────────────────────────────────────

// Importa el componente CardPost desde el otro archivo
// Las llaves {} son obligatorias porque allá usamos "export function" (no "export default")
import { CardPost } from "./learning/07-exercises.jsx";
import { CardPost2, ListaPosts } from "./learning/07-exercises.jsx";

// Importa los estilos globales (aquí deben estar "color-publicado" y "color-borrador")
import "./App.css";

/*EJERCICIO 2
// Componente principal que React busca para arrancar la app
function App() {
  return; // Usa CardPost pasándole los datos como atributos (props)
  // <CardPost
  //   titulo="Carro"
  //   autor="Juan"
  //   fecha="13/06/2026"
  //   estado="publicado"
  // />
}

// "export default" → exporta App como el componente principal del archivo
export default App;
*/

// //EJERCICIO 3

// function App() {
//   // Los datos que vas a mostrar
//   // En una app real estos vendrían de una API o base de datos
//   const posts = [
//     { id: 1, titulo: "React", autor: "Jhon" },
//     { id: 2, titulo: "Django", autor: "Jhon" },
//     { id: 3, titulo: "Python", autor: "Jhon" },
//   ];
//   //const posts = [] para probar cuando no hay posts
//   // Le pasamos los datos a ListaPosts y ella se encarga del resto
//   return (
//     <div>
//       <ListaPosts titulo="Lista de Posts" posts={posts} />
//     </div>
//   );
// }

//export default App;

/* EJERCICIO 4
// 4. En App.jsx:
//    - Crea un array de al menos 5 posts con datos variados
//      (algunos sin autor, algunos con contenido largo, distintos estados)
//    - Usa ListaPosts dos veces: una con posts publicados y otra con borradores
//    - Filtra el array con .filter() para pasarle solo los correspondientes
 */

function App() {
  const posts = [
    {
      id: 1,
      titulo: "React",
      autor: "Jhon",
      contenido:
        " is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum",
      estado: "borrador",
    },
    {
      id: 2,
      titulo: "Django",
      autor: "",
      contenido:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised",
      estado: "publicado",
    },
    {
      id: 3,
      titulo: "Python",
      autor: "Jhon",
      contenido: "Hola soy el lenguaje mas versatil",
      estado: "publicado",
    },
    {
      id: 4,
      titulo: "HTML",
      autor: "Jhon",
      contenido:
        " is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum",
      estado: "borrador",
    },
    {
      id: 5,
      titulo: "CSS",
      autor: "",
      contenido: "Hola soy el lenguaje mas versatil",
      estado: "publicado",
    },
  ];

  // BLOQUE 1: Separar los posts en dos grupos
  // .filter() es como un colador — deja pasar solo los que cumplen la condición
  const publicados = posts.filter((post) => post.estado === "publicado");
  const borradores = posts.filter((post) => post.estado === "borrador");

  // BLOQUE 2: Mostrar cada grupo en su propia lista
  // Ahora sí cada ListaPosts recibe solo sus posts correspondientes
  return (
    <div>
      <ListaPosts titulo="Posts Publicados" posts={publicados} />
      <ListaPosts titulo="Posts Borradores" posts={borradores} />
    </div>
  );
}
export default App;
//
