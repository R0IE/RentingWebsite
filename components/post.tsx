"use client";

import { useState, useEffect } from "react";
import { MapPin, Heart, DollarSign } from "lucide-react";

interface PostProps {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: { url: string; order: number }[];
  category: { id: number; name: string };
}

// needs images , calendar dates 

export default function Post({ id, title, description, price, location, images, category }: PostProps) {
  const [fav, setFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`/api/favorite?userId=1&postId=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setFav(data.favorited);
        setCount(data.count);
      });
  }, [id]);

  async function toggleFavorite() {
    if (loading) return;
    setLoading(true);
    await fetch("/api/favorite", {
      method: fav ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, postId: id }),
    });
    setFav((prev) => !prev);
    setCount((prev) => (fav ? prev - 1 : prev + 1));
    setLoading(false);
  };

  async function viewPost() {
    // adding this later on
  }

  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
        {images && images.length > 0 ? (
          <img
            src={images[0].url}
            alt={title}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image
          </div>
        )}
        <button
          onClick={toggleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              fav ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {count > 0 && (
            <span className="text-sm text-muted-foreground shrink-0">
              {count} {count === 1 ? "like" : "likes"}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {category.name}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">{price}</span>
        </div>

        {/* disabled for now because i dont like the design choiche */}
        {/* <div className="flex gap-2">
          <button
            onClick={viewPost}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
              loading ? "bg-primary/50 text-white cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            view
          </button>
        </div> */}
      </div>
    </div>
  );
}