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
    })

    const bookedTimeSlots = bookings.map(booking => ({
      id: booking.id,
      courtId: booking.courtId,
      time: booking.time,
      date: booking.date
    }))

    return NextResponse.json({ bookedTimeSlots })
  } catch (error) {
    console.error('Error fetching booked slots:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}