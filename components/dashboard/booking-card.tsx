import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Clock, LandPlot, MoreVertical, RefreshCcw } from 'lucide-react'
import { Booking } from '@/types/bookings'
import { formatDisplayDate } from '@/utils/date-utils'

interface BookingCardProps {
  booking: Booking
  type: 'upcoming' | 'past'
  onViewDetails: (booking: Booking) => void
  onReschedule: (bookingId: string) => void
  onCancelBooking: (booking: Booking) => void
  onBookAgain?: () => void
}

export function BookingCard({
  booking,
  type,
  onViewDetails,
  onReschedule,
  onCancelBooking,
  onBookAgain
}: BookingCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <div className="flex items-center">
              <LandPlot className={`h-5 w-5 ${type === 'upcoming' ? 'text-primary' : 'text-muted-foreground'} mr-2`} />
              <span className="font-medium">Court {booking.courtId}</span>
              <Badge className="ml-2" variant={type === 'upcoming' ? 'default' : 'outline'}>
                {type === 'upcoming' ? 'Upcoming' : 'Completed'}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{booking.date ? formatDisplayDate(booking.date) : 'No date'}</span>
              <Clock className="h-4 w-4 ml-4 mr-2" />
              <span>{booking.time || 'No time'}</span>
            </div>
          </div>
          {type === 'upcoming' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReschedule(booking.id)}>
                  Reschedule
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onCancelBooking(booking)}
                >
                  Cancel Booking
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onBookAgain}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Book Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}