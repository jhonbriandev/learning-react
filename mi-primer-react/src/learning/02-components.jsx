/*
==================================================
LECCIÓN 03: COMPONENTES
==================================================

¿QUÉ ES UN COMPONENTE?

Un componente es una función que devuelve JSX.

Los componentes son la unidad básica de React.

La idea principal es dividir la interfaz en piezas
pequeñas, reutilizables e independientes.

--------------------------------------------------
DIFERENCIA CON JAVASCRIPT PURO
--------------------------------------------------

JavaScript:

function crearBoton(texto) {
  const boton = document.createElement('button')
  boton.textContent = texto

  return boton
}

document.body.appendChild(
  crearBoton('Guardar')
)

React:

function Boton() {
  return <button>Guardar</button>
}

<Boton />

React se encarga de crear, insertar y actualizar
los elementos en el DOM.

--------------------------------------------------
VENTAJAS
--------------------------------------------------

- Reutilización.
- Mejor organización.
- Separación de responsabilidades.
- Menos manipulación manual del DOM.

==================================================
REGLA 1:
EL NOMBRE DEBE EMPEZAR CON MAYÚSCULA
==================================================

Correcto:

function CardPost() {}

Incorrecto:

function cardPost() {}

¿Por qué?

React interpreta:

<CardPost />

como un componente.

Pero interpreta:

<cardPost />

como una etiqueta HTML.

==================================================
REGLA 2:
DEBE RETORNAR JSX O NULL
==================================================

Correcto:

function Saludo() {
  return <h1>Hola</h1>
}

También es válido:

function Vacio() {
  return null
}

¿Qué significa null?

- El componente existe.
- React lo ejecuta.
- No renderiza nada.

Muy útil para renderizado condicional.

==================================================
REGLA 3:
SE UTILIZA COMO UNA ETIQUETA
==================================================

JavaScript:

saludar()

React:

<Saludo />

Con props:

<CardPost titulo="Mi post" />

React convierte esa sintaxis en llamadas
internas al componente.

==================================================
EJEMPLO EJECUTABLE
==================================================
*/

function Boton() {
  return <button>Guardar</button>
}

function CardPost({ titulo }) {
  return (
    <article>
      <h2>{titulo}</h2>
    </article>
  )
}

function Vacio() {
  return null
}

function ComponentesLesson() {
  return (
    <>
      <h1>Componentes React</h1>

      <h2>Reutilización</h2>

      <Boton />
      <Boton />
      <Boton />

      <hr />

      <h2>Props</h2>

      <CardPost titulo="Primer post" />
      <CardPost titulo="Segundo post" />

      <Vacio />
    </>
  )
}

export default ComponentesLesson