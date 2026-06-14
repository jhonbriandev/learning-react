/*
==================================================
LECCIÓN 07: ESTRUCTURA REAL DE UNA APP
==================================================

Hasta ahora vimos:

- JSX
- Componentes
- Props
- Renderizado condicional
- Listas y keys

Ahora veremos cómo se combinan
en una aplicación real.

==================================================
DIFERENCIA CON JAVASCRIPT PURO
==================================================

JavaScript:

Normalmente terminamos con archivos
grandes donde todo vive junto:

- Datos
- HTML
- Eventos
- Lógica

React:

Divide la interfaz en componentes
pequeños y reutilizables.

==================================================
JERARQUÍA DE COMPONENTES
==================================================

App
│
└── ListaPosts
    │
    ├── CardPost
    ├── CardPost
    └── CardPost

Cada componente tiene una única
responsabilidad.

==================================================
FLUJO DE DATOS
==================================================

App
 ↓ props
ListaPosts
 ↓ props
CardPost

Los datos normalmente viajan
de padre a hijo.

==================================================
BUENAS PRÁCTICAS
==================================================

✓ Un componente = una responsabilidad.

✓ Componentes pequeños.

✓ Reutilizar componentes.

✓ Mantener la lógica separada.

==================================================
EJEMPLO EJECUTABLE
==================================================
*/

function CardPost({ post }) {
  const {
    titulo,
    autor,
    estado
  } = post

  return (
    <article>
      <h3>{titulo}</h3>

      <p>Por {autor}</p>

      {estado === 'publicado'
        ? <span>✅ Publicado</span>
        : <span>📝 Borrador</span>
      }
    </article>
  )
}

function ListaPosts({ posts }) {
  if (posts.length === 0) {
    return <p>No hay posts disponibles.</p>
  }

  return (
    <div>
      {posts.map(post => (
        <CardPost
          key={post.id}
          post={post}
        />
      ))}
    </div>
  )
}

function EstructuraRealLesson() {
  const posts = [
    {
      id: 1,
      titulo: 'Intro a React',
      autor: 'Jhon',
      estado: 'publicado'
    },
    {
      id: 2,
      titulo: 'Django REST',
      autor: 'Jhon',
      estado: 'borrador'
    },
    {
      id: 3,
      titulo: 'JavaScript ES6',
      autor: 'Jhon',
      estado: 'publicado'
    }
  ]

  return (
    <div>
      <header>
        <h1>Mi Blog</h1>
      </header>

      <main>
        <ListaPosts posts={posts} />
      </main>
    </div>
  )
}

export default EstructuraRealLesson