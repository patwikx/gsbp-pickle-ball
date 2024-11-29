import { BookingsSkeleton } from '@/components/booking-skeleton'
import UserBookingsNew from '@/components/user-booking'
import { getCurrentUser } from '@/hooks/use-current-user';
import { redirect } from 'next/navigation';
import { Suspense } from 'react'


export default async function DashboardPage() {
  const session = await getCurrentUser();

  // Check if the user is logged in and has the admin role
  if (!session ) {
    redirect('/auth/sign-in')
  }
  
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <UserBookingsNew />
    </Suspense>
  )
}

