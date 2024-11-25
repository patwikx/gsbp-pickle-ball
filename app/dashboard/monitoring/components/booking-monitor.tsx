'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BookingList from './booking-list'


export default function BookingMonitor() {
  const [date, setDate] = useState<Date>(new Date())
  const [courtId, setCourtId] = useState<string>("all")

  const navigateDate = (direction: 'prev' | 'next') => {
    setDate(prevDate => direction === 'prev' ? addDays(prevDate, -1) : addDays(prevDate, 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Booking Monitor</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateDate('prev')}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="w-[160px]">
            <Button
              variant="outline"
              className="w-full h-9 px-3 justify-center font-normal"
            >
              {format(date, 'MMMM d, yyyy')}
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateDate('next')}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Select value={courtId} onValueChange={setCourtId}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="All Courts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courts</SelectItem>
            <SelectItem value="1">Court 1</SelectItem>
            <SelectItem value="2">Court 2</SelectItem>
            <SelectItem value="3">Court 3</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <BookingList 
          date={format(date, 'yyyy-MM-dd')}
          courtId={courtId === "all" ? undefined : courtId}
        />
      </div>
    </div>
  )
}

