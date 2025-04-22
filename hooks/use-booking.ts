import { useState, useEffect } from 'react'
import { Booking } from '@/types/bookings'

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to cancel booking')
      
      setBookings(bookings.filter(booking => booking.id !== bookingId))
      return true
    } catch (err) {
      console.error(err)
      setError('Failed to cancel booking')
      return false
    }
  }

  return {
    bookings,
    error,
    isLoading,
    cancelBooking,
    setBookings
  }
}