'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { AlertCircle, Calendar, Clock, Edit3, LandPlot, MoreVertical, Plus, RefreshCcw, Trash2, CalendarDays, History } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Navbar from '@/components/navbar'

interface Booking {
  id: string
  courtId: number
  userId: string
  date: string
  time: string
  createdAt: string
  updatedAt: string
}

export default function UserBookings() {
  const router = useRouter()
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)
  const [showDetails, setShowDetails] = React.useState(false)
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)

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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to cancel booking')
      
      setBookings(bookings.filter(booking => booking.id !== bookingId))
      setShowCancelDialog(false)
      setSelectedBooking(null)
    } catch (err) {
      console.error(err)
      setError('Failed to cancel booking')
    }
  }

  const handleReschedule = (bookingId: string) => {
    router.push(`/reschedule/${bookingId}`)
  }

  const upcomingBookings = bookings
  .filter(booking => new Date(`${booking.date} ${booking.time}`) > new Date())
  .sort((a, b) => {
    const dateTimeA = new Date(`${a.date} ${a.time}`);
    const dateTimeB = new Date(`${b.date} ${b.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  });
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
            <CardContent className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto py-6 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
          <Navbar />
            <div>
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Manage your pickleball court reservations</p>
            </div>
          </div>
          <Button onClick={handleNewBooking} size="lg" className="shadow-lg">
            <Plus className="mr-2 h-5 w-5" /> New Booking
          </Button>
        </div>

        {/* Next Booking Alert */}
        {upcomingBookings.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Your Next Booking{upcomingBookings.length > 1 && 's'}</CardTitle>
              <CardDescription>
                {format(new Date(upcomingBookings[0].date), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBookings
                .filter(booking => booking.date === upcomingBookings[0].date)
                .map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LandPlot className="h-4 w-4" />
                        <span>Court {booking.courtId}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowDetails(true)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all courts
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Reserved sessions
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Games</CardTitle>
              <History className="h-4 w-4 text-primary" />
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
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Court Reservations</CardTitle>
            <CardDescription>View and manage your pickleball court bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                <ScrollArea className="h-[500px] pr-4">
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-8 space-y-4">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div className="text-muted-foreground">No upcoming bookings. Time to schedule your next game!</div>
                      <Button onClick={handleNewBooking} variant="outline">
                        Schedule Now
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id} className="bg-card hover:bg-accent/5 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <LandPlot className="h-5 w-5 text-primary" />
                                  <span className="font-medium">Court {booking.courtId}</span>
                                  <Badge>Upcoming</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(new Date(booking.date), 'PPP')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{booking.time}</span>
                                  </div>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedBooking(booking)
                                    setShowDetails(true)
                                  }}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReschedule(booking.id)}>
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Reschedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => {
                                      setSelectedBooking(booking)
                                      setShowCancelDialog(true)
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="past">
                <ScrollArea className="h-[500px] pr-4">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-8 space-y-4">
                      <History className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div className="text-muted-foreground">No past bookings found.</div>
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
                                    <span>{format(new Date(booking.date), 'PPP')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{booking.time}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNewBooking}
                                className="gap-2"
                              >
                                <RefreshCcw className="h-4 w-4" />
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

      {/* Booking Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about your court reservation
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Court</label>
                  <p className="text-lg">{selectedBooking.courtId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-lg">{format(new Date(selectedBooking.date), 'PPP')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                  <p className="text-lg">{selectedBooking.time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Booking ID</label>
                  <p className="text-lg font-mono">{selectedBooking.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-lg">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-lg">{new Date(selectedBooking.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleReschedule(selectedBooking.id)}>
                  Reschedule
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetails(false)
                    setShowCancelDialog(true)
                  }}
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this court reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <LandPlot className="h-5 w-5 text-primary" />
                      <span className="font-medium">Court {selectedBooking.courtId}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(selectedBooking.date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedBooking.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}