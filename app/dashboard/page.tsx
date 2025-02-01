'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, Search, History, Loader } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GuidelinesModal } from '@/components/house-rules-guidelines'
import { useBookings } from '@/hooks/use-booking'
import { Booking } from '@/types/bookings'
import { filterAndSortBookings } from '@/utils/date-utils'
import { StatsCards } from '@/components/dashboard/stat-cards'
import { BookingCard } from '@/components/dashboard/booking-card'
import { BookingDetails } from '@/components/dashboard/booking-details'
import { CancelDialog } from '@/components/dashboard/cancel-dialog'


const BOOKINGS_PER_PAGE = 5

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

export default function UserBookingsNew() {
  const router = useRouter()
  const { bookings, error, isLoading, cancelBooking } = useBookings()
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)
  const [showDetails, setShowDetails] = React.useState(false)
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)
  const [currentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterCourt, setFilterCourt] = React.useState<number | 'all'>('all')
  const [showRulesModal, setShowRulesModal] = React.useState(true)


  const { upcoming, past } = React.useMemo(
    () => filterAndSortBookings(bookings, searchTerm, filterCourt),
    [bookings, searchTerm, filterCourt]
  )

  const stats = React.useMemo(() => ({
    total: bookings.length,
    upcoming: upcoming.length,
    past: past.length
  }), [bookings.length, upcoming.length, past.length])

  const handleNewBooking = () => {
    router.push('/dashboard/book-schedule')
  }

  const handleReschedule = (bookingId: string) => {
    router.push(`/reschedule/${bookingId}`)
  }

  const handleCancelBooking = async (bookingId: string) => {
    const success = await cancelBooking(bookingId)
    if (success) {
      setShowCancelDialog(false)
      setSelectedBooking(null)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    )
  }

  const currentBookings = upcoming.slice(
    (currentPage - 1) * BOOKINGS_PER_PAGE,
    currentPage * BOOKINGS_PER_PAGE
  )

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

        <StatsCards stats={stats} />

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
                  <Select
                    value={filterCourt.toString()}
                    onValueChange={(value) => setFilterCourt(value === 'all' ? 'all' : parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by court" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courts</SelectItem>
                      {Array.from(new Set(bookings.map(b => b.courtId))).map((courtId) => (
                        <SelectItem key={courtId} value={courtId.toString()}>
                          Court {courtId}
                        </SelectItem>
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
                    <ScrollArea className="h-[400px] rounded-md border">
                      <div className="space-y-4 p-4">
                        {currentBookings.length === 0 ? (
                          <div className="text-center py-12">
                            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-2 text-lg font-semibold">No Upcoming Bookings</h3>
                            <p className="text-muted-foreground mt-1">Time to schedule your next game!</p>
                            <Button onClick={handleNewBooking} className="mt-4">
                              Schedule Now
                            </Button>
                          </div>
                        ) : (
                          currentBookings.map((booking) => (
                            <BookingCard
                              key={booking.id}
                              booking={booking}
                              type="upcoming"
                              onViewDetails={() => {
                                setSelectedBooking(booking)
                                setShowDetails(true)
                              }}
                              onReschedule={handleReschedule}
                              onCancelBooking={(booking) => {
                                setSelectedBooking(booking)
                                setShowCancelDialog(true)
                              }}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="past">
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="space-y-4 p-4">
                    {past.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-semibold">No Past Bookings</h3>
                        <p className="text-muted-foreground mt-1">Your booking history will appear here</p>
                      </div>
                    ) : (
                      past.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          type="past"
                          onViewDetails={() => {}}
                          onReschedule={() => {}}
                          onCancelBooking={() => {}}
                          onBookAgain={handleNewBooking}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <BookingDetails
        booking={selectedBooking}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onReschedule={handleReschedule}
        onCancel={() => {
          setShowDetails(false)
          setShowCancelDialog(true)
        }}
      />

      <CancelDialog
        booking={selectedBooking}
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelBooking}
      />

      <GuidelinesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  )
}