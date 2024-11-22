import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const courtId = searchParams.get('courtId')
  const date = searchParams.get('date')

  if (!courtId || !date) {
    return NextResponse.json({ error: 'Court ID and date are required' }, { status: 400 })
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        courtId: parseInt(courtId),
        date: date,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    const bookedTimeSlots = bookings.map(booking => ({
      id: booking.id,
      courtId: booking.courtId,
      time: booking.time,
      date: booking.date,
      player: {
        id: booking.user.id,
        name: booking.user.name || 'Anonymous',
        avatar: booking.user.image || '',
      },
    }))

    // Group players by time slot
    const currentPlayers = bookedTimeSlots.reduce((acc, slot) => {
      const key = `${slot.time}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(slot.player)
      return acc
    }, {} as Record<string, Array<{ id: string; name: string; avatar: string }>>)

    return NextResponse.json({ bookedTimeSlots, currentPlayers })
  } catch (error) {
    console.error('Error fetching booked slots:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
