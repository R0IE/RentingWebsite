import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id },
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

  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  return Response.json(post);
}