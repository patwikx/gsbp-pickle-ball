import { BookingsSkeleton } from '@/components/booking-skeleton'
import UserBookingsNew from '@/components/user-booking'
import { Suspense } from 'react'


export default function DashboardPage() {
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <UserBookingsNew />
    </Suspense>
  )
}

