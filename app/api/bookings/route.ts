import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { courtId, selectedSlots } = await req.json()
    console.log('Received data:', { courtId, selectedSlots })

    const bookings = await Promise.all(
      selectedSlots.map(async (slotId: string) => {
        console.log('Processing slot:', slotId)
        // Using | as separator to avoid issues with date formats
        const [courtIdStr, date, time] = slotId.split('|')
        console.log('Parsed slot data:', { courtIdStr, date, time })
        
        if (!date || !time) {
          throw new Error(`Invalid slot ID format: ${slotId}`)
        }

        // Log the exact data being saved
        console.log('Saving booking with:', {
          courtId: parseInt(courtId),
          date,
          time,
          userId: session.user.id
        })

        return prisma.booking.create({
          data: {
            courtId: parseInt(courtId),
            date, // This should now be the complete YYYY-MM-DD
            time, // This should now be HH:mm
            userId: session.user.id,
          },
        })
      })
    )

    console.log('All bookings created:', bookings)

    return NextResponse.json({ 
      success: true, 
      bookings: bookings.map(booking => ({
        id: booking.id,
        courtId: booking.courtId,
        time: booking.time,
        date: booking.date,
      }))
    })
  } catch (error) {
    console.error('Error creating bookings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}