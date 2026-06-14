/*
==================================================
LECCIÓN 05: RENDERIZADO CONDICIONAL
==================================================

¿QUÉ ES?

Permite mostrar u ocultar contenido
según una condición.

==================================================
DIFERENCIA CON JAVASCRIPT PURO
==================================================

JavaScript:

if (activo) {
  mostrarElemento()
}

React:

{
  activo && <Elemento />
}

React decide qué renderizar.

==================================================
PATRONES MÁS USADOS
==================================================

1. Ternario

condicion
  ? valorSiTrue
  : valorSiFalse

2. &&

condicion && <Elemento />

3. Variable + if/else

Útil para lógica compleja.

==================================================
CUIDADO
==================================================

Incorrecto:

{comentarios.length && <p>Comentarios</p>}

Si length es 0, React muestra 0.

Correcto:

{comentarios.length > 0 && (
  <p>Comentarios</p>
)}

==================================================
*/

function CardPost({
  titulo,
  estado,
  comentarios
}) {
  return (
    <article>
      <h2>{titulo}</h2>

      {estado === 'publicado'
        ? <span>✅ Publicado</span>
        : <span>📝 Borrador</span>
      }

      {comentarios.length > 0 && (
        <p>
          {comentarios.length} comentarios
        </p>
      )}
    </article>
  )
}

function Perfil({ usuario }) {
  let contenido

  if (!usuario) {
    contenido = <p>Cargando...</p>
  } else if (!usuario.activo) {
    contenido = <p>Usuario inactivo</p>
  } else {
    contenido = (
      <h2>
        Bienvenido {usuario.nombre}
      </h2>
    )
  }

  return <div>{contenido}</div>
}

function RenderizadoCondicionalLesson() {
  return (
    <>
      <CardPost
        titulo="React"
        estado="publicado"
        comentarios={['Muy bueno']}
      />

      <Perfil
        usuario={{
          nombre: 'Jhon',
          activo: true
        }}
      />
    </>
  )
}

export default RenderizadoCondicionalLesson