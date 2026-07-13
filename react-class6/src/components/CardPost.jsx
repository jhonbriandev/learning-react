export default function CardPost({ post }) {
  return (
    <div>
      {/* post.title y post.content existen porque "post" es un objeto
          con esa forma, por ejemplo: { id: 1, title: "Hola", content: "..." } */}
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
}
