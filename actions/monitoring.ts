'use server'

import { prismadb } from "@/lib/db";

export async function getBookings() {
  try {
    const bookings = await prismadb.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        invitedPlayers: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
}

export async function cancelBooking(id: string) {
  try {
    await prismadb.booking.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw new Error("Failed to cancel booking");
  }
}