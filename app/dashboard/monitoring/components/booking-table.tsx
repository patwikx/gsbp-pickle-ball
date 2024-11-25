'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { fetchBookings } from './queries'
import BookingDetails from './booking-details'



type Player = {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

type Booking = {
  id: string
  courtId: number
  date: string
  time: string
  user: Player
  invitedPlayers: Player[]
}

interface BookingTableProps {
  date: string
  courtId?: string
}

export default function BookingTable({ date, courtId }: BookingTableProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      try {
        const fetchedBookings = await fetchBookings(date, date, courtId)
        setBookings(fetchedBookings)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [date, courtId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No bookings found for the selected date and court.</p>
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {bookings.map((booking) => (
        <AccordionItem key={booking.id} value={booking.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={booking.user.image || undefined} alt={booking.user.name || 'User'} />
                  <AvatarFallback>{booking.user.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{booking.user.name || 'Anonymous'}</span>
                  <span className="text-sm text-muted-foreground">{booking.user.email}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">Court {booking.courtId}</Badge>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <BookingDetails booking={booking} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

