'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { MemberRegisterForm } from './components/register-member'
import { PaymentOptions } from './components/payment-options'

export default function SignUp() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200 via-white to-blue-50">
      {/* Background Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
      />
      
      {/* Animated Circles */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[800px] w-[800px] animate-pulse rounded-full bg-green-200/20 blur-3xl" />
        <div className="absolute h-[600px] w-[600px] animate-pulse rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center w-full md:mt-[-70px] md:mb-[-50px] mb-8"
        >
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[1000px] mt-4 sm:mt-8"
        >
          <Card className="overflow-hidden border-0 shadow-2xl mt-24">
            <div className="grid md:grid-cols-2">
              {/* Left Side - Payment Options */}
              <div className="hidden md:block">
                <PaymentOptions />
              </div>

              {/* Right Side - Form */}
              <div className="p-6 sm:p-8 md:p-12">
                <div className="mx-auto max-w-md space-y-6 sm:space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                      Create Account 🎾
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Join us and start your pickle ball journey today
                    </p>
                  </div>

                  <MemberRegisterForm />

                  <div className="space-y-2 text-xs sm:text-sm">
                    <p className="text-center text-gray-600">
                      Already have an account?{" "}
                      <Link 
                        href="/auth/sign-in" 
                        className="font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        Sign in here
                      </Link>
                    </p>
                    <p className="text-center text-xs text-gray-500">
                      By signing up, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-green-600"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-green-600"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
