"use client"

import { useEffect, useState } from "react";
import Post from "@/components/post";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PostType {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: { url: string; order: number }[];
  category: { id: number; name: string };
}

export function MultiPosts() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/listings");
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <Link href="/listings">
          <Button>View all posts</Button>
        </Link>
      </div>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              price={post.price}
              location={post.location}
              images={post.images}
              category={post.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}