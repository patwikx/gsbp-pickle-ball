import { Booking } from '@/types/bookings'
import { format, parseISO } from 'date-fns'


export const formatDateTime = (date: string | null, time: string | null) => {
  if (!date || !time) return null
  try {
    return new Date(`${date} ${time}`)
  } catch (error) {
    console.error('Invalid date or time format:', error)
    return null
  }
}

export const formatDisplayDate = (date: string) => {
  try {
    return format(parseISO(date), 'PPP')
  } catch (error) {
    console.error('Invalid date format:', error)
    return 'Invalid date'
  }
}

export const filterAndSortBookings = (
  bookings: Booking[],
  searchTerm: string,
  filterCourt: number | 'all'
) => {
  const filtered = bookings.filter(booking => 
    (filterCourt === 'all' || booking.courtId === filterCourt) &&
    (booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     booking.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
     booking.time.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const now = new Date()

  const upcoming = filtered
    .filter(booking => {
      const dateTime = formatDateTime(booking.date, booking.time)
      return dateTime ? dateTime > now : false
    })
    .sort((a, b) => {
      const dateTimeA = formatDateTime(a.date, a.time)
      const dateTimeB = formatDateTime(b.date, b.time)
      if (!dateTimeA || !dateTimeB) return 0
      return dateTimeA.getTime() - dateTimeB.getTime()
    })

  const past = filtered
    .filter(booking => {
      const dateTime = formatDateTime(booking.date, booking.time)
      return dateTime ? dateTime <= now : false
    })
    .sort((a, b) => {
      const dateTimeA = formatDateTime(a.date, a.time)
      const dateTimeB = formatDateTime(b.date, b.time)
      if (!dateTimeA || !dateTimeB) return 0
      return dateTimeB.getTime() - dateTimeA.getTime()
    })

  return { upcoming, past }
}