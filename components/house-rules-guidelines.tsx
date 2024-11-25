"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from 'lucide-react'

interface PickleballRulesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EnhancedPickleballRulesModal({ isOpen, onClose }: PickleballRulesModalProps) {
  const [isAgreed, setIsAgreed] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const handleAgree = () => {
    // Here you would typically save the user's agreement to your backend
    console.log("User agreed to the rules")
    onClose()
  }

  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Pickleball Court Rules and Guidelines</DialogTitle>
          <DialogDescription>
            Please review and accept our rules and guidelines before using the Pickleball Court Booking System.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="conduct">Conduct</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-grow mt-4 pr-4">
            <TabsContent value="general" className="mt-0">
              <h3 className="text-lg font-semibold mb-2">General Guidelines</h3>
              <section className="space-y-4">
                <div>
                  <h4 className="font-medium">Annual Registration:</h4>
                  <ul className="list-disc pl-6">
                    <li>All members must register annually at the office with a fee of ₱1,000.00</li>
                    <li>Upon registration, members receive a unique ID for booking purposes.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Mandatory Booking:</h4>
                  <ul className="list-disc pl-6">
                    <li>Walk-ins are NOT allowed. Only registered members with advance bookings may use the court.</li>
                    <li>Bookings must be made at least 24 hours prior to the desired playtime.</li>
                    <li>Each booking is limited to 1 hour per session. Additional sessions may be booked if available.</li>
                  </ul>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="safety" className="mt-0">
              <h3 className="text-lg font-semibold mb-2">Safety and Attire</h3>
              <section className="space-y-4">
                <div>
                  <h4 className="font-medium">Appropriate Attire:</h4>
                  <ul className="list-disc pl-6">
                    <li>Players must wear non-marking shoes and proper sports attire.</li>
                    <li>Protective gear such as wristbands, knee pads, or sunglasses is recommended.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Health Precautions:</h4>
                  <ul className="list-disc pl-6">
                    <li>Members with medical conditions should consult their doctor before playing.</li>
                    <li>Report any injuries or accidents to the office immediately.</li>
                  </ul>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="usage" className="mt-0">
              <h3 className="text-lg font-semibold mb-2">Court Usage Rules</h3>
              <section className="space-y-4">
                <div>
                  <h4 className="font-medium">Game Play:</h4>
                  <ul className="list-disc pl-6">
                    <li>Follow standard pickleball rules during play.</li>
                    <li>Ensure fair play and respect for fellow players.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Equipment:</h4>
                  <ul className="list-disc pl-6">
                    <li>Members must bring their own paddles and balls.</li>
                    <li>Limited equipment may be rented from the office for a fee of ₱100.00 per session.</li>
                  </ul>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="conduct" className="mt-0">
              <h3 className="text-lg font-semibold mb-2">Behavioral Expectations</h3>
              <section className="space-y-4">
                <div>
                  <h4 className="font-medium">Sportsmanship:</h4>
                  <ul className="list-disc pl-6">
                    <li>Maintain good sportsmanship at all times.</li>
                    <li>Offensive language, aggressive behavior, or unsportsmanlike conduct will not be tolerated.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Noise Levels:</h4>
                  <ul className="list-disc pl-6">
                    <li>Keep noise to a minimum, especially during early or late hours.</li>
                    <li>Be considerate of nearby residents and other facility users.</li>
                  </ul>
                </div>
              </section>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <Alert className="mt-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Violation of these rules may result in suspension of court access privileges.
          </AlertDescription>
        </Alert>
        <DialogFooter className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agree" 
              checked={isAgreed} 
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            />
            <label
              htmlFor="agree"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the Pickleball Court Rules and Guidelines
            </label>
          </div>
          <Button onClick={handleAgree} disabled={!isAgreed}>
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

