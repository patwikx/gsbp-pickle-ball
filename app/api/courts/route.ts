import { NextResponse } from 'next/server'
import { prismadb } from "@/lib/db";


export async function GET() {
  try {
    const courts = await prismadb.court.findMany({
      include: {
        bookings: {
          where: {
            startTime: {
              gte: new Date()
            }
          },
          take: 1,
          orderBy: {
            startTime: 'asc'
          }
        }
      }
    })

    const formattedCourts = courts.map(court => ({
      id: court.id,
      name: court.name,
      nextAvailable: court.bookings[0]?.startTime 
        ? new Date(court.bookings[0].startTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        : 'Now'
    }))

    return NextResponse.json(formattedCourts)
  } catch (error) {
    console.error('Failed to fetch courts:', error)
    return NextResponse.json({ error: 'Failed to fetch courts' }, { status: 500 })
  }
}