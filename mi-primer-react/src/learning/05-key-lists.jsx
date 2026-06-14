/*
==================================================
LECCIÓN 06: LISTAS Y KEYS
==================================================

¿QUÉ ES?

React utiliza listas para renderizar arrays.

La forma más común es usando map().

==================================================
DIFERENCIA CON JAVASCRIPT PURO
==================================================

JavaScript:

posts.forEach(post => {
  console.log(post.titulo)
})

React:

posts.map(post => (
  <li>{post.titulo}</li>
))

La diferencia es que map()
devuelve elementos JSX.

==================================================
KEY
==================================================

Cuando renderizas una lista,
cada elemento necesita una key única.

React utiliza la key para identificar
qué elemento cambió, se eliminó o se agregó.

==================================================
INCORRECTO
==================================================

{posts.map(post => (
  <li>{post.titulo}</li>
))}

React mostrará un warning:

"Each child in a list should have a unique key"

==================================================
CORRECTO
==================================================

{posts.map(post => (
  <li key={post.id}>
    {post.titulo}
  </li>
))}

==================================================
¿POR QUÉ IMPORTA?
==================================================

Imagina esta lista:

1 - React
2 - Django
3 - Python

Si eliminas "React":

2 - Django
3 - Python

Con una key correcta React sabe
exactamente qué elemento desapareció.

Sin key React tiene más dificultad
para actualizar el DOM eficientemente.

==================================================
NO USES EL ÍNDICE
==================================================

Evita esto:

{posts.map((post, index) => (
  <li key={index}>
    {post.titulo}
  </li>
))}

El índice puede cambiar cuando:

- Eliminas elementos.
- Insertas elementos.
- Reordenas la lista.

Siempre que sea posible usa:

key={post.id}

==================================================
COMPONENTES EN LISTAS
==================================================

La key va en el componente que
estás renderizando dentro del map.

Correcto:

{posts.map(post => (
  <CardPost
    key={post.id}
    post={post}
  />
))}

Incorrecto:

<CardPost post={post} />

// Dentro de CardPost

<article key={post.id}>
  ...
</article>

La key debe colocarse donde ocurre
el map(), no dentro del componente.

==================================================
EJEMPLO EJECUTABLE
==================================================
*/

function CardPost({ post }) {
  return (
    <article>
      <h3>{post.titulo}</h3>
      <p>Autor: {post.autor}</p>
    </article>
  )
}

function ListasYKeysLesson() {
  const posts = [
    {
      id: 1,
      titulo: 'React',
      autor: 'Jhon'
    },
    {
      id: 2,
      titulo: 'Django',
      autor: 'Jhon'
    },
    {
      id: 3,
      titulo: 'Python',
      autor: 'Jhon'
    }
  ]

  return (
    <div>
      <h2>Lista de Posts</h2>

      {posts.map(post => (
        <CardPost
          key={post.id}
          post={post}
        />
      ))}
    </div>
  )
}

export default ListasYKeysLesson