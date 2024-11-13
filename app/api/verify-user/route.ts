import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prismadb } from '@/lib/db'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ isValid: false })
  }

  try {
    const user = await prismadb.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    })

    return NextResponse.json({ isValid: !!user })
  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json({ isValid: false })
  }
}