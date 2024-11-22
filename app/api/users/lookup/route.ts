import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prismadb } from '@/lib/db'


export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return new NextResponse("Email is required", { status: 400 })
    }

    const user = await prismadb.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, image: true },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USER_LOOKUP]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
