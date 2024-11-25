import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import BookingMonitor from './components/booking-monitor'

export default function BookingMonitorPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <BookingMonitor />
      </Suspense>
    </div>
  )
}

