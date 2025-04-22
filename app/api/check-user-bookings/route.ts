import { NextResponse } from 'next/server'
import { prismadb } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date')

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const existingBooking = await prismadb.booking.findFirst({
      where: {
        userId: userId,
        date: date,
      },
      select: {
        courtId: true
      }
    })

    return NextResponse.json({
      hasBooking: !!existingBooking,
      courtNumber: existingBooking?.courtId
    })
  } catch (error) {
    console.error('Error checking booking:', error)
    return NextResponse.json(
      { error: 'Failed to check booking' },
      { status: 500 }
    )
  }
}