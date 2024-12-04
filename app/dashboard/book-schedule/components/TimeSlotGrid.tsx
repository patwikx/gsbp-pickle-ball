'use client'

import * as React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Loader } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { TimeSlot } from '@/types/bookings'

interface TimeSlotGridProps {
  isLoading: boolean
  timeSlots: TimeSlot[]
  selectedSlots: string[]
  onToggleSlot: (slotId: string) => void
  isPastTimeSlot: (slotId: string) => boolean
}

export function TimeSlotGrid({
  isLoading,
  timeSlots,
  selectedSlots,
  onToggleSlot,
  isPastTimeSlot,
}: TimeSlotGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ScrollArea className="h-[460px] border rounded-md p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
        {timeSlots.map((slot) => (
          <TimeSlotCard
            key={slot.id}
            slot={slot}
            isSelected={selectedSlots.includes(slot.id)}
            onToggle={onToggleSlot}
            isPast={isPastTimeSlot(slot.id)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

interface TimeSlotCardProps {
  slot: TimeSlot
  isSelected: boolean
  onToggle: (slotId: string) => void
  isPast: boolean
}

function TimeSlotCard({ slot, isSelected, onToggle, isPast }: TimeSlotCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              slot.isBooked && !isPast
                ? 'bg-red-50 text-red-900 border border-red-200 cursor-not-allowed'
                : isPast
                ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed opacity-60'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
            )}
            onClick={() => !slot.isBooked && !isPast && onToggle(slot.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{slot.time}</span>
              </div>
              {!slot.isBooked && !isPast && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggle(slot.id)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs mt-2">
              {slot.isBooked && !isPast ? (
                <span className="text-red-600">Reserved</span>
              ) : !isPast ? (
                <span className="text-emerald-600">Available</span>
              ) : (
                <span className="text-gray-500">Past</span>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {slot.isBooked && !isPast 
            ? 'This slot is already booked' 
            : isPast 
            ? 'This time slot has passed' 
            : 'Click to select this time slot'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}