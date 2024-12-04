'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock, CheckCircle, XCircle, Loader2, Users, X, ChevronRight, MapPin } from 'lucide-react'
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useBookingStore } from '@/app/dashboard/book-schedule/components/booking-store'
import { toast } from '@/hooks/use-toast'


interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  name: string
  email: string
  selectedDate: string
  selectedSlots: string[]
  timeSlots: { id: string; time: string }[]
  bookingStatus: 'idle' | 'loading' | 'success' | 'error'
  onConfirmBooking: () => void
  courtNumber: number
}

export function BookingDialog({
  isOpen,
  onClose,
  name,
  email,
  selectedDate,
  selectedSlots,
  timeSlots,
  bookingStatus,
  onConfirmBooking,
  courtNumber
}: BookingDialogProps) {
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [isLookingUp, setIsLookingUp] = React.useState(false)
  const { invitedPlayers, addInvitedPlayer, removeInvitedPlayer, lookupUserByEmail } = useBookingStore()

  const handleInvitePlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inviteEmail && invitedPlayers.length < 3) {
      setIsLookingUp(true)
      const user = await lookupUserByEmail(inviteEmail)
      setIsLookingUp(false)
      if (user) {
        addInvitedPlayer(user)
        setInviteEmail("")
        toast({
          title: "Success",
          description: `${user.name} has been added.`,
        })
      } else {
        toast({
          title: "Error",
          description: "User not found. Please check the email and try again.",
          variant: "destructive",
        })
      }
    } else if (invitedPlayers.length >= 3) {
      toast({
        title: "Error",
        description: "Maximum of 4 players per court (including you)",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-primary">
                  Court {courtNumber} Reservation
                </DialogTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{selectedDate}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="font-medium text-foreground">Confirm Booking</span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-6">
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</Label>
                  <Input 
                    id="name"
                    value={name} 
                    readOnly
                    className="bg-muted/50 border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    value={email}
                    readOnly
                    className="bg-muted/50 border-primary/20"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-primary">Selected Time Slots</h3>
                  <Badge variant="secondary" className="font-medium">
                    {selectedSlots.length} slot{selectedSlots.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedSlots.map(slotId => {
                    const slot = timeSlots.find(s => s.id === slotId)
                    return slot && (
                      <div 
                        key={slotId}
                        className="flex items-center justify-center gap-2 p-2 rounded-lg bg-primary/[0.08] border border-primary/20 hover:bg-primary/[0.12] transition-colors cursor-default"
                      >
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium">{slot.time}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-primary">Add Guest(s) players</h3>
                  <Badge variant="secondary" className="font-medium">
                    {3 - invitedPlayers.length} spot{3 - invitedPlayers.length !== 1 ? 's' : ''} left
                  </Badge>
                </div>
                <form onSubmit={handleInvitePlayer} className="flex gap-2 mb-4">
                  <Input
                    type="email"
                    placeholder="Enter email to invite"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="submit" disabled={invitedPlayers.length >= 3 || isLookingUp}>
                    {isLookingUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Looking up...
                      </>
                    ) : (
                      'Invite'
                    )}
                  </Button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <AnimatePresence>
                    {invitedPlayers.map((player) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          "group flex items-center justify-between p-2.5 rounded-lg",
                          "bg-primary/[0.08] border border-primary/20 hover:bg-primary/[0.12] transition-colors"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={player.image || undefined} />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm truncate">{player.name}</span>
                            <span className="text-xs text-muted-foreground truncate">{player.email}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInvitedPlayer(player.id)}
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {invitedPlayers.length === 0 && (
                    <div 
                      className="col-span-full flex flex-col items-center justify-center gap-2 py-8 rounded-lg border-2 border-dashed"
                    >
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">No players invited yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 p-4 bg-muted/5 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirmBooking} 
            disabled={bookingStatus === 'loading'}
            className="flex-[2] bg-primary hover:bg-primary/90"
          >
            {bookingStatus === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>

        <AnimatePresence>
          {bookingStatus === 'success' && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-background p-6 rounded-xl shadow-lg max-w-[300px] mx-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-600">
                    Booking Confirmed!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your court has been reserved. We&apos;ve sent a confirmation email with all the details.
                  </p>
                  <Button onClick={onClose} className="mt-6 w-full">
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {bookingStatus === 'error' && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4 bg-destructive/5 border-t border-destructive/10"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
            >
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Booking failed. Please try again or contact support if the issue persists.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
