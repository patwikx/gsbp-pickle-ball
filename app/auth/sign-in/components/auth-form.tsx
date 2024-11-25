'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function UserAuthForm({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
        toast.success("Logged in successfully")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-4", className)}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label className="font-semibold text-left" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label className="font-semibold text-left" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          {/* Forgot Password Link */}
          <div className="text-right text-sm">
            <Link href="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Button className="mt-2" type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  )
}
