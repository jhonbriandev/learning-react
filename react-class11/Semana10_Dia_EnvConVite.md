# 📘 Clase: Variables de Entorno (.env) con Vite

**Semana:** 10
**Proyecto:** Blog full stack (React + Django REST Framework)
**Tema del día:** Configuración de `.env` en Vite y manejo eficiente de importaciones

---

## 🎯 Objetivo de la clase

Aprender a manejar variables de entorno en un proyecto de Vite + React, entender la diferencia entre los distintos archivos `.env`, y centralizar su acceso mediante un archivo de configuración (`config/env.js`), aplicado al proyecto de blog conectado a Django.

---

## 🧩 Conceptos clave aprendidos

### 1. ¿Qué es una variable de entorno?
Un valor de configuración que vive fuera del código (en un archivo `.env`) y que la app lee al arrancar. Sirve para no hardcodear valores que cambian según el entorno (ej: URL de la API en desarrollo vs producción).

### 2. El prefijo `VITE_` es obligatorio
Vite **solo expone al navegador** las variables que empiezan con `VITE_`. Esto es una medida de seguridad: como todo el código del frontend es público (cualquiera puede inspeccionarlo), Vite evita que datos sensibles del `.env` lleguen accidentalmente al navegador.

```javascript
// Acceso a las variables en el código
const API_URL = import.meta.env.VITE_API_URL;
```

- Se usa `import.meta.env` (propio de Vite/navegador), **no** `process.env` (eso es de Node.js/servidor).

### 3. Reiniciar el servidor tras cambios en `.env`
Si el servidor de desarrollo (`npm run dev`) ya está corriendo, no detecta cambios nuevos en `.env` automáticamente. Hay que reiniciarlo.

### 4. Tipos de archivos `.env` y cuándo se usan

| Archivo | ¿Cuándo se carga? | ¿Se sube a Git? | ¿Para qué? |
|---|---|---|---|
| `.env` | Siempre | ✅ Sí | Valores comunes/genéricos a todos los entornos |
| `.env.local` | Siempre | ❌ Nunca | Overrides personales o secretos locales |
| `.env.development` | Solo con `npm run dev` | ✅ Sí | Config específica de desarrollo |
| `.env.production` | Solo con `npm run build` | ✅ Sí | Config específica de producción |
| `.env.development.local` | Solo en dev, solo tú | ❌ Nunca | Secretos de desarrollo personales |
| `.env.production.local` | Solo en producción, solo tú | ❌ Nunca | Secretos de producción (raro en frontend) |

**Orden de prioridad (mayor a menor) en modo desarrollo:**
```
.env.development.local
.env.local
.env.development
.env
```

**Decisión tomada para el proyecto del blog:** se usarán **ambos**, `.env` y `.env.development`, de forma simultánea:
- `.env` → valores comunes/genéricos (ej: `VITE_APP_NAME`, `VITE_DEBUG`)
- `.env.development` → valores específicos de desarrollo (ej: `VITE_API_URL`)

Recomendación aplicada: evitar repetir la misma variable en ambos archivos con valores distintos, para no generar ambigüedad sobre cuál "gana".

### 5. Variables automáticas de Vite (sin definirlas en `.env`)
- `import.meta.env.DEV` → `true` en desarrollo
- `import.meta.env.PROD` → `true` en producción
- `import.meta.env.MODE` → `"development"` o `"production"`

### 6. Centralizar la lectura de `.env` en un archivo de configuración
En lugar de que cada componente/servicio llame directamente a `import.meta.env`, se centraliza en **un solo archivo** (`config/env.js`). Ventajas:
1. Un solo punto de cambio si se renombra una variable.
2. Falla rápido y claro (con `throw new Error`) si falta una variable crítica, en vez de un `undefined` silencioso.
3. Se ve profesional en un repositorio de portafolio (buena separación de responsabilidades).

### 7. Validar solo lo crítico
No todas las variables merecen la misma validación:
- `VITE_API_URL` → **crítica**, sin ella la app no puede hacer fetch al backend → merece `throw new Error`.
- `VITE_APP_NAME` → **cosmética**, solo afecta apariencia (ej. un título) → no necesita romper la app si falta.

