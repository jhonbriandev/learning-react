/*
==================================================
LECCIÓN 02: JSX
==================================================

JSX NO ES HTML.

JSX es azúcar sintáctica sobre JavaScript.

--------------------------------------------------
DIFERENCIA CON JAVASCRIPT PURO
--------------------------------------------------

JavaScript:

const titulo = document.createElement('h1')
titulo.textContent = 'Hola Jhon'

React:

<h1>Hola Jhon</h1>

--------------------------------------------------
LO QUE ESCRIBIMOS
--------------------------------------------------

<h1 className="titulo">
  Hola Jhon
</h1>

--------------------------------------------------
LO QUE REACT GENERA
--------------------------------------------------

React.createElement(
  'h1',
  { className: 'titulo' },
  'Hola Jhon'
)

==================================================
*/

function JSXLesson() {
  return (
    <div>
      <h1 className="titulo">
        Hola Jhon
      </h1>
    </div>
  )
}

export default JSXLesson