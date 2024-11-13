'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, LandPlot, Plus, User, CalendarDays, History } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Booking {
  id: string
  courtId: number
  date: string
  time: string
}

export default function UserBookingsx() {
  const router = useRouter()
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/user-bookings')
        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }
        const data = await response.json()
        setBookings(data)
      } catch (err) {
        setError('Failed to load bookings')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleNewBooking = () => {
    router.push('/book-schedule')
  }

  const upcomingBookings = bookings.filter(booking => new Date(`${booking.date} ${booking.time}`) > new Date())
  const pastBookings = bookings.filter(booking => new Date(`${booking.date} ${booking.time}`) <= new Date())

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading your bookings...</CardTitle>
              <CardDescription>Please wait while we fetch your court reservations</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription className="text-destructive">{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back!</h1>
              <p className="text-muted-foreground">Manage your pickleball court bookings</p>
            </div>
          </div>
          <Button onClick={handleNewBooking} size="lg">
            <Plus className="mr-2 h-5 w-5" /> New Booking
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all courts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Reserved sessions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Games</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Completed sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Court Reservations</CardTitle>
            <CardDescription>View and manage your pickleball court bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                <ScrollArea className="h-[400px] pr-4">
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming bookings. Time to schedule your next game!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id} className="bg-card hover:bg-accent transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <LandPlot className="h-5 w-5 text-primary" />
                                  <span className="font-medium">Court {booking.courtId}</span>
                                  <Badge variant="secondary">Upcoming</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{booking.time}</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="past">
                <ScrollArea className="h-[400px] pr-4">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No past bookings found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <Card key={booking.id} className="bg-muted/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <LandPlot className="h-5 w-5 text-muted-foreground" />
                                  <span className="font-medium">Court {booking.courtId}</span>
                                  <Badge variant="outline">Completed</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{booking.time}</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                Book Again
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}