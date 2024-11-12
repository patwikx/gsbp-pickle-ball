import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface BookingModalProps {
  courtNumber: number
  onClose: () => void
}

export default function BookingModal({ courtNumber, onClose }: BookingModalProps) {
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Court {courtNumber}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {timeSlots.map((slot) => (
            <Button key={slot} variant="outline" className="justify-start">
              {slot} - Available
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}