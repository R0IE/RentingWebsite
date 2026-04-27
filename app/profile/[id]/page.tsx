import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Post from "@/components/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <h1 className="text-2xl font-bold mb-6">NOT DONE</h1>
    </div>
  )
}