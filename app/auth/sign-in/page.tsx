'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { UserAuthForm } from './components/auth-form'


export default function SignIn() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-blue-50">
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
{/* Logo and Header */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-center"
>
  <Image
    src="https://utfs.io/f/pUvyWRtocgCVXkOFRZ4SQFwVzqytEldgvRNPo3K4W5XnAihe"
    alt="Pickle Ball Logo"
    width={900}
    height={800}
    className="mx-auto mb-[-50px] mt-[-70px]"
    priority
  />
</motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[1000px]"
        >
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="grid md:grid-cols-2">
              {/* Left Side - Image */}
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br to-blue-900/90 mix-blend-multiply" />
                <Image
                  src="https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5"
                  alt="RD Realty Development Corporation Building"
                  className="h-full object-cover"
                  width={500}
                  height={700}
                  priority
                />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h3 className="mb-2 text-2xl font-bold">RD Realty Development Corporation</h3>
                    <p className="mb-4 text-sm font-light">Your premier destination for pickle ball excellence</p>
                    <div className="flex space-x-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-1 w-8 rounded-full bg-white/60"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-8 sm:p-12">
                <div className="mx-auto max-w-md space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Welcome Back 👋
                    </h2>
                    <p className="text-gray-600">
                      Sign in to book your next pickle ball session
                    </p>
                  </div>

                  <UserAuthForm />

                  <div className="space-y-4 text-sm">
                    <p className="text-center text-gray-600">
                      Need assistance?{" "}
                      <Link 
                        href="/support" 
                        className="font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        Contact our support team
                      </Link>
                    </p>
                    <p className="text-center text-xs text-gray-500">
                      By continuing, you agree to our{" "}
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

