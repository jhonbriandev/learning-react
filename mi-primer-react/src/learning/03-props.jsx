/*
==================================================
LECCIÓN 04: PROPS
==================================================

¿QUÉ SON?

Props (properties) son datos que un componente
recibe desde otro componente.

Son equivalentes a los parámetros de una función.

Las props son de solo lectura.

==================================================
DIFERENCIA CON JAVASCRIPT PURO
==================================================

JavaScript:

function saludar(nombre) {
  return `Hola ${nombre}`
}

saludar('Jhon')

React:

function Saludo({ nombre }) {
  return <h2>Hola {nombre}</h2>
}

<Saludo nombre="Jhon" />

==================================================
PROPS BÁSICAS
==================================================

function CardPost({ titulo }) {
  return <h2>{titulo}</h2>
}

<CardPost titulo="React" />
<CardPost titulo="Django" />

==================================================
MÚLTIPLES PROPS
==================================================

<CardPost
  titulo="React"
  autor="Jhon"
  estado="Publicado"
/>

==================================================
OBJETOS COMO PROPS
==================================================

Patrón muy común cuando los datos
vienen de una API.

const post = {
  id: 1,
  titulo: 'React',
  autor: 'Jhon',
  estado: 'Publicado'
}

<CardPost post={post} />

==================================================
SPREAD OPERATOR (...)
==================================================

<CardPost {...post} />

Equivale a:

<CardPost
  id={post.id}
  titulo={post.titulo}
  autor={post.autor}
  estado={post.estado}
/>

==================================================
CHILDREN
==================================================

Representa el contenido que va entre
las etiquetas de un componente.

<Contenedor>
  <h1>Título</h1>
  <p>Contenido</p>
</Contenedor>

==================================================
VALORES POR DEFECTO
==================================================

function Boton({
  texto = 'Click aquí'
}) {
  return <button>{texto}</button>
}

==================================================
BUENAS PRÁCTICAS
==================================================

✓ Usar nombres descriptivos.

✓ Desestructurar props.

✓ Usar objetos para datos complejos.

✗ No modificar props.

==================================================
EJEMPLO EJECUTABLE
==================================================
*/

function CardPost({ titulo, autor, estado }) {
  return (
    <article>
      <h2>{titulo}</h2>
      <p>Autor: {autor}</p>
      <p>Estado: {estado}</p>
    </article>
  )
}

function Contenedor({ children }) {
  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        marginTop: '10px'
      }}
    >
      {children}
    </div>
  )
}

function Boton({
  texto = 'Click aquí'
}) {
  return <button>{texto}</button>
}

function PropsLesson() {
  const post = {
    id: 1,
    titulo: 'Intro a React',
    autor: 'Jhon',
    estado: 'Publicado'
  }

  return (
    <>
      {/* Spread Operator */}
      <CardPost {...post} />

      {/* Children */}
      <Contenedor>
        <h3>Ejemplo de children</h3>
        <p>Contenido interno</p>
      </Contenedor>

      {/* Valores por defecto */}
      <Boton />
      <Boton texto="Guardar" />
    </>
  )
}

export default PropsLesson