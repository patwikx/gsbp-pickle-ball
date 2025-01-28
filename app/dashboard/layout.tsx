import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prismadb } from '@/lib/db'
import { Header } from '@/components/header'  // Import the Header component
import SessionWrapper from '@/components/session-provider'
import { ToastContainer } from '@/components/toast-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: session.user.id
    },
  })

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <SessionWrapper>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <TooltipProvider>
        {children}

        </TooltipProvider>
        <Toaster />
        <ToastContainer />
      </main>
    </div>
    </SessionWrapper>
  )
}