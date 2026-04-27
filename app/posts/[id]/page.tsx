import Post from "@/components/post";

interface PostType {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  owner: { name: string | null };
}

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  
  if (!Number.isFinite(id)) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="mt-2 text-sm text-gray-500">Invalid post ID</p>
      </div>
    );
  }

  const res = await fetch(`http://localhost:3000/api/posts/${id}`);

  if (!res.ok) {
    const message = await res.text();
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
      </div>
    );
  }

  const post: PostType = await res.json();

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Post Details</h1>
      <Post
        id={post.id}
        title={post.title}
        description={post.description}
        price={post.price}
        location={post.location}
      />
      <p className="mt-2 text-sm text-gray-500">
        Owner: {post.owner.name ?? "Unknown"}
      </p>
    </div>
  );
}