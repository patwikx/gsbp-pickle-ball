'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function fetchBookings(startDate: string, endDate: string, courtId?: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(courtId && { courtId: parseInt(courtId) }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        invitedPlayers: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' },
      ],
    })

    return bookings
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw new Error('Failed to fetch bookings')
  }
}

