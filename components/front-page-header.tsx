'use client'
import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import {  LogIn } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"


export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" : "bg-background"
    )}>
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
        

          {/* Logo and Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-x-2 transition-opacity hover:opacity-90"
          >
            <div className="relative h-8 w-8 sm:h-10 sm:w-10">
              <Image
                src="/rdrdc.webp"
                alt="GSBP Pickle Ball Logo"
                fill
                sizes="(max-width: 640px) 32px, 40px"
                className="object-contain rounded-full ml-4"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-base font-bold ml-4">General Santos Business Park</span>
              <span className="text-xs text-muted-foreground ml-4">Pickleball Court</span>
            </div>
            <span className="font-semibold text-lg sm:hidden ml-4">GSBP Pickleball Court</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            {/* Navigation items removed */}
          </div>

          {/* Auth Button */}
          <Button
            onClick={() => router.push('/auth/sign-in')}
            className="hidden md:inline-flex"
            variant="default"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign-in / Sign-up
          </Button>

          {/* Mobile Auth Button */}
          <Button
            onClick={() => router.push('/auth/sign-in')}
            size="sm"
            className="md:hidden mr-4"
            variant="default"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign-in / Sign-up
          </Button>
        </div>
      </div>
    </header>
  )
}
