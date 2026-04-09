"use client"

import { useEffect, useState } from "react";
import Post from "@/components/post";

interface PostType {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">All Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            description={post.description}
            price={post.price}
            location={post.location}
          />
        ))
      )}
    </div>
  );
}