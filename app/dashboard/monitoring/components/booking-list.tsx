'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { fetchBookings } from './queries'

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

interface BookingListProps {
  date: string
  courtId?: string
}

export default function BookingList({ date, courtId }: BookingListProps) {
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
      <div className="space-y-3 p-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-14 w-full" />
          </Card>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-muted-foreground">No bookings found for the selected date and court.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-3">
      {bookings.map((booking) => (
        <Card key={booking.id} className="overflow-hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value={booking.id} className="border-none">
              <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-primary/10">
                      {booking.user.name?.[0].toUpperCase() || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{booking.user.name}</span>
                    <span className="text-sm text-muted-foreground">{booking.user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="h-6 bg-background">Court {booking.courtId}</Badge>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 pb-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Invited Players</h4>
                      <div className="grid gap-3">
                        {booking.invitedPlayers.map((player) => (
                          <div key={player.id} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarFallback className="bg-primary/10">
                                {player.name?.[0].toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{player.name}</span>
                              <span className="text-sm text-muted-foreground">{player.email}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Booking ID</h4>
                      <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                        {booking.id}
                      </code>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      ))}
    </div>
  )
}

