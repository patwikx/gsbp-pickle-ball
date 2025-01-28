'use client'

import * as React from 'react'
import { format, parse, addDays } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Court } from '@/types/bookings'

interface DateCourtSelectorProps {
  selectedDate: string
  selectedCourt: number
  courts: Court[]
  onDateChange: (date: string) => void
  onCourtChange: (courtId: number) => void
  isPastDate: (date: string) => boolean
}

export function DateCourtSelector({
  selectedDate,
  selectedCourt,
  courts,
  onDateChange,
  onCourtChange,
  isPastDate,
}: DateCourtSelectorProps) {
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = addDays(today, 1)
    const formattedDate = format(date, 'yyyy-MM-dd')
    
    return (
      isPastDate(formattedDate) || 
      date.getTime() === today.getTime() || 
      date.getTime() === tomorrow.getTime()
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(parse(selectedDate, 'yyyy-MM-dd', new Date()), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={parse(selectedDate, 'yyyy-MM-dd', new Date())}
            onSelect={(date) => date && onDateChange(format(date, 'yyyy-MM-dd'))}
            initialFocus
            disabled={isDateDisabled}
          />
        </PopoverContent>
      </Popover>
      
      <Select 
        value={selectedCourt.toString()} 
        onValueChange={(value) => onCourtChange(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a court" />
        </SelectTrigger>
        <SelectContent>
          {courts.map((court) => (
            <SelectItem key={court.id} value={court.id.toString()}>
              {court.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}