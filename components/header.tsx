"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, ChevronDown, Home, Calendar, LayoutGrid, LogOut, Bell, CreditCard, User, Sparkles } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname()
  const [isMonitoringOpen, setIsMonitoringOpen] = React.useState(false)

  const routes = [
    {
      href: "/dashboard",
      label: 'Home',
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/book-schedule",
      label: 'Book a Court',
      icon: Calendar,
      active: pathname === "/dashboard/book-schedule",
    },
    {
      href: "/dashboard/user-management",
      label: 'User Management',
      icon: User,
      active: pathname === "/dashboard/user-management",
    },
  ]

  const monitoringRoutes = [
    {
      href: "/dashboard/monitoring",
      label: 'Bookings',
      description: "View and manage court bookings",
      active: pathname === "/dashboard/monitoring",
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4", className)}
      {...props}
    >
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all',
                'hover:bg-accent/50 hover:shadow-sm',
                route.active 
                  ? 'bg-accent/60 text-accent-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-accent-foreground'
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {route.label}
            </motion.div>
          </Link>
        )
      })}
      <DropdownMenu open={isMonitoringOpen} onOpenChange={setIsMonitoringOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={monitoringRoutes.some(route => route.active) ? "secondary" : "ghost"} 
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium transition-all",
              "hover:bg-accent/50 hover:shadow-sm",
              monitoringRoutes.some(route => route.active) 
                ? 'bg-accent/60 text-accent-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-accent-foreground'
            )}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Monitoring
            <motion.div
              animate={{ rotate: isMonitoringOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-2 inline-block"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[220px] p-2"
          sideOffset={8}
        >
          {monitoringRoutes.map((route) => (
            <DropdownMenuItem key={route.href} asChild>
              <Link href={route.href} className="w-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex flex-col w-full rounded-md p-2 transition-all',
                    'hover:bg-accent/50',
                    route.active 
                      ? 'bg-accent/60 text-accent-foreground' 
                      : 'text-muted-foreground hover:text-accent-foreground'
                  )}
                >
                  <span className="font-medium">{route.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {route.description}
                  </span>
                </motion.div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

function UserNav() {
  const { data: session } = useSession()
  
  if (!session?.user) return null
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 flex items-center space-x-2 rounded-lg border bg-background px-3 py-2 hover:bg-accent"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{session.user.name}</span>
            <span className="text-xs text-muted-foreground">{session.user.email}</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Upgrade to Pro</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileNav() {
  const { data: session } = useSession()
  
  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/rdrdc.webp" alt="Logo" width={32} height={32} />
          <span className="font-bold">GSBP Pickle Ball Court</span>
        </Link>
      </div>
      {session?.user && (
        <div className="flex items-center space-x-2 border-b pb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{session.user.name}</span>
            <span className="text-xs text-muted-foreground">{session.user.email}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-3">
        <Link
          href="/dashboard"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </Link>
        <Link
          href="/dashboard/book-schedule"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Book a Court
        </Link>
        <Link
          href="/dashboard/monitoring"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Monitoring
        </Link>
        <Link
          href="/dashboard/user-management"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          User Management
        </Link>
        {session?.user && (
          <Button 
            variant="ghost" 
            className="justify-start px-2 hover:text-destructive"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        )}
      </div>
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-8">
        <div className="hidden md:flex md:items-center md:space-x-8 ml-8">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/rdrdc.webp" alt="Logo" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block">
              GSBP Pickle Ball Court
            </span>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <UserNav />
        </div>
      </div>
    </header>
  )
}

