/*
==================================================
LECCIÓN 01: REGLAS DE JSX
==================================================

¿QUÉ ES JSX?

JSX significa JavaScript XML.

Permite escribir una sintaxis parecida a HTML
dentro de JavaScript.

--------------------------------------------------
DIFERENCIA CON JAVASCRIPT PURO
--------------------------------------------------

JavaScript:

const titulo = document.createElement('h1')
titulo.textContent = 'Hola Mundo'

React:

<h1>Hola Mundo</h1>

React convierte JSX internamente a JavaScript.

--------------------------------------------------
REGLAS IMPORTANTES
--------------------------------------------------

1. class -> className

HTML:

<div class="card"></div>

React:

<div className="card"></div>


2. Un solo elemento raíz

Incorrecto:

return (
  <h1>Título</h1>
  <p>Contenido</p>
)

Correcto:

return (
  <>
    <h1>Título</h1>
    <p>Contenido</p>
  </>
)


3. JavaScript entre llaves

<h1>{nombre}</h1>

4. Todas las etiquetas deben cerrarse

<img src="foto.jpg" />

5. style usa objetos JavaScript

<div style={{ color: 'blue' }}>

==================================================
*/

function ReglasJSX() {
  const nombre = 'Jhon'

  return (
    <>
      <h1>Hola {nombre}</h1>

      <div className="card">
        Ejemplo de className
      </div>

      <p>2 + 2 = {2 + 2}</p>
    </>
  )
}

export default ReglasJSX