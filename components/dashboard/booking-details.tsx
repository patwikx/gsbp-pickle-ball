import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, LandPlot, User, CreditCard } from 'lucide-react'
import { Booking } from '@/types/bookings'
import { formatDisplayDate } from '@/utils/date-utils'

interface BookingDetailsProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onReschedule: (bookingId: string) => void
  onCancel: () => void
}

export function BookingDetails({
  booking,
  isOpen,
  onClose,
  onReschedule,
  onCancel
}: BookingDetailsProps) {
  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-6 bg-primary/5">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Booking Details
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Complete information about your court reservation
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Court</div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <LandPlot className="h-5 w-5 text-primary" />
                <span className="font-medium">Court {booking.courtId}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Date & Time</div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{booking.date ? formatDisplayDate(booking.date) : 'No date'}</span>
                <Clock className="h-5 w-5 text-primary ml-2" />
                <span>{booking.time || 'No time'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">User ID</div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <span className="font-medium truncate">{booking.userId}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Booking ID</div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-medium truncate">{booking.id}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => onReschedule(booking.id)}
              className="flex-1 h-11"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Reschedule
            </Button>
            <Button
              variant="destructive"
              onClick={onCancel}
              className="flex-1 h-11"
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}