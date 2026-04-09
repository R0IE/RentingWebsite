import prisma from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      },
    },
  });

  return Response.json(posts);
}

export async function POST(req: Request) {
  const { title, description, price, location, ownerId } = await req.json();

  if (!title || !ownerId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: { title, description, price, location, ownerId },
  });

  return Response.json(post, { status: 201 });
}