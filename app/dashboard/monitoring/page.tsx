import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import BookingMonitor from './components/booking-monitor'
import { getCurrentUser } from '@/hooks/use-current-user';
import { redirect } from 'next/navigation';



export default async function BookingMonitorPage() {

  const session = await getCurrentUser();
  if (!session){
    redirect('/auth/sign-in')
  }
  // Check if the user is logged in and has the admin role
  if (!session || session.roles !== 'Administrator') {
    redirect('/dashboard')
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <BookingMonitor />
      </Suspense>
    </div>
  )
}

