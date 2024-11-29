"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, ChevronDown, Home, Calendar, LayoutGrid, LogOut, Bell, User,} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { useCurrentUser } from '@/lib/auth'

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname()
  const [isMonitoringOpen, setIsMonitoringOpen] = React.useState(false)
  const user = useCurrentUser();
  
  if (!user) return null

  const isAdmin = user?.roles?.includes('Administrator')

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
    ...(isAdmin ? [
      {
        href: "/dashboard/user-management",
        label: 'User Management',
        icon: User,
        active: pathname === "/dashboard/user-management",
      },
    ] : []),
  ]

  const monitoringRoutes = isAdmin ? [
    {
      href: "/dashboard/monitoring",
      label: 'Bookings',
      description: "View and manage court bookings",
      active: pathname === "/dashboard/monitoring",
    },
  ] : []

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
      {isAdmin && (
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
      )}
    </nav>
  )
}

function UserNav() {
  const user = useCurrentUser();
  
  if (!user) return null

  const initials = user.name
  ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  : '??'
  
  return (
    <DropdownMenu>
<DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="relative h-10 flex items-center space-x-2 rounded-lg hover:bg-accent"
        >
          <Avatar className="h-8 w-8">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'User avatar'}
                width={32}
                height={32}
              />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2 md:hidden">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <DropdownMenuSeparator className="md:hidden" />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
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
  const isAdmin = session?.user?.roles?.includes('Admin')
  const pathname = usePathname()
  
  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="space-y-4">
        <div className="flex flex-col space-y-3">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/dashboard" && "text-primary"
            )}
          >
            <Home className="mr-2 h-4 w-4 inline-block" />
            Home
          </Link>
          <Link
            href="/dashboard/book-schedule"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/dashboard/book-schedule" && "text-primary"
            )}
          >
            <Calendar className="mr-2 h-4 w-4 inline-block" />
            Book a Court
          </Link>
          {isAdmin && (
            <>
              <Link
                href="/dashboard/monitoring"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/dashboard/monitoring" && "text-primary"
                )}
              >
                <LayoutGrid className="mr-2 h-4 w-4 inline-block" />
                Monitoring
              </Link>
              <Link
                href="/dashboard/user-management"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/dashboard/user-management" && "text-primary"
                )}
              >
                <User className="mr-2 h-4 w-4 inline-block" />
                User Management
              </Link>
            </>
          )}
        </div>
      </div>
      {session?.user && (
        <Button 
          variant="ghost" 
          className="justify-start px-2 hover:text-destructive w-full"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      )}
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <Image src="/rdrdc.webp" alt="Logo" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block">
              GSBP Pickle Ball Court
            </span>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <div className="flex items-center space-x-2 md:hidden">
            <Image src="/rdrdc.webp" alt="Logo" width={24} height={24} className="rounded-full" />
            <span className="font-semibold text-sm">GSBPPBC</span>
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  )
}

