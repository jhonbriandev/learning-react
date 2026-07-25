// Construye un FormPost completo con:

// Campos: title (obligatorio, mínimo 5 caracteres), content (obligatorio, mínimo 20 caracteres),
// category (select nativo, obligatorio).
// Muestra errores debajo de cada campo.
// Al enviar, haz un fetch POST a http://localhost:8000/api/posts/ con el token de autenticación en el header.
// Si el envío es exitoso, limpia el formulario con reset().
// Si falla, muestra un mensaje de error genérico (puedes usar un useState solo para ese mensaje de error del servidor,
//  no para los campos).
