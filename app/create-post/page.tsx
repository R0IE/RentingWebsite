"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, DollarSign, FileText, Tag } from "lucide-react";

interface CreatePostPageProps {
  onClose?: () => void;
}

export default function CreatePostPage({ onClose }: CreatePostPageProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const ownerId = Number(session?.user?.id);
    if (!session || !Number.isFinite(ownerId)) {
      setError("You must be signed in to create a post.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(price),
        location,
        ownerId,
      }),
    });

    if (res.ok) {
      if (onClose) {
        onClose();
      } else {
        router.push("/posts");
      }
    } else {
      setError("Failed to create post.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">List an Item</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to create your rental listing.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              Title
            </label>
            <Input
              placeholder="e.g. Trek Mountain Bike"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Description
            </label>
            <Textarea
              placeholder="Describe your item, condition, what's included..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Price per day
              </label>
              <Input
                placeholder="0.00"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Location
              </label>
              <Input
                placeholder="e.g. Saue Nurmesalu 5, Pärnu Tee 5"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => (onClose ? onClose() : router.back())}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Publishing..." : "Publish Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}