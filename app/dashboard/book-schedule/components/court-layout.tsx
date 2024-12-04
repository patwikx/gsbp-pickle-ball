'use client'

import * as React from 'react'
import { format, parse } from 'date-fns'
import { debounce } from 'lodash'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, CalendarIcon, Loader } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useCurrentUser } from '@/lib/auth'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useBookingStore } from '@/app/dashboard/book-schedule/components/booking-store'
import { BookingDialog } from '../../../../components/pickle-dialog'
import { Badge } from '../../../../components/ui/badge'
import { sendBookingEmails } from '@/actions/email'

export const revalidate = 0

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
  
      // Send emails to the booker and invited players
      await sendBookingEmails({
        bookerEmail: email,
        bookerName: name,
        invitedPlayers,
        selectedSlots: formattedSlots,
        courtName: courts.find(c => c.id === selectedCourt)?.name || `Court ${selectedCourt}`,
        bookingIds: bookingData.bookings.map((booking: {id: string}) => booking.id)
      })
  
      setBookingStatus('success')
      
      selectedSlots.forEach(slotId => {
        updateTimeSlot(slotId, true)
      })
  
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary to-primary/70 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">
          GSBP Pickle Ball Court Booking
        </h1>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Reserved</span>
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Court Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {courts.map((court) => {
                const courtPlayers = currentPlayers[court.id] || []
                const currentBooking = currentBookings[court.id]
                return (
                  <Card
                    key={court.id}
                    className={cn(
                      "overflow-hidden transition-all duration-200 hover:shadow-lg group",
                      selectedCourt === court.id && "ring-2 ring-primary"
                    )}
                  >
                    <div 
                      className="aspect-[2/1] p-2 cursor-pointer relative overflow-hidden"
                      onClick={() => setSelectedCourt(court.id)}
                    >
                      <div className="absolute inset-0 bg-emerald-600 transition-transform group-hover:scale-105">
                        <div className="absolute inset-2 border-2 border-white/80 rounded opacity-80" />
                        <div className="absolute top-2 bottom-2 left-1/2 w-0.5 -translate-x-1/2 bg-white/80" />
                        <div className="absolute top-1/2 left-2 right-2 h-0.5 -translate-y-1/2 bg-white/80" />
                        <div className="absolute top-[20%] left-2 right-2 h-0.5 bg-white/80" />
                        <div className="absolute bottom-[20%] left-2 right-2 h-0.5 bg-white/80" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xl font-bold px-6 py-2 rounded-full backdrop-blur-sm bg-black/20 shadow-lg">
                          {court.name}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-4">
                        <div className="grid grid-cols-2 items-start gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Current Players</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {courtPlayers.length > 0 ? (
                                <>
                                  {courtPlayers.map((player, index) => (
                                    <TooltipProvider key={index}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Avatar className="w-8 h-8 border-2 border-white">
                                            <AvatarImage src={player.image || undefined} alt={player.name} />
                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{player.name}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ))}
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground">No players currently</span>
                              )}
                            </div>
                          </div>
                          {currentBooking && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Current Booking</span>
                              </div>
                              <Badge className='mt-1 ml-5'>{currentBooking}</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Detailed Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(parse(selectedDate, 'yyyy-MM-dd', new Date()), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parse(selectedDate, 'yyyy-MM-dd', new Date())}
                    onSelect={(date) => date && setSelectedDate(format(date, 'yyyy-MM-dd'))}
                    initialFocus
                    disabled={(date) => isPastDate(format(date, 'yyyy-MM-dd'))}
                  />
                </PopoverContent>
              </Popover>
              <Select value={selectedCourt.toString()} onValueChange={(value) => setSelectedCourt(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a court" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((court) => (
                    <SelectItem key={court.id} value={court.id.toString()}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Timeslots</h3>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[460px] border rounded-md p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
                  {timeSlots[selectedCourt]?.map((slot) => (
                    <TooltipProvider key={slot.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "p-3 rounded-xl transition-all duration-200",
                              slot.isBooked && !isPastTimeSlot(slot.id)
                                ? 'bg-red-50 text-red-900 border border-red-200 cursor-not-allowed'
                                : isPastTimeSlot(slot.id)
                                ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed opacity-60'
                                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                            )}
                            onClick={() => !slot.isBooked && !isPastTimeSlot(slot.id) && toggleSelectedSlot(slot.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{slot.time}</span>
                              </div>
                              {!slot.isBooked && !isPastTimeSlot(slot.id) && (
                                <Checkbox
                                  checked={selectedSlots.includes(slot.id)}
                                  onCheckedChange={() => toggleSelectedSlot(slot.id)}
                                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs mt-2">
                              {slot.isBooked && !isPastTimeSlot(slot.id) ? (
                                <>
                                  <Users className="w-3 h-3" />
                                  <span className="truncate">Reserved</span>
                                </>
                              ) : !isPastTimeSlot(slot.id) ? (
                                <span className="text-emerald-600">Available</span>
                              ) : null}
                            </div>
                          </div>
                        </TooltipTrigger>
                        
                        <TooltipContent>
                          {slot.isBooked && !isPastTimeSlot(slot.id) 
                            ? 'This slot is already booked' 
                            : isPastTimeSlot(slot.id) 
                            ? 'This time slot has passed' 
                            : 'Click to select this time slot'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  </div>
                </ScrollArea>
              )}
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

