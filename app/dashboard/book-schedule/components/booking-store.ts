import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'sonner'
import { format, parse, isBefore, startOfDay, setHours, setMinutes } from 'date-fns'

interface Player {
  id: string
  name: string
  email: string
  image: string | null
}

interface TimeSlot {
  id: string
  time: string
  isBooked: boolean
  players: Player[]
}

interface Court {
  id: number
  name: string
  currentPlayers: Player[]
}

interface BookedSlot {
  courtId: number
  time: string
  date: string
  player: Player
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
  invitedPlayers: Player[]
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
  addInvitedPlayer: (player: Player) => void
  removeInvitedPlayer: (playerId: string) => void
  clearInvitedPlayers: () => void
  lookupUserByEmail: (email: string) => Promise<Player | null>
  isPastDate: (date: string) => boolean
  isPastTimeSlot: (slotId: string) => boolean
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  courts: [
    { id: 1, name: "Court 1", currentPlayers: [] },
    { id: 2, name: "Court 2", currentPlayers: [] },
    { id: 3, name: "Court 3", currentPlayers: [] },
    { id: 4, name: "Court 4", currentPlayers: [] },
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
  invitedPlayers: [],
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
    
      const { bookedTimeSlots, currentPlayers } = response.data
      const slots: TimeSlot[] = []
    
      // Generate time slots from 6:00 AM to 10:00 PM
      for (let hour = 6; hour <= 23; hour++) {
        const paddedHour = hour.toString().padStart(2, '0')
        const timeStr = `${paddedHour}:00`
        const slotId = `${courtId}|${date}|${timeStr}`
        
        const isBooked = bookedTimeSlots.some((bookedSlot: BookedSlot) => 
          bookedSlot.courtId === courtId && 
          bookedSlot.time === timeStr && 
          bookedSlot.date === date
        )

        slots.push({
          id: slotId,
          time: format(parse(`${hour}:00`, 'HH:mm', new Date()), 'h:mm a'),
          isBooked: isBooked || state.isPastTimeSlot(slotId),
          players: currentPlayers[timeStr] || []
        })
      }
    
      state.setTimeSlots(slots)

      // Update the current players for the selected court
      state.setCourts(state.courts.map(court => 
        court.id === courtId 
          ? { ...court, currentPlayers: currentPlayers[format(new Date(), 'HH:mm')] || [] }
          : court
      ))
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
  })),
  addInvitedPlayer: (player) => set((state) => ({
    invitedPlayers: [...state.invitedPlayers, player]
  })),
  removeInvitedPlayer: (playerId) => set((state) => ({
    invitedPlayers: state.invitedPlayers.filter(player => player.id !== playerId)
  })),
  clearInvitedPlayers: () => set({ invitedPlayers: [] }),
  lookupUserByEmail: async (email: string) => {
    try {
      const response = await axios.get(`/api/users/lookup?email=${encodeURIComponent(email)}`)
      return response.data
    } catch (error) {
      console.error("Failed to lookup user:", error)
      toast.error("Failed to find user. Please check the email and try again.")
      return null
    }
  },
  isPastDate: (date: string) => {
    const today = startOfDay(new Date())
    const checkDate = startOfDay(parse(date, 'yyyy-MM-dd', new Date()))
    return isBefore(checkDate, today)
  },
  isPastTimeSlot: (slotId: string) => {
    const [, date, time] = slotId.split('|')
    const [hours, minutes] = time.split(':').map(Number)
    const slotDate = setMinutes(setHours(parse(date, 'yyyy-MM-dd', new Date()), hours), minutes)
    return isBefore(slotDate, new Date())
  },
}))

