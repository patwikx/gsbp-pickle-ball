"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, ChevronDown, Home, Calendar, LayoutGrid, LogOut, Bell, User, Settings, BookOpen, Users } from 'lucide-react'
import { signOut } from 'next-auth/react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
      {
        href: "/dashboard/monitoring",
        label: 'Booking Monitoring',
        description: "View and manage court bookings",
        icon: LayoutGrid,
        active: pathname === "/dashboard/monitoring",
      },
    ] : []),
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
    </nav>
  )
}

function UserNav() {
  const user = useCurrentUser();
  const router = useRouter();
  
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
          <DropdownMenuItem onClick={() => router.push("/dashboard/my-account")}>
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
  // const { data: session } = useSession()
  const user = useCurrentUser()
  const pathname = usePathname()
  // const router = useRouter()
  
  if (!user) return null
  
  const isAdmin = user?.roles?.includes('Administrator')

  const navigationItems = [
    {
      title: 'Main Menu',
      items: [
        {
          href: "/dashboard",
          label: 'Home',
          icon: Home,
          description: "Overview and quick actions"
        },
        {
          href: "/dashboard/book-schedule",
          label: 'Book a Court',
          icon: BookOpen,
          description: "Schedule your court time"
        },
      ]
    },
    ...(isAdmin ? [{
      title: 'Administration',
      items: [
        {
          href: "/dashboard/monitoring",
          label: 'Booking Monitoring',
          icon: LayoutGrid,
          description: "View and manage court bookings"
        },
        {
          href: "/dashboard/user-management",
          label: 'User Management',
          icon: Users,
          description: "Manage user accounts and permissions"
        },
      ]
    }] : []),
    {
      title: 'Account',
      items: [
        {
          href: "/dashboard/my-account",
          label: 'My Profile',
          icon: User,
          description: "View and edit your profile"
        },
        {
          href: "/dashboard/settings",
          label: 'Settings',
          icon: Settings,
          description: "Manage your preferences"
        },
      ]
    }
  ]

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="px-4 pt-6 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <Image src="/rdrdc.webp" alt="Logo" width={32} height={32} className="rounded-lg" />
          <div>
            <SheetTitle className="text-lg">GSBP Pickleball Court</SheetTitle>
            <p className="text-sm text-muted-foreground">Booking Management System</p>
          </div>
        </div>
      </SheetHeader>
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 py-4">
          {navigationItems.map((section, i) => (
            <div key={i} className="px-4 space-y-3">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/50 text-accent-foreground" : "text-muted-foreground",
                        "transition-all duration-200 ease-in-out"
                      )}
                    >
                      <Icon className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      )} />
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-9 w-9">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'User avatar'}
                width={36}
                height={36}
              />
            ) : (
              <AvatarFallback>
                {user.name
                  ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  : '??'}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
        <Button 
          variant="destructive" 
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
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
              GSBP Pickleball Court
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

