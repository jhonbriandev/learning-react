// Construye estos componentes en tu proyecto de React:

// 1. Componente Badge({ estado })
//    - Recibe "publicado", "borrador" o "archivado"
//    - Renderiza un <span> con clase y texto diferente según el estado
//    - "publicado" → fondo verde, texto "Publicado"
//    - "borrador"  → fondo gris, texto "Borrador"
//    - "archivado" → fondo rojo, texto "Archivado"

/*
==================================================
COMPONENTE: BADGE
==================================================

¿QUÉ HACE?

Badge muestra una etiqueta visual
según el estado de un post.

Recibe una prop llamada:

estado

Puede tener los siguientes valores:

- publicado
- borrador
- archivado

==================================================
DIFERENCIA CON JAVASCRIPT PURO
==================================================

JavaScript:

function obtenerEstado(estado) {
  if (estado === 'publicado') {
    return 'Publicado'
  }
}

React:

function Badge({ estado }) {
  return <span>Publicado</span>
}

La diferencia es que React devuelve JSX
en lugar de devolver solo texto.

==================================================
RENDERIZADO CONDICIONAL
==================================================

Según el valor recibido:

publicado  → Badge verde

borrador   → Badge gris

archivado  → Badge rojo

Si llega un estado desconocido,
se muestra un mensaje por defecto.

==================================================
*/

export function Badge({ estado }) {
  if (estado === "publicado") {
    return <span className="color-publicado">Publicado</span>;
  } else if (estado === "archivado") {
    return <span className="color-archivado">Archivado</span>;
  } else if (estado === "borrador") {
    return <span className="color-borrador">Borrador</span>;
  } else {
    return <span>No existe</span>;
  }
}

// 2. Componente CardPost({ post })
//    - Muestra titulo, autor, fecha si existe, y usa Badge para el estado
//    - Si el post tiene más de 100 caracteres en contenido,
//      muestra solo los primeros 100 + "..."
//    - Si no tiene autor, muestra "Autor desconocido"

// ─────────────────────────────────────────────
// COMPONENTE: CardPost
// Muestra una tarjeta con info de un post
// ─────────────────────────────────────────────

// "export" → permite usar este componente en otros archivos
// "function CardPost" → nombre del componente (siempre PascalCase)
// { titulo, autor, fecha, estado } → props: datos que recibe desde afuera

export function CardPost({ titulo, autor, fecha, estado }) {
  return (
    <article>
      {/* Muestra el título del post */}
      <h3>{titulo}</h3>

      {/* Si "autor" tiene valor lo muestra, si no, pone "Desconocido" */}
      <p>Por {autor ? autor : "Desconocido"}</p>

      {/* Lo mismo con "fecha" */}
      <p>Fecha {fecha ? fecha : "Desconocido"}</p>

      {/* Si estado es "publicado" → etiqueta verde, si no → etiqueta gris */}
      {estado === "publicado" ? (
        <span className="color-publicado">Publicado</span>
      ) : (
        <span className="color-borrador">Borrador</span>
      )}
    </article>
  );
}
// 3. Componente ListaPosts({ posts, titulo })
//    - Muestra el titulo de la sección encima de la lista
//    - Si posts está vacío, muestra "No hay posts en esta sección"
//    - Si hay posts, renderiza un CardPost por cada uno con key correcta

// ─────────────────────────────────────
// BLOQUE 1: CardPost
// Es la "tarjeta" que muestra UN solo post
// Recibe un objeto post con sus datos adentro
// ─────────────────────────────────────
export function CardPost2({ post }) {
  return (
    <article>
      <h3>{post.titulo}</h3>
      <p>Autor: {post.autor}</p>
    </article>
  );
}

// ─────────────────────────────────────
// BLOQUE 2: ListaPosts
// Es la "lista" que muestra VARIOS posts
// Recibe dos props:
//   - titulo: el nombre de la sección
//   - posts: el array con todos los posts
// ─────────────────────────────────────
export function ListaPosts({ posts, titulo }) {
  // Si el array está vacío, muestra un mensaje y para aquí
  // Es como un guardia que avisa "no hay nada que mostrar"
  if (posts.length === 0) {
    return <p>No hay posts en esta sección</p>;
  }

  // Si hay posts, muestra el título y recorre el array
  // .map() es como una fotocopiadora: por cada post crea una CardPost
  return (
    <div>
      <h2>{titulo}</h2>
      {posts.map((post) => (
        <CardPost2 key={post.id} post={post} />
        // key={post.id} le dice a React cómo identificar cada tarjeta
        // sin esto React se confunde cuando la lista cambia
      ))}
    </div>
  );
}
