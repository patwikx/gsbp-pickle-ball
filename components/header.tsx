import * as React from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Navbar from './navbar'
import Image from 'next/image'

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/dashboard/book-schedule"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Book a Court
      </Link>
    </nav>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 ml-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/rdrdc.webp" alt="Logo" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block">
              GSBP Pickle Ball Court
            </span>
          </Link>
          <MainNav />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="ml-4 mr-2 px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <span className="font-bold">GSBP Pickle Ball Court</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/book"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Book a Court
                </Link>
                <Link
                  href="/my-bookings"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end space-x-2 mr-8">
  <div className="w-full flex-1 md:w-auto md:flex-none">
    <Navbar />
  </div>
</div>
      </div>
    </header>
  )
}