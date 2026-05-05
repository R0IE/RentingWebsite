"use client";

import { useEffect, useState, useMemo } from "react";
import Post from "@/components/post";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Grid3X3, List } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface ListingType {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  category: Category;
  images: { url: string; order: number }[];
}

export default function ListingsPage() {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([0, 300]); // CURRENTLY HARDCODED
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    Promise.all([
      fetch("/api/listings").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([listingsData, categoriesData]) => {
      setListings(listingsData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || l.category?.id === selectedCategory;
      const matchesPrice =
        l.price >= priceRange[0] && l.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [listings, searchQuery, selectedCategory, priceRange]);

  const sortedListings = useMemo(() => {
    const items = [...filteredListings];
    switch (sortBy) {
      case "price-low":
        return items.sort((a, b) => a.price - b.price);
      case "price-high":
        return items.sort((a, b) => b.price - a.price);
      default:
        return items.sort((a, b) => b.id - a.id);
    }
  }, [filteredListings, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, 300]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    !!searchQuery || !!selectedCategory || priceRange[0] > 0 || priceRange[1] < 300;

  const FilterContent = () => (
    <div className="space-y-8 w-full">
      <div className="max-w-xs">
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
            onValueChange={(v) => setPriceRange(v as number[])}
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

  if (loading) return <p className="text-center mt-10">Loading listings...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Listings</h1>
          <p className="text-muted-foreground">
            Explore {listings.length} available listings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search listings..."
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

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-10 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border p-6">
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1 pl-4 md:pl-8">
            {sortedListings.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {sortedListings.map((listing) => (
                  <Post
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    description={listing.description}
                    price={listing.price}
                    location={listing.location}
                    images={listing.images}
                    category={listing.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No listings found</h3>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}