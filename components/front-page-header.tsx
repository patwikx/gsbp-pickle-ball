'use client'

import { useState } from 'react'
import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { Menu, X, Home, Info, DollarSign, Mail, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function HeaderFrontPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'About', icon: Info },
    { name: 'Pricing', icon: DollarSign },
    { name: 'Contact', icon: Mail }
  ]

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Menu Button (Mobile) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link 
                  href={`#${item.name.toLowerCase()}`}
                  className="flex w-full items-center"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo and Brand */}
        <div className="flex items-center justify-between flex-grow md:flex-grow-0">
          <Link href="/" className="flex items-center gap-x-2 shrink-0">
            <div className="relative aspect-square w-8 sm:w-10">
              <Image
                src="/rdrdc.webp"
                alt="GSBP Pickle Ball Logo"
                fill
                sizes='(max-width: 640px) 32px, 40px'
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-base font-bold">General Santos Business Park</span>
              <span className="text-xs text-muted-foreground font-medium">Pickle Ball Court</span>
            </div>
            <span className="font-semibold text-lg sm:hidden">GSBP Pickle Ball Court</span>
          </Link>

          {/* Login Button (Mobile) */}
          <Button
            onClick={() => router.push('/auth/sign-in')}
            size="sm"
            className="md:hidden mr-2"
          >
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 mr-16">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              asChild
            >
              <Link
                href={`#${item.name.toLowerCase()}`}
                className="inline-flex items-center"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-x-4 shrink-0">
          <Button
            onClick={() => router.push('/auth/sign-in')}
          >
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/rdrdc.webp" alt="Logo" width={40} height={40} className="rounded-full" />
              <span className="font-bold text-xl text-primary">GSBP Pickle Ball</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="grid gap-6 p-6">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="justify-start"
                asChild
              >
                <Link
                  href={`#${item.name.toLowerCase()}`}
                  onClick={toggleMenu}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

