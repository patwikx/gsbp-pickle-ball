'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrentUser } from '@/lib/auth'
import { toast } from 'sonner'
import { useBookingStore } from './components/booking-store'
import { BookingDialog } from '@/components/pickle-dialog'
import { sendBookingEmails } from '@/actions/email'
import { BookingHeader } from './components/BookingHeader'
import { CourtCard } from './components/CourtCard'
import { DateCourtSelector } from './components/DateCourtSelector'
import { TimeSlotGrid } from './components/TimeSlotGrid'
import { debounce } from 'lodash'
import { format, parse } from 'date-fns'

export default function CourtLayout() {
  const {
    courts,
    selectedCourt,
    selectedDate,
    timeSlots,
    selectedSlots,
    name,
    email,
    bookingStatus,
    isBookingDialogOpen,
    isLoading,
    invitedPlayers,
    setSelectedCourt,
    setSelectedDate,
    toggleSelectedSlot,
    setName,
    setEmail,
    setIsBookingDialogOpen,
    setBookingStatus,
    resetSelectedSlots,
    fetchAndUpdateTimeSlots,
    updateTimeSlot,
    clearInvitedPlayers,
    isPastDate,
    isPastTimeSlot,
    getCurrentPlayers,
  } = useBookingStore()

  const user = useCurrentUser()

  React.useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user, setName, setEmail])

  const debouncedFetch = React.useMemo(
    () => debounce((date: string) => {
      fetchAndUpdateTimeSlots(date)
    }, 300),
    [fetchAndUpdateTimeSlots]
  )

  React.useEffect(() => {
    debouncedFetch(selectedDate)
    return () => {
      debouncedFetch.cancel()
    }
  }, [selectedDate, debouncedFetch])

  const handleBooking = async () => {
    if (selectedSlots.length === 0) {
      toast.error("Please select time slots before booking.")
      return
    }

    setBookingStatus('loading')
    try {
      const formattedSlots = selectedSlots.map(slotId => {
        const [courtId, date, time] = slotId.split('|')
        return `${courtId}-${date}-${time}`
      })
  
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courtId: selectedCourt,
          selectedSlots: formattedSlots,
          invitedPlayers: invitedPlayers.map(p => p.id),
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to create booking')
      }
  
      const bookingData = await response.json()
  
      sendBookingEmails({
        bookerEmail: email,
        bookerName: name,
        invitedPlayers,
        selectedSlots: formattedSlots,
        courtName: courts.find(c => c.id === selectedCourt)?.name || `Court ${selectedCourt}`,
        bookingIds: bookingData.bookings.map((booking: {id: string}) => booking.id)
      })
  
      setBookingStatus('success')
      selectedSlots.forEach(slotId => updateTimeSlot(slotId, true))
      resetSelectedSlots()
      clearInvitedPlayers()
      toast.success("Booking confirmed successfully and emails sent!")
      debouncedFetch(selectedDate)
    } catch (error) {
      console.error('Booking failed:', error)
      setBookingStatus('error')
      toast.error("Booking failed. Please try again.")
    } finally {
      setTimeout(() => {
        setIsBookingDialogOpen(false)
        setBookingStatus('idle')
      }, 3000)
    }
  }

  const currentPlayers = getCurrentPlayers()
  const currentBookings = React.useMemo(() => {
    const now = new Date()
    const currentHour = now.getHours()
    return courts.reduce((acc, court) => {
      const bookedSlot = timeSlots[court.id]?.find(slot => {
        const [, , slotTime] = slot.id.split('|')
        const slotHour = parseInt(slotTime.split(':')[0])
        return slotHour === currentHour && slot.isBooked
      })
      acc[court.id] = bookedSlot ? format(parse(bookedSlot.time, 'h:mm a', new Date()), 'h:mm a') : null
      return acc
    }, {} as { [courtId: number]: string | null })
  }, [courts, timeSlots])

  return (
    <div className="container mx-auto p-2 space-y-6">
      <BookingHeader />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Court Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {courts.map((court) => (
                                                                                                                                <CourtCard
                                                                                                                                                key={court.id}
                                                                                                                                                id={court.id}
                                                                                                                                                name={court.name}
                                                                                                                                                selected={selectedCourt === court.id}
                                                                                                                                                currentPlayers={currentPlayers[court.id].map(player => ({
                                                                                                                                                                ...player,
                                                                                                                                                                image: player.image || undefined
                                                                                                                                                })) || []}
                                                                                                                                                currentBooking={currentBookings[court.id]}
                                                                                                                                                onSelect={setSelectedCourt}
                                                                                                                                />
                                                                                                                ))}
                                                                                                </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Detailed Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DateCourtSelector
              selectedDate={selectedDate}
              selectedCourt={selectedCourt}
              courts={courts}
              onDateChange={setSelectedDate}
              onCourtChange={setSelectedCourt}
              isPastDate={isPastDate}
            />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Timeslots</h3>
              <TimeSlotGrid
                isLoading={isLoading}
                timeSlots={timeSlots[selectedCourt] || []}
                selectedSlots={selectedSlots}
                onToggleSlot={toggleSelectedSlot}
                isPastTimeSlot={isPastTimeSlot}
              />
            </div>

            {selectedSlots.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setIsBookingDialogOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Book {selectedSlots.length} Slot{selectedSlots.length > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BookingDialog
        isOpen={isBookingDialogOpen}
        onClose={() => setIsBookingDialogOpen(false)}
        name={name}
        email={email}
        selectedSlots={selectedSlots}
        selectedDate={selectedDate}
        timeSlots={timeSlots[selectedCourt] || []}
        bookingStatus={bookingStatus}
        onConfirmBooking={handleBooking}
        courtNumber={selectedCourt}
      />
    </div>
  )
}