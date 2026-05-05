import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { title, description, price, location, ownerId, categoryId, imageUrls } = await req.json();

  if (!title || !ownerId || !categoryId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title, description, price, location, ownerId, categoryId,
      images: {
        create: imageUrls.map((url: string, i: number) => ({ url, order: i })),
      },
    },
  });

  return Response.json(listing, { status: 201 });
}

export async function GET() {
  const listings = await prisma.listing.findMany({
    include: {
      category: true, 
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(listings);
}