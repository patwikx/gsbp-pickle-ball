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
    const { courtId, selectedSlots, invitedPlayers = [] } = await req.json()
    console.log('Received data:', { courtId, selectedSlots, invitedPlayers })

    const bookings = await Promise.all(
      selectedSlots.map(async (slotId: string) => {
        console.log('Processing slot:', slotId)
        
        // Parse the slot format: "2-2024-11-22-10:00" into parts
        const parts = slotId.split('-')
        if (parts.length !== 5) {
          throw new Error(`Invalid slot ID format: ${slotId}`)
        }

        // Format date as YYYY-MM-DD
        const date = `${parts[1]}-${parts[2]}-${parts[3]}`
        
        // Format time as HH:mm (already in correct format from the split)
        const time = parts[4]
        
       // console.log('Parsed slot data:', { date, time })

        // Log the exact data being saved
    //    console.log('Saving booking with:', {
       //   courtId: parseInt(courtId),
      //    date,
      //    time,
      //    userId: session.user.id,
      //    invitedPlayers
      //  })

        return prisma.booking.create({
          data: {
            courtId: parseInt(courtId),
            date,
            time,
            userId: session.user.id,
            ...(invitedPlayers.length > 0 && {
              invitedPlayers: {
                connect: invitedPlayers.map((playerId: string) => ({ id: playerId }))
              }
            })
          },
          include: {
            invitedPlayers: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        })
      })
    )

    // console.log('All bookings created:', bookings)

    return NextResponse.json({ 
      success: true, 
      bookings: bookings.map(booking => ({
        id: booking.id,
        courtId: booking.courtId,
        time: booking.time,
        date: booking.date,
        invitedPlayers: booking.invitedPlayers
      }))
    })
  } catch (error) {
   // console.error('Error creating bookings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

