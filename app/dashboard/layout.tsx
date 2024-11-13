import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prismadb } from '@/lib/db'




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

  return <>
  {children}
  </>
}