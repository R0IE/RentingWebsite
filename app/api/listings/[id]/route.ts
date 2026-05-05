import prisma from "@/lib/prisma";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 

  const listing = await prisma.listing.findUnique({
    where: { id: Number(id) }, 
    include: {
      owner: true,
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!listing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(listing);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const { title, description, pricePerDay, location, category } = body;

    const updatedListing = await prisma.listing.update({
      where: { id : Number(id) },
      data: {
        title,
        description,
        price: parseFloat(pricePerDay),
        location,
        category,
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("LISTING PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const listingId = Number(id);
    await prisma.$transaction([
      prisma.booking.deleteMany({ where: { listingId } }),
      prisma.listingImage.deleteMany({ where: { listingId } }),
      prisma.favorite.deleteMany({ where: { postId: listingId } }),
      prisma.listing.delete({ where: { id: listingId } }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("LISTING DELETE", error);
    return new NextResponse("Delete failed", { status: 500 });
  }
}