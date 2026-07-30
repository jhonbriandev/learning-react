import { useState, useEffect } from "react";
import { Feedback } from "../learning/Feedback";

function CardPostDetalle({ postId }) {
  // ==========================================
  // Estado donde guardamos la información del post
  // ==========================================
  // Inicialmente es null porque todavía no hemos
  // recibido datos de la API.

  const [post, setPost] = useState(null);

  // ==========================================
  // Estado del proceso de carga
  // ==========================================
  // Controla qué debe mostrar la interfaz:
  //
  // loading  -> cargando datos
  // success  -> datos cargados correctamente
  // error    -> ocurrió un problema
  //

  const [status, setStatus] = useState("loading");

  // ==========================================
  // Estado para guardar el mensaje del error
  // ==========================================
  //
  // Este estado será utilizado por Feedback
  // para mostrar al usuario qué ocurrió.

  const [error, setError] = useState("");

  // ==========================================
  // useEffect para obtener el detalle del post
  // ==========================================
  //
  // Se ejecuta:
  // - cuando el componente aparece
  // - cuando cambia postId
  //
  // Ejemplo:
  // /posts/1
  // /posts/2
  //
  // Al cambiar el id, vuelve a consultar.

  useEffect(() => {
    // ==========================================
    // No hacemos el useEffect async directamente
    // ==========================================
    //
    // React espera que useEffect devuelva:
    // - nada
    // - una función cleanup
    //
    // Por eso creamos una función async interna.

    async function cargarPostDetalle() {
      try {
        // ==========================================
        // Petición a la API
        // ==========================================
        //
        // Intentamos obtener el post específico.

        const res = await fetch(`http://localhost:8000/api/posts/${postId}/`);

        // ==========================================
        // Validación de respuesta HTTP
        // ==========================================
        //
        // fetch solamente falla automáticamente
        // cuando hay problemas de red.
        //
        // Si la API responde:
        // 404
        // 401
        // 500
        //
        // debemos lanzar manualmente un error.

        if (!res.ok) {
          throw new Error("Error al encontrar el post");
        }

        // ==========================================
        // Convertimos la respuesta a JSON
        // ==========================================

        const data = await res.json();

        // ==========================================
        // Guardamos el post recibido
        // ==========================================

        setPost(data);

        // ==========================================
        // Cambiamos el estado a éxito
        // ==========================================
        //
        // Solo llegamos aquí si todo salió bien.

        setStatus("success");
      } catch (err) {
        // ==========================================
        // Capturamos cualquier error
        // ==========================================
        //
        // Usamos "err" porque:
        //
        // error  -> estado de React
        // err    -> error temporal capturado
        //
        // Así evitamos confundir variables.

        setError(err.message);

        // Cambiamos la interfaz al estado error

        setStatus("error");
      }
    }

    // Ejecutamos la función

    cargarPostDetalle();
  }, [postId]);

  // ==========================================
  // Estado Loading
  // ==========================================
  //
  // Mientras esperamos la respuesta mostramos
  // un mensaje de carga.

  if (status === "loading") {
    return <Feedback status={status} loadingText="Cargando post..." />;
  }

  // ==========================================
  // Estado Error
  // ==========================================
  //
  // Si algo falló:
  //
  // - error de red
  // - post inexistente
  // - servidor caído
  //
  // Feedback informa al usuario.

  if (status === "error") {
    return <Feedback status={status} errorMsg={error} />;
  }

  // ==========================================
  // Estado Success
  // ==========================================
  //
  // Aquí sabemos que:
  //
  // 1. La petición funcionó
  // 2. Tenemos información en post
  //
  // Ahora podemos renderizar.

  return (
    <div>
      <h3>{post.title}</h3>
    </div>
  );
}

export default CardPostDetalle;
