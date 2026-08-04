const VARIANTES = {
  published: { clase: "badge-verde", texto: "Publicado" },
  draft: { clase: "badge-gris", texto: "Borrador" },
  archived: { clase: "badge-rojo", texto: "Archivado" },
};

function Badge({ estado }) {
  const variante = VARIANTES[estado] || { clase: "badge-gris", texto: estado };

  return <span className={`badge ${variante.clase}`}>{variante.texto}</span>;
}

export default Badge;
