'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { AlertCircle, Calendar, ChevronLeft, ChevronRight, Clock, LandPlot, MoreVertical, Plus, RefreshCcw, CalendarDays, History, User, CreditCard, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterCourt, setFilterCourt] = React.useState<number | 'all'>('all')
  const bookingsPerPage = 5

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
    router.push('/dashboard/book-schedule')
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

  const formatDateTime = (date: string | null, time: string | null) => {
    if (!date || !time) return null
    try {
      return new Date(`${date} ${time}`)
    } catch (error) {
      console.error('Invalid date or time format:', error)
      return null
    }
  }

  const filteredBookings = bookings.filter(booking => 
    (filterCourt === 'all' || booking.courtId === filterCourt) &&
    (booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     booking.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
     booking.time.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const upcomingBookings = filteredBookings
    .filter(booking => {
      const dateTime = formatDateTime(booking.date, booking.time)
      return dateTime ? dateTime > new Date() : false
    })
    .sort((a, b) => {
      const dateTimeA = formatDateTime(a.date, a.time)
      const dateTimeB = formatDateTime(b.date, b.time)
      if (!dateTimeA || !dateTimeB) return 0
      return dateTimeA.getTime() - dateTimeB.getTime()
    })

  const pastBookings = filteredBookings
    .filter(booking => {
      const dateTime = formatDateTime(booking.date, booking.time)
      return dateTime ? dateTime <= new Date() : false
    })
    .sort((a, b) => {
      const dateTimeA = formatDateTime(a.date, a.time)
      const dateTimeB = formatDateTime(b.date, b.time)
      if (!dateTimeA || !dateTimeB) return 0
      return dateTimeB.getTime() - dateTimeA.getTime()
    })

  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = upcomingBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(upcomingBookings.length / bookingsPerPage)

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  }

  const formatDisplayDate = (date: string) => {
    try {
      return format(parseISO(date), 'PPP')
    } catch (error) {
      console.error('Invalid date format:', error)
      return 'Invalid date'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading your bookings...</CardTitle>
            <CardDescription>Please wait while we fetch your court reservations</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 px-4 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage your pickleball court reservations</p>
          </div>
          <Button onClick={handleNewBooking} size="lg" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-5 w-5" /> New Booking
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">Across all courts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">Reserved sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Games</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastBookings.length}</div>
              <p className="text-xs text-muted-foreground">Completed sessions</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Your Court Reservations</CardTitle>
            <CardDescription>View and manage your pickleball court bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={filterCourt.toString()} onValueChange={(value) => setFilterCourt(value === 'all' ? 'all' : parseInt(value))}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by court" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courts</SelectItem>
                      {Array.from(new Set(bookings.map(b => b.courtId))).map((courtId) => (
                        <SelectItem key={courtId} value={courtId.toString()}>Court {courtId}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <TabsContent value="upcoming">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-semibold">No Upcoming Bookings</h3>
                        <p className="text-muted-foreground mt-1">Time to schedule your next game!</p>
                        <Button onClick={handleNewBooking} className="mt-4">
                          Schedule Now
                        </Button>
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px] rounded-md border">
                        <div className="space-y-4 p-4">
                          {currentBookings.map((booking) => (
                            <Card key={booking.id} className="overflow-hidden transition-all hover:shadow-md">
                              <CardContent className="p-0">
                                <div className="flex items-center justify-between p-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center">
                                      <LandPlot className="h-5 w-5 text-primary mr-2" />
                                      <span className="font-medium">Court {booking.courtId}</span>
                                      <Badge className="ml-2">Upcoming</Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Calendar className="h-4 w-4 mr-2" />
                                      <span>{booking.date ? formatDisplayDate(booking.date) : 'No date'}</span>
                                      <Clock className="h-4 w-4 ml-4 mr-2" />
                                      <span>{booking.time || 'No time'}</span>
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
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleReschedule(booking.id)}>
                                        Reschedule
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => {
                                          setSelectedBooking(booking)
                                          setShowCancelDialog(true)
                                        }}
                                      >
                                        Cancel Booking
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </motion.div>
                </AnimatePresence>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="past">
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="space-y-4 p-4">
                    {pastBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-semibold">No Past Bookings</h3>
                        <p className="text-muted-foreground mt-1">Your booking history will appear here</p>
                      </div>
                    ) : (
                      pastBookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden transition-all hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <LandPlot className="h-5 w-5 text-muted-foreground mr-2" />
                                  <span className="font-medium">Court {booking.courtId}</span>
                                  <Badge variant="outline" className="ml-2">Completed</Badge>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>{booking.date ? formatDisplayDate(booking.date) : 'No date'}</span>
                                  <Clock className="h-4 w-4 ml-4 mr-2" />
                                  <span>{booking.time || 'No time'}</span>
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
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <div className="p-6 bg-primary/5">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Booking Details
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Complete information about your court reservation
              </DialogDescription>
            </DialogHeader>
          </div>
          {selectedBooking && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Court</div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <LandPlot className="h-5 w-5 text-primary" />
                    <span className="font-medium">Court {selectedBooking.courtId}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Date & Time</div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{selectedBooking.date ? formatDisplayDate(selectedBooking.date) : 'No date'}</span>
                    <Clock className="h-5 w-5 text-primary ml-2" />
                    <span>{selectedBooking.time || 'No time'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">User ID</div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium truncate">{selectedBooking.userId}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Booking ID</div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium truncate">{selectedBooking.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => handleReschedule(selectedBooking.id)}
                  className="flex-1 h-11"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Reschedule
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetails(false)
                    setShowCancelDialog(true)
                  }}
                  className="flex-1 h-11"
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to cancel this court reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <LandPlot className="h-5 w-5 text-primary" />
                    <span className="font-medium">Court {selectedBooking.courtId}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedBooking.date ? formatDisplayDate(selectedBooking.date) : 'No date'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{selectedBooking.time || 'No time'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="flex-1"
                >
                  Cancel Booking
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

