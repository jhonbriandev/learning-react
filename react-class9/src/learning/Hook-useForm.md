# React Hook Form (RHF)

## 1. El problema que resuelve (con analogía)

Hasta ahora, probablemente has manejado formularios así:

```jsx
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
// ...un useState por cada campo, y un onChange por cada uno también
```

### Analogía

Imagina que tienes un formulario en papel con **10 campos**, y para cada campo contratas a una persona diferente que se queda parada mirando ese campo. Cada vez que escribes una letra, esa persona corre a avisarte:

> "¡Oye, cambió algo!"

Entonces tú vuelves a revisar y actualizar **todo el formulario**.

Eso es, en esencia, lo que ocurre con **`useState` + `onChange`**:

- Cada campo tiene su propio estado.
- Cada pulsación de una tecla actualiza el estado.
- Cada actualización provoca un **re-render** del componente completo.

Con formularios pequeños esto apenas se nota.

Pero con formularios grandes (como un formulario para crear un post con título, contenido, categoría, imagen, etc.) esto genera trabajo innecesario.

### ¿Qué hace React Hook Form?

React Hook Form (RHF) actúa como un **secretario muy eficiente**.

En lugar de avisarte letra por letra, el secretario:

- Va anotando todo internamente.
- Usa **refs**, que son referencias directas a los elementos del DOM.
- Solo te entrega toda la información cuando realmente la necesitas (por ejemplo, al enviar el formulario).

**Resultado:**

- ✅ Menos re-renders.
- ✅ Menos código.
- ✅ Validaciones integradas.
- ✅ Mejor rendimiento.

---

# 2. Las piezas clave del hook `useForm`

```jsx
import { useForm } from "react-hook-form";

function FormPost() {
  const {
    register, // (A)
    handleSubmit, // (B)
    formState: { errors }, // (C)
    reset, // (D)
  } = useForm();

  // ...
}
```

## (A) `register`

Es la función que **conecta un input con React Hook Form**.

También puedes definir reglas de validación.

```jsx
<input
  {...register("title", {
    required: "El título es obligatorio",
  })}
/>
```

### ¿Qué hace `register`?

Internamente devuelve algo parecido a esto:

```jsx
{
  (name, onChange, onBlur, ref);
}
```

Gracias al operador spread (`...`):

```jsx
{...register("title")}
```

todas esas propiedades se colocan automáticamente dentro del `<input>`.

Ya **no necesitas escribir** manualmente:

```jsx
onChange={...}
```

ni controlar el estado del input.

React Hook Form se encarga de ello.

---

## (B) `handleSubmit`

Es la función que envuelve tu función de envío.

```jsx
<form onSubmit={handleSubmit(onValid)}>
```

Antes de ejecutar `onValid`:

1. Valida todos los campos.
2. Si existe algún error, **no ejecuta** tu función.
3. Si todo está correcto, te entrega los datos ya preparados.

Ejemplo:

```jsx
const onValid = (data) => {
  console.log(data);
};
```

Aquí `data` contendrá todos los valores del formulario.

---

## (C) `formState: { errors }`

`errors` es un objeto que contiene todos los errores de validación.

Ejemplo:

```jsx
errors.title;
errors.content;
errors.category;
```

Cada propiedad corresponde al nombre que registraste con `register`.

---

## (D) `reset`

Sirve para limpiar el formulario.

Muy útil después de guardar correctamente un post.

```jsx
reset();
```

---

# 3. Validaciones

Las validaciones se definen dentro de `register`.

```jsx
register("title", {
  required: "El título es obligatorio",

  minLength: {
    value: 5,
    message: "El título debe tener al menos 5 caracteres",
  },
});
```

## ¿Por qué esta forma es recomendable?

Para principiantes es la opción más sencilla porque:

- Es declarativa.
- El mensaje de error está junto a la regla.
- No necesitas escribir funciones de validación para los casos comunes.
- Todo queda organizado en un mismo lugar.

---

# 4. Mostrando errores

```jsx
<input
  {...register("title", {
    required: "El título es obligatorio",
  })}
/>;

{
  errors.title && <span className="error">{errors.title.message}</span>;
}
```

## ¿Por qué usamos `.message`?

Porque `errors.title` **no es un texto**.

Es un objeto parecido a este:

```jsx
{
  type: "required",
  message: "El título es obligatorio"
}
```

Si intentaras renderizar directamente:

```jsx
{
  errors.title;
}
```

React lanzaría un error porque no puede mostrar un objeto como texto.

Por eso se usa:

```jsx
errors.title.message;
```

que sí contiene el mensaje que queremos mostrar.

---

# Resumen

- **`useForm()`** crea el formulario y proporciona todas las herramientas necesarias.
- **`register()`** conecta cada input con React Hook Form.
- **`handleSubmit()`** valida todos los campos antes de ejecutar la función de envío.
- **`errors`** almacena los errores de validación.
- **`reset()`** limpia el formulario.
- React Hook Form utiliza **refs** para reducir re-renders y mejorar el rendimiento frente a formularios controlados con `useState`.
