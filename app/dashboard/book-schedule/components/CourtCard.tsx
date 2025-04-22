'use client'

import * as React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Clock } from 'lucide-react'
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface Player {
  id: string
  name: string
  image?: string
}

interface CourtCardProps {
  id: number
  name: string
  selected: boolean
  currentPlayers: Player[]
  currentBooking: string | null
  onSelect: (id: number) => void
}

export function CourtCard({
  id,
  name,
  selected,
  currentPlayers,
  currentBooking,
  onSelect,
}: CourtCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg group",
        selected && "ring-2 ring-primary"
      )}
    >
      <div 
        className="aspect-[2/1] p-2 cursor-pointer relative overflow-hidden"
        onClick={() => onSelect(id)}
      >
        <div className="absolute inset-0 bg-emerald-600 transition-transform group-hover:scale-105">
          <div className="absolute inset-2 border-2 border-white/80 rounded opacity-80" />
          <div className="absolute top-2 bottom-2 left-1/2 w-0.5 -translate-x-1/2 bg-white/80" />
          <div className="absolute top-1/2 left-2 right-2 h-0.5 -translate-y-1/2 bg-white/80" />
          <div className="absolute top-[20%] left-2 right-2 h-0.5 bg-white/80" />
          <div className="absolute bottom-[20%] left-2 right-2 h-0.5 bg-white/80" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xl font-bold px-6 py-2 rounded-full backdrop-blur-sm bg-black/20 shadow-lg">
            {name}
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Current Players</span>
              </div>
              <div className="flex items-center gap-2">
                {currentPlayers.length > 0 ? (
                  <>
                    {currentPlayers.map((player, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="w-8 h-8 border-2 border-white">
                              <AvatarImage src={player.image} alt={player.name} />
                              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No players currently</span>
                )}
              </div>
            </div>
            {currentBooking && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Current Booking</span>
                </div>
                <Badge className='mt-1 ml-5'>{currentBooking}</Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}