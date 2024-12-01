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
  invitedPlayers: Player[]
}

interface BookingStore {
  courts: Court[]
  selectedCourt: number
  selectedDate: string
  timeSlots: { [courtId: number]: TimeSlot[] }
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
  setTimeSlots: (slots: { [courtId: number]: TimeSlot[] }) => void
  toggleSelectedSlot: (slotId: string) => void
  setName: (name: string) => void
  setEmail: (email: string) => void
  setBookingStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void
  setIsBookingDialogOpen: (isOpen: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  resetSelectedSlots: () => void
  fetchAndUpdateTimeSlots: (date: string) => Promise<void>
  updateTimeSlot: (slotId: string, isBooked: boolean) => void
  addInvitedPlayer: (player: Player) => void
  removeInvitedPlayer: (playerId: string) => void
  clearInvitedPlayers: () => void
  lookupUserByEmail: (email: string) => Promise<Player | null>
  isPastDate: (date: string) => boolean
  isPastTimeSlot: (slotId: string) => boolean
  getCurrentPlayers: () => { [courtId: number]: Player[] }
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
  timeSlots: {},
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
  fetchAndUpdateTimeSlots: async (date: string) => {
    const state = get()
    state.setIsLoading(true)
    try {
      // Fetch bookings for all courts in parallel
      const courtRequests = state.courts.map(court => 
        axios.get('/api/fetch-bookings', {
          params: {
            courtId: court.id,
            date,
          },
        })
      )
      
      const responses = await Promise.all(courtRequests)
      const slots: { [courtId: number]: TimeSlot[] } = {}
      
      state.courts.forEach((court, index) => {
        const { bookedTimeSlots } = responses[index].data
        slots[court.id] = []
        
        // Generate time slots from 6:00 AM to 10:00 PM
        for (let hour = 5; hour <= 23; hour++) {
          const paddedHour = hour.toString().padStart(2, '0')
          const timeStr = `${paddedHour}:00`
          const slotId = `${court.id}|${date}|${timeStr}`
          
          const booking = bookedTimeSlots.find((bookedSlot: BookedSlot) => 
            bookedSlot.courtId === court.id && 
            bookedSlot.time === timeStr && 
            bookedSlot.date === date
          )

          slots[court.id].push({
            id: slotId,
            time: format(parse(`${hour}:00`, 'HH:mm', new Date()), 'h:mm a'),
            isBooked: !!booking,
            players: booking ? [booking.player, ...booking.invitedPlayers] : []
          })
        }
      })
    
      set({ timeSlots: slots })

      // Update the current players for all courts
      set(state => ({
        courts: state.courts.map(court => ({
          ...court,
          currentPlayers: state.getCurrentPlayers()[court.id] || []
        }))
      }))
    } catch (error) {
      console.error("Failed to fetch time slots:", error)
      toast.error("Failed to load time slots. Please try again.")
    } finally {
      set({ isLoading: false })
    }
  },
  updateTimeSlot: (slotId, isBooked) => set(state => {
    const [courtId, , ] = slotId.split('|')
    const courtIdNum = parseInt(courtId)
    return {
      timeSlots: {
        ...state.timeSlots,
        [courtIdNum]: state.timeSlots[courtIdNum].map(slot =>
          slot.id === slotId ? { ...slot, isBooked } : slot
        )
      }
    }
  }),
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
  getCurrentPlayers: () => {
    const state = get()
    const currentTime = new Date()
    const currentHour = currentTime.getHours()
    const currentPlayers: { [courtId: number]: Player[] } = {}

    state.courts.forEach(court => {
      const currentSlot = state.timeSlots[court.id]?.find(slot => {
        const [, , slotTime] = slot.id.split('|')
        const slotHour = parseInt(slotTime.split(':')[0])
        return slotHour === currentHour
      })
      currentPlayers[court.id] = currentSlot ? currentSlot.players : []
    })

    return currentPlayers
  },
}))
