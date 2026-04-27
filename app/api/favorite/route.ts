import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));
  const postId = Number(searchParams.get("postId"));

  const [favorite, count] = await Promise.all([
    prisma.favorite.findUnique({
      where: { userId_postId: { userId, postId } },
    }),
    prisma.favorite.count({
      where: { postId },
    }),
  ]);

  return NextResponse.json({ favorited: !!favorite, count });
}

export async function POST(req: Request) {
  const { userId, postId } = await req.json();

  try {
    const favorite = await prisma.favorite.create({
      data: { userId, postId },
    });
    return NextResponse.json(favorite, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Already favorited" }, { status: 409 });
  }
}

export async function DELETE(req: Request) {
  const { userId, postId } = await req.json();

  try {
    await prisma.favorite.delete({
      where: { userId_postId: { userId, postId } },
    });
    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
  }
}