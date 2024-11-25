import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type Player = {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

type BookingDetailsProps = {
  booking: {
    id: string
    courtId: number
    date: string
    time: string
    user: Player
    invitedPlayers: Player[]
  }
}

export default function BookingDetails({ booking }: BookingDetailsProps) {
  return (
    <div className="space-y-4 py-2">
      <div>
        <h4 className="text-sm font-medium mb-2">Invited Players</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {booking.invitedPlayers.map((player) => (
            <div key={player.id} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={player.image || undefined} alt={player.name || 'Invited Player'} />
                <AvatarFallback>{player.name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{player.name || 'Anonymous'}</div>
                <div className="text-sm text-muted-foreground">{player.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Booking ID</h4>
        <Badge variant="outline" className="font-mono">{booking.id}</Badge>
      </div>
    </div>
  )
}

