// USE EFFECT

// Qué problema resuelve useEffect?
// En JS puro, cuando querías cargar datos al abrir una página hacías esto:

document.addEventListener("DOMContentLoaded", async () => {
  const posts = await getPosts();
  renderizarPosts(posts);
});
// En React no puedes hacer eso directamente dentro del componente porque el cuerpo de un componente se
// ejecuta en cada render — si pones un fetch ahí, se ejecutaría en cada re-render, creando un bucle infinito:

// INCORRECTO — fetch en el cuerpo del componente
function ListaPosts() {
  // Estado que guarda la lista de posts. Empieza como un array vacío.
  const [posts, setPosts] = useState([]);

  // ERROR 1: no se puede poner "async" directamente en la función de useEffect.
  // React espera que esta función no devuelva nada, o devuelva una función
  // de "limpieza". Si la marcas como async, automáticamente devuelve una
  // promesa (un "te prometo el resultado más adelante"), y React no sabe
  // qué hacer con eso. Esto rompe el comportamiento esperado.
  useEffect(async () => {
    // Pide los datos al servidor. Como hay "await", el código espera
    // aquí hasta que llegue la respuesta antes de seguir.
    const respuesta = await fetch("/api/posts/");

    // Convierte la respuesta (que llega en un formato especial) en
    // datos que JavaScript puede usar directamente (array u objeto).
    const data = await respuesta.json();

    // Guarda esos datos en el estado "posts".
    setPosts(data);

    // ERROR 2: este "return" con HTML no sirve para nada aquí.
    // useEffect no dibuja cosas en pantalla; solo ejecuta tareas
    // (como pedir datos). El HTML que se muestra debe ir en el
    // "return" de la función del componente, no dentro de un efecto.
    return (
      <div>
        {posts.map((post) => (
          <p key={post.id}>{post.titulo}</p>
        ))}
      </div>
    );
    // ERROR 3: "busqueda" no existe en ningún lado de este componente.
    // Si quieres que el efecto se repita cuando "busqueda" cambie,
    // primero tendrías que crearla con un useState.
  }, [busqueda]);

  // Y aquí falta el "return" real del componente: nunca se dibuja
  // ningún HTML en pantalla porque no hay ningún return fuera del useEffect.
}
// useEffect resuelve esto permitiéndote decirle a React:
//  "ejecuta este código después del render, y solo cuando estas dependencias cambien".

/*-------------------------------------------------------------------*/

import { useState, useEffect } from "react";

useEffect(
  () => {
    // Código a ejecutar
  },
  [
    /* dependencias */
  ],
);
//  ↑
// Array que controla cuándo se ejecuta el efecto

/*-------------------------------------------------------------------*/

// FORMA 1 — Sin array: se ejecuta en CADA render
useEffect(() => {
  console.log("Esto se ejecuta en cada render");
});
// Úsalo raramente — casi siempre quieres controlar cuándo se ejecuta

// FORMA 2 — Array vacío []: se ejecuta UNA SOLA VEZ al montar
useEffect(() => {
  console.log("Esto se ejecuta solo una vez al inicio");
  // Equivalente a DOMContentLoaded en JS puro
  // Ideal para: cargar datos iniciales, configurar suscripciones
}, []);

// FORMA 3 — Array con dependencias: se ejecuta cuando cambian
useEffect(() => {
  console.log("Esto se ejecuta cuando busqueda cambia");
  // Se ejecuta al montar Y cada vez que busqueda cambia
}, [busqueda]);

/*-------------------------------------------------------------------*/

// Usando el ejemplo anterior

function ListaPosts() {
  // Estado que guarda la lista de posts. Empieza como un array vacío.
  const [posts, setPosts] = useState([]);

  // useEffect sirve para ejecutar tareas que no tienen que ver
  // directamente con dibujar HTML, como pedir datos a un servidor.
  // Piensa en él como una nota adhesiva: "cuando el componente aparezca
  // en pantalla, haz esto otro".
  useEffect(() => {
    // No podemos poner "async" arriba, en la función principal de
    // useEffect (React no lo permite). Por eso creamos una función
    // aparte aquí adentro, y a ESA sí la marcamos como async.
    async function cargarPosts() {
      // Pide los datos al servidor y espera la respuesta antes
      // de seguir a la siguiente línea.
      const respuesta = await fetch("/api/posts/");

      // Convierte la respuesta en datos usables por JavaScript.
      const data = await respuesta.json();

      // Guarda esos datos en el estado "posts". Esto hace que
      // React vuelva a dibujar el componente con los nuevos datos.
      setPosts(data);
    }

    // Crear la función no la ejecuta sola; hay que llamarla.
    cargarPosts();

    // Array de dependencias vacío: significa "ejecuta este efecto
    // una sola vez, cuando el componente aparece por primera vez".
  }, []);

  // Aquí sí va el HTML que se muestra en pantalla. Por cada "post"
  // en la lista, dibuja un párrafo con su título.
  // El "key" es obligatorio en listas de React: es como el DNI de
  // cada elemento, para que React distinga uno de otro.
  return (
    <div>
      {posts.map((post) => (
        <p key={post.id}>{post.titulo}</p>
      ))}
    </div>
  );
}
