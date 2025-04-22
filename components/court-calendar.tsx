'use client'

import { useState } from 'react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <CalendarComponent
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}