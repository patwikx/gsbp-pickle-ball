import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import { prismadb } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const players = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(players)
  } catch (error) {
    console.error('[REGISTERED_PLAYERS_GET]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
