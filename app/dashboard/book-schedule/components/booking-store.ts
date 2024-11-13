import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'sonner'
import { format, parse } from 'date-fns'

interface TimeSlot {
  id: string
  time: string
  isBooked: boolean
}

interface Court {
  id: number
  name: string
  nextAvailable: string
}

interface BookedSlot {
  courtId: number
  time: string
  date: string
}

interface BookingStore {
  courts: Court[]
  selectedCourt: number
  selectedDate: string
  timeSlots: TimeSlot[]
  selectedSlots: string[]
  name: string
  email: string
  bookingStatus: 'idle' | 'loading' | 'success' | 'error'
  isBookingDialogOpen: boolean
  isLoading: boolean
  setCourts: (courts: Court[]) => void
  setSelectedCourt: (courtId: number) => void
  setSelectedDate: (date: string) => void
  setTimeSlots: (slots: TimeSlot[]) => void
  toggleSelectedSlot: (slotId: string) => void
  setName: (name: string) => void
  setEmail: (email: string) => void
  setBookingStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void
  setIsBookingDialogOpen: (isOpen: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  resetSelectedSlots: () => void
  fetchAndUpdateTimeSlots: (courtId: number, date: string) => Promise<void>
  updateTimeSlot: (slotId: string, isBooked: boolean) => void
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  courts: [
    { id: 1, name: "Court 1", nextAvailable: "10:00 AM" },
    { id: 2, name: "Court 2", nextAvailable: "11:00 AM" },
    { id: 3, name: "Court 3", nextAvailable: "9:00 AM" },
    { id: 4, name: "Court 4", nextAvailable: "12:00 PM" },
  ],
  selectedCourt: 1,
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  timeSlots: [],
  selectedSlots: [],
  name: '',
  email: '',
  bookingStatus: 'idle',
  isBookingDialogOpen: false,
  isLoading: false,
  setCourts: (courts) => set({ courts }),
  setSelectedCourt: (courtId) => set({ selectedCourt: courtId }),
  setSelectedDate: (date: string) => set({ selectedDate: date }),
  setTimeSlots: (slots) => set({ timeSlots: slots }),
  toggleSelectedSlot: (slotId) => set((state) => ({
    selectedSlots: state.selectedSlots.includes(slotId)
      ? state.selectedSlots.filter(id => id !== slotId)
      : [...state.selectedSlots, slotId]
  })),
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setBookingStatus: (status) => set({ bookingStatus: status }),
  setIsBookingDialogOpen: (isOpen) => set({ isBookingDialogOpen: isOpen }),
  setIsLoading: (isLoading) => set({ isLoading }),
  resetSelectedSlots: () => set({ selectedSlots: [] }),

  fetchAndUpdateTimeSlots: async (courtId, date) => {
    const state = get()
    state.setIsLoading(true)
    try {
      const response = await axios.get('/api/fetch-bookings', {
        params: {
          courtId,
          date,
        },
      })
    
      const bookedSlots = response.data.bookedTimeSlots
      const slots: TimeSlot[] = []
    
      // Generate time slots from 6:00 AM to 10:00 PM
      for (let hour = 6; hour <= 23; hour++) {
        // Ensure hour is two digits
        const paddedHour = hour.toString().padStart(2, '0')
        const timeStr = `${paddedHour}:00`
        // Create slot ID with full date and properly formatted time
        const slotId = `${courtId}|${date}|${timeStr}` // Using | as separator to avoid issues with date formats
        
        slots.push({
          id: slotId,
          time: format(parse(`${hour}:00`, 'HH:mm', new Date()), 'h:mm a'),
          isBooked: bookedSlots.some((bookedSlot: BookedSlot) => 
            bookedSlot.courtId === courtId && 
            bookedSlot.time === timeStr && 
            bookedSlot.date === date
          )
        })
      }
    
      state.setTimeSlots(slots)
    } catch (error) {
      console.error("Failed to fetch time slots:", error)
      toast.error("Failed to load time slots. Please try again.")
    } finally {
      state.setIsLoading(false)
    }
  },
  updateTimeSlot: (slotId, isBooked) => set(state => ({
    timeSlots: state.timeSlots.map(slot =>
      slot.id === slotId ? { ...slot, isBooked } : slot
    )
  }))
}))