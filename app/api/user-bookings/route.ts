import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import { prismadb } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const bookings = await prismadb.booking.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        courtId: true,
        date: true,
        time: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('[BOOKINGS_GET]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}