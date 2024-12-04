import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Calendar, Clock, LandPlot } from 'lucide-react'
import { Booking } from '@/types/bookings'
import { formatDisplayDate } from '@/utils/date-utils'

interface CancelDialogProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (bookingId: string) => void
}

export function CancelDialog({
  booking,
  isOpen,
  onClose,
  onConfirm
}: CancelDialogProps) {
  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription className="text-base">
            Are you sure you want to cancel this court reservation? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <LandPlot className="h-5 w-5 text-primary" />
                <span className="font-medium">Court {booking.courtId}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{booking.date ? formatDisplayDate(booking.date) : 'No date'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{booking.time || 'No time'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={() => onConfirm(booking.id)}
              className="flex-1"
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}