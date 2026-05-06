import Post from "@/components/post";
import ItemDetailClient from "@/components/ItemDetailClient";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface PostType {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  owner: { name: string | null };
  images: { url: string; order: number }[];
  category: { id: number; name: string };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) notFound();

  const post = await prisma.listing.findUnique({
    where: { id },
    include: {
      owner: true,
      category: true,
      images: { orderBy: { order: "asc" } },
      bookings: true,
    },
  });

  if (!post) notFound();

  const formattedPost = {
    ...post,
    pricePerDay: post.price,
  };

  return <ItemDetailClient item={formattedPost} />;
}