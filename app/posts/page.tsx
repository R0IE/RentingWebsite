"use client";

import { useEffect, useState, useMemo } from "react";
import Post from "@/components/post";
import { Header } from "@/components/header"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  MapPin,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface PostType {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  category?: string; 
}

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "furniture", name: "Furniture" },
  { id: "tools", name: "Tools" },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || post.category === selectedCategory;
      const matchesPrice =
        post.price >= priceRange[0] && post.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [posts, searchQuery, selectedCategory, priceRange]);

  const sortedPosts = useMemo(() => {
    const items = [...filteredPosts];
    switch (sortBy) {
      case "price-low":
        return items.sort((a, b) => a.price - b.price);
      case "price-high":
        return items.sort((a, b) => b.price - a.price);
      default:
        return items.sort((a, b) => b.id - a.id);
    }
  }, [filteredPosts, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, 300]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 300;

  const FilterContent = () => (
    <div className="space-y-8 w-full">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={priceRange}
            onValueChange={(v) => {
              console.log("slider:onValueChange", v);
              setPriceRange(v as number[]);
            }}
            max={300}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Posts</h1>
          <p className="text-muted-foreground">
            Explore {posts.length} available listings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-muted border-0"
            />
          </div>

          <div className="flex gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 ${viewMode === "grid" ? "bg-muted" : ""}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 ${viewMode === "list" ? "bg-muted" : ""}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-20">
          <aside className="hidden md:block w-64 shrink-0 md:mr-8 lg:mr-12">
            <div className="sticky top-24 bg-card rounded-xl border p-6">
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1 pl-4 md:pl-8">
            {sortedPosts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {sortedPosts.map((post) => (
                  <Post
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    price={post.price}
                    location={post.location}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}