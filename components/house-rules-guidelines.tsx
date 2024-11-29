"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuidelinesModal({ isOpen, onClose }: GuidelinesModalProps) {
  const [isAgreed, setIsAgreed] = useState(false)

  const handleAgree = () => {
    // Here you would typically save the user's agreement to your backend
    console.log("User agreed to the guidelines")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            General Santos Business Park Pickleball Guidelines
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold">1. Court Hours and Reservations</h3>
              <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                <li>Operating Hours: Open daily from 5:00 AM to 11:00 PM</li>
                <li>Court Reservations: Courts can be reserved up to 48 hours in advance through our online booking system (pickleball.rdrealty.com.ph)</li>
                <li>Playing Duration: Each session is limited to confirmed booking hours</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">2. Membership Structure and Fees</h3>
              <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                <li>Membership Fee: Php1,000.00 per year</li>
                <li>Payment Methods: We accept cash payment via GSBPPBC cashier</li>
                <li>Refund Policy: Membership fees are non-refundable and non-transferrable</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">3. Access to Courts</h3>
              <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                <li>Access Control: Members will receive membership ID or digital access code upon court entry</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">4. Court Rules and Etiquette</h3>
              <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                <li>Attire: Non-marking shoes and appropriate sportswear are required</li>
                <li>Behavior: All members are expected to demonstrate good sportsmanship and respect towards fellow players and staff. Offensive language or unsportsmanlike conduct will not be tolerated</li>
                <li>Equipment: Members are encouraged to bring their own paddles and balls</li>
                <li>Cleanup: Please remove personal belongings and trash upon leaving the court</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">5. Safety and Maintenance</h3>
              <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                <li>Report Damage: Any court damage or maintenance issues must be reported to staff immediately</li>
                <li>Injury Policy: Play at your own risk. GSBPPBC is not responsible for any injuries sustained during the activity</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">6. Code of Conduct and Violation Penalties</h3>
              <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                <li>Conduct Guidelines: Members must adhere to the rules and show respect for all individuals using the court</li>
                <li>Violations: Breaches of the guidelines may result in warnings, temporary suspension, or revocation of membership privileges</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">7. Parking Area Policy</h3>
              <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                <li>Parking at Your Own Risk. GSBPPBC is not responsible for any loss, theft, or damage to vehicles or their contents while parked on the premises</li>
                <li>Parking is permitted for authorized users only</li>
                <li>No Overnight Parking. Unauthorized vehicles left overnight is subject for Php5,000.00 penalty per night unless explicitly authorized in writing by management</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">8. Contact Information</h3>
              <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                <li>For concerns or questions, you may reach GSBPPBC through this email <a href="mailto:pmd.associate@rdretailgroup.com.ph" className="text-primary hover:underline">pmd.associate@rdretailgroup.com.ph</a> or call <a href="tel:+639992202427" className="text-primary hover:underline">+63 999 220 2427</a></li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="guidelines-agree" 
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            />
            <label
              htmlFor="guidelines-agree"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to follow all the guidelines and policies stated above
            </label>
          </div>
          <Button 
            onClick={handleAgree} 
            disabled={!isAgreed}
            className="w-full sm:w-auto"
          >
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