### 8. Nunca exponer secretos con prefijo `VITE_`
Un "token maestro" o clave de administrador **nunca** debe llevar el prefijo `VITE_` ni subirse a un repositorio. Si se necesita para pruebas locales, debe ir en `.env.local` (o `.env.development.local`), y ese archivo debe estar en `.gitignore`.

```bash
# .gitignore
.env.local
.env.*.local
```

---

## 🔬 Laboratorio: código con problema vs corregido

**❌ Con problema** (falta el prefijo `VITE_` en el `.env`):
```bash
# .env
API_URL=http://localhost:8000/api
```
```javascript
const API_URL = import.meta.env.VITE_API_URL; // undefined
```

**✅ Corregido:**
```bash
# .env
VITE_API_URL=http://localhost:8000/api
```
```javascript
const API_URL = import.meta.env.VITE_API_URL; // funciona
```

---

## 💻 Código final validado para el proyecto

**Estructura de archivos:**
```bash
# .env
VITE_APP_NAME=Mi Blog
VITE_DEBUG=true

# .env.development
VITE_API_URL=http://localhost:8000/api
```

```javascript
// src/config/env.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

if (!config.apiUrl) {
  throw new Error(
    "VITE_API_URL no está definida. " +
      "Crea un archivo .env o .env.development con esta variable.",
  );
}

export default config;
```

```javascript
// src/services/postsService.js
import config from "../config/env";

const BASE_URL = config.apiUrl;

export async function getAll(token) {
  const response = await fetch(`${BASE_URL}/posts/`, {
    headers: { Authorization: `Token ${token}` }
  });
  return response.json();
}
```

**Nota de estructura:** `postsService.js` vive en `src/services/`, hermana de `src/config/`, por lo que `import config from "../config/env"` resuelve correctamente subiendo un nivel desde `services/` hasta `src/` y bajando a `config/env.js`.

---

## ✅ Errores cometidos durante la práctica (y cómo se corrigieron)

1. **Mensaje de error desactualizado:** el `config.js` inicial mencionaba `.env.development` cuando aún no se había decidido si se usaría ese archivo. → Corregido para reflejar la decisión real tomada (`.env` y `.env.development`).
2. **Confusión momentánea en Respuesta 3:** se afirmó "no debe exponerse... o sea que se debe subir a repositorios", una contradicción lógica. → Aclarado: fue un error de tecleo; el token maestro **no** debe subirse a ningún repositorio.
3. **Ruta de import a verificar:** se confirmó que `config/env.js` y el import `../config/env` en `postsService.js` son coherentes, dado que `postsService.js` está en `src/services/`.

---

## 💪 Virtudes demostradas

- Buen entendimiento del concepto de "variable crítica vs cosmética" al decidir qué validar.
- Iniciativa para incluir variables automáticas de Vite (`DEV`, `PROD`, `MODE`) sin que se pidieran explícitamente.
- Buen razonamiento sobre cuándo usar `export default` vs `export const` (named exports), tomando una decisión justificada según el contexto del proyecto.
- Capacidad de autocorregirse rápidamente al detectar la contradicción lógica en la Respuesta 3.

---

## 📌 Pendientes / Buenas prácticas a reforzar más adelante

- Recordar la regla de prioridad entre `.env` y `.env.development` si en el futuro se repite una misma variable en ambos.
- Mantener el hábito de que los mensajes de error en el código reflejen fielmente las decisiones reales tomadas en el proyecto (no dejar mensajes "genéricos" de tutoriales).
- Cuando se agregue autenticación o tokens sensibles, aplicar la regla de "nunca exponer con prefijo `VITE_`" y usar `.env.local` + `.gitignore`.

---

## 📝 Ejercicios resueltos en la sesión

1. **Diagnóstico** ✅ — coincidencia de nombres entre `.env` y el código.
2. **Corrección de código** ✅ — nombre de variable no coincidía (`TOKEN_KEY` vs `VITE_TOKEN_KEY`).
3. **Caso de decisión** ✅ — URL de API puede llevar prefijo `VITE_`; token maestro nunca debe exponerse ni subirse a repositorio.
4. **Desde cero** ✅ — `.env` + `.env.development` + `config/env.js` + `postsService.js` integrados correctamente.
