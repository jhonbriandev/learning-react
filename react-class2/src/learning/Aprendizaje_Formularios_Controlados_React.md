# Aprendizaje: Formularios Controlados en React

## Objetivo del ejercicio

Crear un formulario controlado con:

-   `input`
-   `textarea`
-   `select`
-   Vista previa en tiempo real
-   Botón para limpiar
-   Contador de caracteres

------------------------------------------------------------------------

# Paso 1. Comprender `onChange`

Al principio surgió la duda de por qué un mismo `onChange` podía servir
para todos los campos.

La clave fue entender que React entrega un evento (`e`) cuyo `target`
corresponde al elemento que cambió.

``` jsx
const { name, value } = e.target;
```

-   `name` indica qué campo cambió.
-   `value` contiene el nuevo valor.

------------------------------------------------------------------------

# Paso 2. Entender `[name]: value`

Fue el concepto más importante.

Sin corchetes:

``` jsx
{
  name: value
}
```

crea una propiedad llamada literalmente `name`.

Con corchetes:

``` jsx
{
  [name]: value
}
```

usa el contenido de la variable `name`.

Ejemplo:

``` text
name = "titulo"
value = "Mi primer post"
```

equivale a:

``` jsx
{
  titulo: "Mi primer post"
}
```

Gracias a esto una sola función actualiza cualquier campo.

------------------------------------------------------------------------

# Paso 3. El spread (`...form`)

Antes de modificar un campo hay que copiar el estado.

``` jsx
setForm({
  ...form,
  [name]: value,
});
```

Esto conserva todas las propiedades y reemplaza únicamente la
modificada.

------------------------------------------------------------------------

# Paso 4. Formularios controlados

Todos los campos leen el estado mediante `value`.

Cuando el usuario escribe:

1.  ocurre `onChange`
2.  se ejecuta `setForm`
3.  React vuelve a renderizar
4.  todos los componentes que leen ese estado se actualizan.

------------------------------------------------------------------------

# Paso 5. Vista previa en tiempo real

La vista previa no necesita otro formulario.

Simplemente lee el mismo estado.

``` jsx
<h3>{form.titulo}</h3>
<p>{form.contenido.slice(0,100)}</p>
```

Por eso cambia automáticamente.

------------------------------------------------------------------------

# Paso 6. Botón Limpiar

Debe regresar exactamente al estado inicial.

``` jsx
setForm({
  titulo: "",
  contenido: "",
  categoria: "tech",
  estado: "borrador",
});
```

------------------------------------------------------------------------

# Paso 7. Observación sobre el ejercicio

Se detectó una inconsistencia:

-   Pedía pintar en rojo si se superaban 500 caracteres.
-   También pedía `maxLength={500}`.

Con `maxLength` nunca es posible superar los 500 caracteres.

------------------------------------------------------------------------

# Resultado

Se comprendieron los siguientes conceptos:

-   useState
-   Estado agrupado
-   Formularios controlados
-   onChange
-   onSubmit
-   Spread operator
-   Propiedades calculadas (`[name]`)
-   Renderizado en tiempo real
-   Preview dinámica
-   Reset del formulario

El aprendizaje se realizó paso a paso, entendiendo el porqué de cada
decisión en lugar de memorizar código.
