'use client'

import * as React from 'react'
import { format, parse } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, CalendarIcon, CheckCircle, XCircle, Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCurrentUser } from '@/lib/auth'
import { toast } from 'sonner'
import axios from 'axios'
import { useBookingStore } from '@/app/book-schedule/components/booking-store'

export const revalidate = 0

export default function Component() {
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
    setSelectedCourt,
    setSelectedDate,
    toggleSelectedSlot,
    setName,
    setEmail,
    setIsBookingDialogOpen,
    setBookingStatus,
    resetSelectedSlots,
    fetchAndUpdateTimeSlots,
    updateTimeSlot
  } = useBookingStore()

  const user = useCurrentUser()

  React.useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user, setName, setEmail])

  React.useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data for:', {
        selectedCourt,
        selectedDate
      })
      await fetchAndUpdateTimeSlots(selectedCourt, selectedDate)
    }
    
    fetchData()
  }, [selectedCourt, selectedDate, fetchAndUpdateTimeSlots])

  const handleBooking = async () => {
    if (selectedSlots.length === 0) {
      toast.error("Please select time slots before booking.")
      return
    }
    setBookingStatus('loading')
    try {
      const formattedSlots = selectedSlots.map(slotId => {
        const [courtId, date, time] = slotId.split('-')
        return `${courtId}-${date}-${time}`
      })

      console.log('Sending booking request:', { courtId: selectedCourt, selectedSlots: formattedSlots })

      const response = await axios.post('/api/bookings', {
        courtId: selectedCourt,
        selectedSlots: formattedSlots,
      })

      if (response.status !== 200) {
        throw new Error(response.data.error || 'Failed to create booking')
      }

      setBookingStatus('success')
      
      // Update the booked slots in the UI
      selectedSlots.forEach(slotId => {
        updateTimeSlot(slotId, true)
      })

      resetSelectedSlots()
      toast.success("Booking confirmed successfully!")
    
      // Refresh the time slots immediately after successful booking
      await fetchAndUpdateTimeSlots(selectedCourt, selectedDate)
    } catch (error) {
      console.error('Booking failed:', error)
      setBookingStatus('error')
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("You must be logged in to make a booking. Please log in and try again.")
      } else {
        toast.error("Booking failed. Please try again.")
      }
    } finally {
      setTimeout(() => {
        setIsBookingDialogOpen(false)
        setBookingStatus('idle')
      }, 2000)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          GSBP Pickle Ball Court Booking
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courts.map((court) => (
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Next: {court.nextAvailable}</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="bg-primary/90 hover:bg-primary transition-colors"
                    >
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <span className="bg-primary/10 text-primary p-2 rounded-lg">
                          <CalendarIcon className="w-5 h-5" />
                        </span>
                        {court.name} Schedule
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
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
          />
        </PopoverContent>
      </Popover>
                      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className={cn(
                              "p-3 rounded-xl transition-all duration-200",
                              slot.isBooked 
                                ? 'bg-red-50 text-red-900 border border-red-200' 
                                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                            )}
                          >
                            <div className="text-sm font-medium text-center">{slot.time}</div>
                            {slot.isBooked ? (
                              <div className="flex items-center justify-center gap-1 text-xs mt-2">
                                <Users className="w-3 h-3" />
                                <span className="truncate">Reserved</span>
                              </div>
                            ) : (
                              <div className="flex justify-center mt-2">
                                <Checkbox
                                  checked={selectedSlots.includes(slot.id)}
                                  onCheckedChange={() => toggleSelectedSlot(slot.id)}
                                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedSlots.length > 0 && (
                      <div className="flex justify-end px-4 pb-4">
                        <Button 
                          onClick={() => setIsBookingDialogOpen(true)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Book {selectedSlots.length} Slot{selectedSlots.length > 1 ? 's' : ''}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Clock className="w-5 h-5 text-primary" />
              Court #{selectedCourt} available timeslots.
            </div>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
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
                  />
                </PopoverContent>
              </Popover>
              <Select value={selectedCourt.toString()} onValueChange={(value) => setSelectedCourt(parseInt(value))}>
                <SelectTrigger className="w-[200px]">
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pr-4">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={cn(
                        "p-3 rounded-xl transition-all duration-200",
                        slot.isBooked 
                          ? 'bg-red-50 text-red-900 border border-red-200' 
                          : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-2">
                        {slot.isBooked ? (
                          <>
                            <Users className="w-3 h-3" />
                            <span className="truncate">Reserved</span>
                          </>
                        ) : (
                          <span className="text-emerald-600">Available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                <CalendarIcon className="w-5 h-5" />
              </span>
              Confirm Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                readOnly
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                readOnly
                placeholder="Your email"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Selected Time Slots</Label>
              <div className="rounded-lg border bg-muted/50 p-3">
                <div className="space-y-2">
                  {selectedSlots.map(slotId => {
                    const slot = timeSlots.find(s => s.id === slotId)
                    return slot && (
                      <div key={slotId} className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{slot.time}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleBooking} 
              disabled={bookingStatus === 'loading' || !user}
              className="w-full bg-primary"
            >
              {bookingStatus === 'loading' ? 'Confirming...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
          {bookingStatus === 'success' && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col items-center gap-2 text-emerald-600 p-4">
                <CheckCircle className="w-12 h-12" />
                <p className="font-medium">Booking Confirmed!</p>
              </div>
            </div>
          )}
          {bookingStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 mt-2">
              <XCircle className="w-5 h-5" />
              Booking failed. Please try again.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}