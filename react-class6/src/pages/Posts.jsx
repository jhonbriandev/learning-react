import useFetch from "../hooks/useFetch";
import CardPost from "../components/CardPost";

export function Posts() {
  const { data, cargando, error } = useFetch(
    `http://127.0.0.1:8000/api/posts/`,
  );

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const posts = data?.results || data || [];
  console.log(data?.results);
  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <CardPost key={post.id} post={post} />
      ))}
    </div>
  );
}
