'use client'

import { motion } from 'framer-motion'
import { Building2, CreditCard, Phone, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function PaymentOptions() {
  return (
    <div className="relative h-full bg-gradient-to-br from-primary/90 to-primary p-6 sm:p-8 md:p-12">
      {/* Background Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.primary-foreground/10)_1px,transparent_0)] [background-size:40px_40px]"
      />
      
      <div className="relative space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">Payment Options</h2>
          <p className="mt-2 text-sm text-primary-foreground/80">Choose your preferred payment method</p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 bg-card shadow-md">
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Office Payment</h3>
                </div>
                <div className="space-y-2 pl-12 text-sm text-card-foreground/90">
                  <p>Pay at our office cashier:</p>
                  <p className="font-bold">RD REALTY DEVELOPMENT CORPORATION</p>
                  <p>General Santos Business Park, National Highway</p>
                  <p>General Santos City, Philippines</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 bg-card shadow-md">
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Fund Transfer</h3>
                </div>
                <div className="space-y-2 pl-12 text-sm text-card-foreground/90">
                  <p>BPI Account:</p>
                  <div className="space-y-1">
                    <p>
                      <span className="text-card-foreground/70">Account Name:</span>{" "}
                      <span className="font-bold">RD REALTY DEVELOPMENT CORPORATION</span>
                    </p>
                    <p>
                      <span className="text-card-foreground/70">Account Number:</span>{" "}
                      <span className="font-bold">1241-12124-XXX</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="mt-12 rounded-lg bg-primary-foreground/10 p-6 backdrop-blur-sm"
>
  <div className="space-y-4">
  <div className="flex flex-col items-center space-y-3">
      <h3 className="text-lg font-semibold text-primary-foreground">Need help with payment?</h3>
      <p className="text-sm text-primary-foreground/80">Contact our support team</p>
    </div>
    
    <div className="flex flex-col items-start space-y-3">
      <a 
        href="tel:+639992202427" 
        className="flex items-center space-x-3 text-primary-foreground/90 hover:text-primary-foreground transition-colors group"
      >
        <div className="rounded-full bg-primary-foreground/10 p-2 group-hover:bg-primary-foreground/20 transition-colors">
          <Phone className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">+639 99 220 2427</span>
      </a>
      
      <a 
        href="mailto:pmd.associate@rdretailgroup.com.ph" 
        className="flex items-center space-x-3 text-primary-foreground/90 hover:text-primary-foreground transition-colors group"
      >
        <div className="rounded-full bg-primary-foreground/10 p-2 group-hover:bg-primary-foreground/20 transition-colors">
          <Mail className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">pmd.associate@rdretailgroup.com.ph</span>
      </a>
    </div>
  </div>
</motion.div>



      </div>
    </div>
  )
}

