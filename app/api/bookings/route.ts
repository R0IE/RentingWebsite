import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, renterId, startDate, endDate } = body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        listingId: parseInt(listingId),
        status: { in: ["CONFIRMED", "PENDING"] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } }
        ]
      }
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: "Date overlap" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        listingId: parseInt(listingId),
        renterId: parseInt(renterId),
        startDate: start,
        endDate: end,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });

  } catch (error: any) {
    console.error("BOOKING_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const mode = searchParams.get("mode"); 

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    let bookings;

    if (mode === "owner") {
      bookings = await prisma.booking.findMany({
        where: {
          listing: {
            ownerId: parseInt(userId),
          },
        },
        include: {
          listing: {
            include: { images: true }
          },
          renter: { select: { name: true, image: true } },
        },
        orderBy: { startDate: "asc" },
      });
    } else {
      bookings = await prisma.booking.findMany({
        where: {
          renterId: parseInt(userId),
        },
        include: {
          listing: {
            include: { images: true }
          },
        },
        orderBy: { startDate: "asc" },
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}