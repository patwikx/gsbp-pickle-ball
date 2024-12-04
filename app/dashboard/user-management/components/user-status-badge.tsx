import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface UserStatusBadgeProps {
  isVerified: boolean | null
  isUpdating: boolean
  onStatusChange: (status: boolean) => void
}

export function UserStatusBadge({ isVerified, isUpdating, onStatusChange }: UserStatusBadgeProps) {
  const [localStatus, setLocalStatus] = useState(isVerified || false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setLocalStatus(isVerified || false)
  }, [isVerified])

  const handleStatusChange = async (newStatus: boolean) => {
    setIsProcessing(true)
    setLocalStatus(newStatus)
    
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000) // 10 second timeout
      })

      await Promise.race([
        onStatusChange(newStatus),
        timeoutPromise
      ])
    } catch (error) {
      console.error('Status update failed:', error)
      setLocalStatus(!newStatus) // Revert on error
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Switch
                checked={localStatus}
                onCheckedChange={handleStatusChange}
                disabled={isProcessing || isUpdating}
                className={cn(
                  "transition-all duration-200",
                  "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
                  (isProcessing || isUpdating) && "opacity-70"
                )}
              />
              {(isProcessing || isUpdating) && (
                <div className="absolute inset-0 flex items-center justify-center">
           
                </div>
              )}
            </div>
            <Badge 
              variant={localStatus ? "default" : "secondary"}
              className={cn(
                "transition-colors duration-200 mt-[-4px]",
                (isProcessing || isUpdating) && "opacity-70"
              )}
            >
              {localStatus ? "Active" : "Inactive"}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top"
        >
          <p>
            {(isProcessing || isUpdating)
              ? "Processing..."
              : `Click to ${localStatus ? "deactivate" : "activate"} user`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}