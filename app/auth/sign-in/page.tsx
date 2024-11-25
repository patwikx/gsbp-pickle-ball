'use client'

import Link from 'next/link'
import Image from 'next/image'
import { UserAuthForm } from './components/auth-form'
import { Card } from "@/components/ui/card"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
  <Card className="w-[800px] overflow-hidden rounded-3xl">
    <div className="flex flex-col lg:flex-row">
      {/* Left Section with Image */}
      <div className="relative h-[200px] lg:h-auto lg:w-1/2">
        <Image
          src="https://utfs.io/f/pUvyWRtocgCVkHMrpJEt8yXxrNnMQVYoa1gqAFZUHRd9SKG5"
          alt="RD Realty Development Corporation Building"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Section with Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome 👋</h2>
            <p className="text-sm text-muted-foreground">Please login here</p>
          </div>

          <UserAuthForm />

          <div className="text-center text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">
              To report a problem, contact MIS.
            </Link>
          </div>
        </div>
      </div>
    </div>
  </Card>
</div>
  )
}

